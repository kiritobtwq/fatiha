#!/bin/bash
# Запуск сайта Альфатиха для проверки на своём ПК
# Использование: bash start.sh

echo "🕌 Запуск сайта Мечети Альфатиха..."
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js не установлен!"
  echo "Установите: https://nodejs.org/"
  exit 1
fi

echo "✓ Node.js $(node -v)"

# Проверка зависимостей
if [ ! -node_modules ]; then
  echo "📦 Установка зависимостей..."
  npm install
fi

# Проверка .env
if [ ! -f .env ]; then
  echo "❌ Файл .env не найден!"
  echo "Скопируйте .env.example в .env и заполните"
  exit 1
fi

echo "✓ .env найден"

# Запуск
echo ""
echo "🚀 Запуск dev-сервера..."
echo "Откройте в браузере: http://localhost:3000"
echo "Админ-панель: http://localhost:3000/admin"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

npm run dev
