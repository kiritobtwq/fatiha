import Link from 'next/link';
import { Clock, Users, MapPin, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-8">
            О нас
          </h1>
          
          <div className="space-y-12">
            <div className="card-container p-8 md:p-12">
              <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
                Наша история
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Мечеть Фатиха — это сердце нашей мусульманской общины в Бирске. 
                Мы открыли свои двери для всех, кто ищет умиротворение в молитве, 
                знания в учебе и поддержку в трудные моменты.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed">
                Наш путь начался с небольшой молельной комнаты, но благодаря 
                поддержке верующих мы смогли построить современную мечеть, 
                которая вмещает сотни людей и становится центром духовной жизни.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-container p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-primary" size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-2">10 лет</h3>
                <p className="text-text-secondary">на службе общине</p>
              </div>
              <div className="card-container p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-2">500+</h3>
                <p className="text-text-secondary">постоянных прихожан</p>
              </div>
              <div className="card-container p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-primary" size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-2">Бирск</h3>
                <p className="text-text-secondary">наш родной город</p>
              </div>
            </div>

            <div className="bg-bg-accent p-8 md:p-12 rounded-2xl">
              <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
                Наша миссия
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Мы стремимся создать место, где каждый чувствует себя как дома. 
                Где можно обратиться за духовной поддержкой, получить знания, 
                пообщаться с единомышленниками и просто отдохнуть от суеты.
              </p>
            </div>

            <div className="text-center">
              <Link href="/contact" className="btn-primary text-lg px-8 py-4">
                Связаться с нами <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
