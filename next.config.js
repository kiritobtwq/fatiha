/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://yookassa.ru https://mc.yandex.ru https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
               "img-src 'self' data: blob: https://res.cloudinary.com https://mc.yandex.ru https://yandex.ru https://*.yandex.ru",
               "connect-src 'self' https://api.yookassa.ru https://mc.yandex.ru https://www.google-analytics.com https://yandex.ru https://*.yandex.ru",
               "font-src 'self' data:",
               "frame-src 'self' https://yookassa.ru https://yandex.ru https://*.yandex.ru",
              "object-src 'none'",
              "base-uri 'none'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
