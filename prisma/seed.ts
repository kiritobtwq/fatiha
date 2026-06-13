import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Strong password: Alf@tiha2024!Secure
  const adminPassword = 'Alf@tiha2024!Secure';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: 'admin@alfatiha-birsk.ru' },
    update: { passwordHash },
    create: {
      email: 'admin@alfatiha-birsk.ru',
      passwordHash,
    },
  });

  console.log('✓ Admin user created');
  console.log('  Email: admin@alfatiha-birsk.ru');
  console.log('  Password: Alf@tiha2024!Secure');
  console.log('  ⚠ СМЕНИТЕ ПАРОЛЬ ПЕРВОЙ ДЕЙСТВИЕМ В АДМИНКЕ!');

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
