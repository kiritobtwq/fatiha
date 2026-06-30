import type { Metadata } from "next";
import { Playfair_Display, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@/config";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  weight: ["500", "600", "700", "800"],
});
const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: `Мечеть Фатиха — ${config.mosque.city}`,
  description: `Мечеть Фатиха в городе ${config.mosque.city} — место молитвы и знания. Сбор средств на выкуп здания мечети.`,
  openGraph: {
    title: `Мечеть Фатиха — ${config.mosque.city}`,
    description: `Мечеть Фатиха в городе ${config.mosque.city} — место молитвы и знания. Помогите построить мечеть!`,
    url: `https://fatiha-mechet.vercel.app`,
    siteName: 'Мечеть Фатиха',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1280, height: 640 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Мечеть Фатиха — ${config.mosque.city}`,
    description: `Сбор средств на выкуп здания мечети в г. ${config.mosque.city}`,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(${process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID}, "init", {
                  defer: true,
                  clickmap: true,
                  trackLinks: true,
                  accurateTrackBounce: true,
                  webvisor: true
                });
              `,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className={`${playfair.variable} ${nunito.variable} ${jetbrains.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
