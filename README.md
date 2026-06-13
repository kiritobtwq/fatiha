# Мечеть Фатиха — Сайт

Сбор средств на реконструкцию мечети в г. Бирске.

## Быстрый запуск

### Требования:
- Node.js 20+
- PostgreSQL

### Установка:

```bash
# 1. Клонировать репозиторий
git clone https://github.com/kiritobtwq/fatiha.git
cd fatiha

# 2. Установить зависимости
npm install

# 3. Создать базу данных PostgreSQL
psql -U postgres
CREATE DATABASE alfatiha_db;
\q

# 4. Заполнить БД
npx prisma db push
npx prisma db seed

# 5. Запустить
npm run dev
```

Сайт: http://localhost:3000

---

## Показать сайт через ngrok (без VPS)

Если нужно показать сайт другу или клиенту через интернет:

```bash
# 1. Установить ngrok
# Скачайте с https://ngrok.com/download (Linux/Mac/Windows)
# Или через npm:
npm install -g ngrok

# 2. Зарегистрируйтесь на https://ngrok.com (бесплатно)
# Скопируйте токен из https://dashboard.ngrok.com/get-started/your-authtoken

# 3. Настроить токен
ngrok config add-authtoken ВАШ_ТОКЕН

# 4. Запустить сайт (в первом терминале)
npm run dev

# 5. Запустить туннель (во втором терминале)
ngrok http 3000
```

Выдаст ссылку вида `https://xxxx.ngrok-free.app` — дайте её клиенту.

> **Примечание:** ngrok может не работать если фаервол блокирует порты. В этом случае используйте Cloudflare Tunnel:
> ```bash
> cloudflared tunnel --url http://localhost:3000
> ```

---

## Доступ к приватному репозиторию для друга

### Вариант 1: Добавить друга как Collaborator
1. Зайдите на https://github.com/kiritobtwq/fatiha/settings/access
2. Нажмите "Add people"
3. Введите GitHub-username или email друга
4. Выберите роль "Write" (или "Admin" для полного доступа)
5. Друг получит приглашение на почту

### Вариант 2: Дать логин и пароль
Просто передайте другу:
- Логин: `kiritobtwq`
- Пароль от GitHub

### Вариант 3: Скачать архив
1. Зайдите на репозиторий
2. Нажмите зелёную кнопку "<> Code"
3. Выберите "Download ZIP"
4. Передайте ZIP-файл другу

---

## Админ-панель

- **URL:** http://localhost:3000/alfatiha-secure-panel-2024x9k/login
- **Email:** admin@alfatiha-birsk.ru
- **Пароль:** Alf@tiha2024!Secure

> **ВАЖНО:** Смените пароль после первого входа!

---

## Смена пароля администратора

```bash
# 1. Сгенерировать хеш нового пароля
node -e "require('bcryptjs').hash('ВАШ_НОВЫЙ_ПАРОЛЬ', 10).then(h => console.log(h))"

# 2. Подключиться к БД
psql -U postgres alfatiha_db

# 3. Обновить пароль
UPDATE "AdminUser" SET "passwordHash" = 'ВСТАВЬТЕ_ХЕШ_СЮДА' WHERE email = 'admin@alfatiha-birsk.ru';

# 4. Выйти
\q
```

---

## Смена URL админки

В файле `.env` измените:
```
ADMIN_SECRET_PATH="новый_уникальный_путь"
```

После этого админка будет доступна по `http://localhost:3000/новый_путь/login`

---

## Резервное копирование

```bash
bash backup.sh
```

Создаёт:
- Архив кода в `~/backups/alfatiha/`
- Дамп БД
- Копию `.env`

---

## Настройка аналитики

### Яндекс.Метрика:
1. Зарегистрируйтесь на https://metrika.yandex.ru
2. Создайте счётчик, получите ID
3. В `.env` добавьте: `NEXT_PUBLIC_YANDEX_METRIKA_ID=ваш_id`

### Google Analytics:
1. Зарегистрируйтесь на https://analytics.google.com
2. Создайте свойство, получите ID (G-XXXXXXXXXX)
3. В `.env` добавьте: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

---

## Настройка оплаты (YooKassa)

1. Зарегистрируйтесь на https://yookassa.ru
2. Получите Shop ID и Secret Key
3. В `.env` заполните:
```
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
YOOKASSA_RETURN_URL=https://ваш-сайт.ru/support/success
```
4. В личном кабинете YooKassa настройте вебхук: `https://ваш-сайт.ru/api/webhooks/yookassa`

---

## Деплой на VPS (production)

```bash
# На сервере (Ubuntu 22.04):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install postgresql

# Клонировать и настроить
git clone https://github.com/kiritobtwq/fatiha.git /var/www/fatiha
cd /var/www/fatiha
npm install
npx prisma db push
npx prisma db seed
npm run build

# Создать systemd-сервис (см. HOSTING.md)
# Настроить Nginx (см. HOSTING.md)
# Установить SSL через certbot
```

Подробная инструкция: `HOSTING.md`

---

## Тестирование без реальной оплаты

1. Зайдите в админку
2. На главном экране нажмите **"+ Тестовый донат"**
3. Создаётся пожертвование с `status: "succeeded"`
4. Обновите главную — полоса и список обновятся

---

## Структура проекта

```
src/
├── app/
│   ├── page.tsx              # Главная страница
│   ├── about/page.tsx        # О нас
│   ├── help/page.tsx         # Чем поможем
│   ├── schedule/page.tsx     # Расписание намазов
│   ├── education/page.tsx    # Обучение
│   ├── supporters/page.tsx   # Жертвователи
│   ├── contact/page.tsx      # Контакты
│   ├── support/page.tsx      # Поддержать
│   ├── admin/                # Админ-панель
│   └── api/                  # API endpoints
├── components/
│   ├── Header.tsx            # Шапка сайта
│   ├── DonationModal.tsx     # Модалка пожертвования
│   ├── CookieBanner.tsx      # Cookie-баннер
│   └── admin/                # Компоненты админки
└── lib/
    ├── prisma.ts             # Подключение к БД
    ├── auth.ts               # Авторизация
    ├── yookassa.ts           # Интеграция с YooKassa
    └── rateLimit.ts          # Ограничение запросов
```

---

## Технологии

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **БД:** PostgreSQL + Prisma ORM
- **Оплата:** YooKassa
- **Безопасность:** JWT, rate limiting, Zod валидация

---

## Контакты

- Email: info@alfatiha-birsk.ru
- Адрес: г. Бирск, ул. Пролетарская, 1
