# Мечеть Фатиха

## Запуск

```bash
git clone https://github.com/kiritobtwq/fatiha.git
cd fatiha
npm install
psql -U postgres -c "CREATE DATABASE alfatiha_db;"
npx prisma db push
npx prisma db seed
npm run dev
```

http://localhost:3000

## ngrok

```bash
ngrok http 3000
```

## Технологии

Next.js 14, React, Tailwind CSS, PostgreSQL, Prisma, YooKassa
