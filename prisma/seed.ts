import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fatiha-birsk.ru';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'f@tiha26!SecureP@55w0rd';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  console.log('✓ Admin user created');
  console.log('  Email: ' + adminEmail);
  console.log('  ⚠ Настройте ADMIN_PASSWORD_HASH в Vercel и удалите ADMIN_SEED_PASSWORD');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.prayerSchedule.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      fajr: '03:15',
      dhuhr: '12:30',
      asr: '17:15',
      maghrib: '20:45',
      isha: '22:15',
      juma: '13:00',
    },
  });

  console.log('✓ Prayer schedule created');

  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 2);
  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 5);

  await prisma.event.createMany({
    data: [
      { title: 'Урок арабского языка', description: 'Начальный уровень. Изучение алфавита и правил чтения.', date: futureDate1 },
      { title: 'Пятничная проповедь', description: 'Тема: "Важность благотворительности в Исламе".', date: futureDate2 },
    ],
  });

  console.log('✓ Events created');
  console.log('\n🎉 База данных готова!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
