import type { Metadata } from "next";
import { Playfair_Display, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@/config";
import Header from "@/components/Header";
import AccessibilityTool from "@/components/AccessibilityTool";
import CookieBanner from "@/components/CookieBanner";
import StylesLoader from "@/components/StylesLoader";
import Link from "next/link";

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
  description: `Мечеть Фатиха в городе ${config.mosque.city} — место молитвы и знания. Сбор средств на реконструкцию мечети.`,
  openGraph: {
    title: `Мечеть Фатиха — ${config.mosque.city}`,
    description: `Мечеть Фатиха в городе ${config.mosque.city} — место молитвы и знания. Помогите построить мечеть!`,
    url: `https://alfatiha-birsk.ru`,
    siteName: 'Мечеть Фатиха',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Мечеть Фатиха — ${config.mosque.city}`,
    description: `Сбор средств на реконструкцию мечети в г. ${config.mosque.city}`,
  },
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
      <body className={`${playfair.variable} ${nunito.variable} ${jetbrains.variable} font-sans antialiased text-slate-900`}>
        <StylesLoader />
        <Header mosqueName="Фатиха" />
        <AccessibilityTool />
        <CookieBanner />

        <div className="header-offset min-h-[calc(100vh-72px)]">
          {children}
        </div>

        <footer className="bg-white border-t border-slate-200 py-20">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border-2 border-primary flex items-center justify-center font-display font-extrabold text-3xl text-primary">
                  А
                </div>
                <span className="font-display font-bold text-2xl text-slate-900">Фатиха</span>
              </Link>
              <p className="text-slate-500 text-base leading-relaxed font-medium">
                Место молитвы, знания и общения для мусульман города {config.mosque.city}. Мы строим будущее вместе.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 font-display text-lg uppercase tracking-wider">Навигация</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-slate-500 hover:text-primary transition-colors font-bold">О нас</Link></li>
                <li><Link href="/help" className="text-slate-500 hover:text-primary transition-colors font-bold">Чем поможем</Link></li>
                <li><Link href="/schedule" className="text-slate-500 hover:text-primary transition-colors font-bold">Расписание</Link></li>
                <li><Link href="/education" className="text-slate-500 hover:text-primary transition-colors font-bold">Обучение</Link></li>
                <li><Link href="/support" className="text-slate-500 hover:text-primary transition-colors font-bold">Поддержать</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 font-display text-lg uppercase tracking-wider">Услуги</h4>
              <ul className="space-y-4">
                <li><Link href="/help" className="text-slate-500 hover:text-primary transition-colors font-bold">Джаназа</Link></li>
                <li><Link href="/help" className="text-slate-500 hover:text-primary transition-colors font-bold">Никях</Link></li>
                <li><Link href="/help" className="text-slate-500 hover:text-primary transition-colors font-bold">Консультация имама</Link></li>
                <li><Link href="/education" className="text-slate-500 hover:text-primary transition-colors font-bold">Уроки Хаджа</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold text-slate-900 mb-8 font-display text-lg uppercase tracking-wider">Контакты</h4>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Адрес</span>
                  <p className="text-slate-600 font-bold">{config.mosque.address}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Телефон</span>
                  <p className="text-slate-600 font-bold">{config.mosque.phone}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</span>
                  <p className="text-slate-600 font-bold">{config.mosque.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400 font-bold">
            <span>&copy; {new Date().getFullYear()} Мечеть Фатиха. Все права защищены.</span>
            <div className="flex gap-8">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Политика конфиденциальности</Link>
              <Link href="/public-offer" className="hover:text-primary transition-colors">Публичная оферта</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
