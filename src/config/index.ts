export const config = {
  mosque: {
    name: process.env.NEXT_PUBLIC_MOSQUE_NAME || 'Фатиха',
    city: process.env.NEXT_PUBLIC_MOSQUE_CITY || 'Бирск',
    address: process.env.NEXT_PUBLIC_MOSQUE_ADDRESS || '',
    phone: process.env.NEXT_PUBLIC_MOSQUE_PHONE || '',
    email: process.env.NEXT_PUBLIC_MOSQUE_EMAIL || '',
  },
  donationGoal: Number(process.env.NEXT_PUBLIC_DONATION_GOAL) || 10000000, // 10 млн по умолчанию
  timezone: process.env.TIMEZONE || 'Asia/Yekaterinburg',
  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY,
    returnUrl: process.env.YOOKASSA_RETURN_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
  }
};
