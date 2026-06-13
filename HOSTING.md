# 🕌 Инструкция по запуску и хостингу сайта Мечети Альфатиха

## Запуск на своём ПК (для проверки)

### Быстрый запуск:
```bash
cd Alfatiha
bash start.sh
```
Откройте http://localhost:3000 в браузере.

### Ручной запуск:
```bash
cd Alfatiha
npm install
npm run dev
```

### Логин в админку:
- URL: http://localhost:3000/admin
- Email: admin@alfatiha-birsk.ru
- Пароль: adminpassword123
- **Смените пароль после первого входа!**

---

## Резервное копирование

```bash
bash backup.sh
```
Создаст бэкап в ~/backups/alfatiha/

---

## Хостинг на VPS (production)

### Требования:
- Ubuntu 22.04 LTS
- 2GB RAM, 20GB SSD
- Доменное имя

### Установка:

```bash
# 1. Подключиться к серверу
ssh root@ваш-ip

# 2. Установить Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Установить PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
CREATE USER alfatiha WITH PASSWORD 'ваш_пароль';
CREATE DATABASE alfatiha_db OWNER alfatiha;
\q

# 4. Клонировать проект
git clone ваш-репозиторий /var/www/alfatiha
cd /var/www/alfatiha

# 5. Настроить .env
nano .env
# Заполните реальными значениями:
# DATABASE_URL="postgresql://alfatiha:ваш_пароль@localhost:5432/alfatiha_db"
# YOOKASSA_SHOP_ID="ваш_id"
# YOOKASSA_SECRET_KEY="ваш_ключ"
# JWT_SECRET="случайная_строка_64_символа"
# YOOKASSA_RETURN_URL="https://alfatiha-birsk.ru/donate/success"
# NEXT_PUBLIC_YANDEX_METRIKA_ID="ваш_id"
# NEXT_PUBLIC_GA_ID="ваш_id"

# 6. Собрать
npm install
npx prisma db push
npx prisma db seed
npm run build

# 7. Создать systemd-сервис
sudo nano /etc/systemd/system/alfatiha.service
```

Файл сервиса:
```
[Unit]
Description=Alfatiha Mosque
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/alfatiha
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
# 8. Запустить
sudo systemctl enable alfatiha
sudo systemctl start alfatiha

# 9. Настроить Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/alfatiha
```

```nginx
server {
    listen 80;
    server_name alfatiha-birsk.ru www.alfatiha-birsk.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 10. Включить SSL
sudo ln -s /etc/nginx/sites-available/alfatiha /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alfatiha-birsk.ru -d www.alfatiha-birsk.ru
```

---

## Деплой на Vercel (проще)

```bash
npm i -g vercel
vercel --prod
```
Внешняя БД: Neon, Supabase или Railway (бесплатные тарифы).

---

## Смена пароля администратора

```bash
# Подключиться к БД
sudo -u postgres psql alfatiha_db

# Сгенерировать новый хеш (на локальном ПК)
node -e "require('bcryptjs').hash('новый_пароль', 10).then(h => console.log(h))"

# Обновить в БД
UPDATE "AdminUser" SET "passwordHash" = 'вставленный_хеш' WHERE email = 'admin@alfatiha-birsk.ru';
\q
```

---

## Чеклист перед запуском

- [ ] Заполнены все переменные в .env
- [ ] Сменён пароль администратора
- [ ] Настроен SSL-сертификат
- [ ] Настроена аналитика (Метрика/GA)
- [ ] Проверены все формы отправки
- [ ] Проверена оплата через YooKassa
- [ ] Настроен бэкап БД (cron)
