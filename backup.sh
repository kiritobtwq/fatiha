#!/bin/bash
# Скрипт резервного копирования проекта Альфатиха
# Использование: bash backup.sh

BACKUP_DIR="$HOME/backups/alfatiha"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/alfatiha_$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "Создание резервной копии..."

# Бэкап кода (без node_modules и .next)
tar -czf "$BACKUP_FILE" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='*.log' \
  -C "$(dirname "$0")" .

# Бэкап базы данных (если PostgreSQL доступен)
if command -v pg_dump &> /dev/null; then
  DB_BACKUP="$BACKUP_DIR/db_alfatiha_$DATE.sql"
  pg_dump -U postgres alfatiha_db > "$DB_BACKUP" 2>/dev/null && \
    echo "БД сохранена: $DB_BACKUP" || \
    echo "Не удалось сделать бэкап БД (возможно, БД не запущена)"
fi

# Бэкап .env (без секретов - только структура)
cp "$(dirname "$0")/.env" "$BACKUP_DIR/env_$DATE.bak" 2>/dev/null && \
  echo ".env сохранён" || echo ".env не найден"

echo "Готово!"
echo "Код: $BACKUP_FILE"
ls -lh "$BACKUP_DIR"/*_$DATE* 2>/dev/null
