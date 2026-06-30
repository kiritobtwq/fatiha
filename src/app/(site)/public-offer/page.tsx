import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { config } from '@/config';

export default function PublicOfferPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8">
          <ArrowLeft size={20} /> На главную
        </Link>

        <h1 className="font-display font-extrabold text-4xl text-text-primary mb-8">
          Публичная оферта
        </h1>

        <div className="card-container p-8 md:p-12 space-y-8">
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">1. Общие положения</h2>
            <p className="text-text-secondary leading-relaxed">
              Настоящий документ является официальным предложением (публичной офертой) Мечети «Фатиха», расположенной по адресу: {config.mosque.address} (далее — «Организация»), для совершения безвозмездного пожертвования (далее — «Пожертвование»).
            </p>
            <p className="text-text-secondary leading-relaxed mt-3">
              В соответствии с п. 3 ст. 437 ГК РФ, акцепт настоящей оферты означает полное и безоговорочное принятие всех условий настоящей Публичной оферты.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">2. Предмет оферты</h2>
            <p className="text-text-secondary leading-relaxed">
              Предметом настоящей оферты является безвозмездное пожертвование денежных средств в пользу Мечети «Фатиха» для осуществления уставной деятельности, включая содержание мечети, проведение религиозных обрядов, образовательной деятельности и строительства/ремонта здания мечети.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">3. Порядок совершения Пожертвования</h2>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5">
              <li>Жертвователь определяет сумму Пожертвования самостоятельно</li>
              <li>Оплата производится через платёжную систему ЮKassa</li>
              <li>Пожертвование считается совершённым с момента зачисления денежных средств</li>
              <li>Жертвователь подтверждает согласие с условиями настоящей Оферты при оплате</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">4. Права и обязанности сторон</h2>
            <p className="text-text-secondary leading-relaxed font-bold mb-2">Организация обязуется:</p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5">
              <li>Использовать полученные средства исключительно на уставные цели</li>
              <li>Обеспечить прозрачность использования пожертвований</li>
              <li>Предоставлять информацию о целевом использовании средств по запросу</li>
            </ul>
            <p className="text-text-secondary leading-relaxed font-bold mb-2 mt-4">Жертвователь обязуется:</p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5">
              <li>Указать достоверные данные при совершении Пожертвования</li>
              <li>Ознакомиться с условиями настоящей Оферты до совершения оплаты</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">5. Ответственность</h2>
            <p className="text-text-secondary leading-relaxed">
              Возврат Пожертвования не допускается, за исключением случаев технической ошибки при проведении платежа. Организация несёт ответственность за надлежащее использование полученных средств в соответствии с действующим законодательством РФ.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">6. Налоговые вычеты</h2>
            <p className="text-text-secondary leading-relaxed">
              В соответствии со ст. 219 НК РФ, налогоплательщик имеет право на социальный налоговый вычет в сумме пожертвований некоммерческим организациям (до 25% от дохода). Для получения вычета сохраните чек об оплате.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">7. Заключительные положения</h2>
            <p className="text-text-secondary leading-relaxed">
              Настоящая Оферта регулируется законодательством Российской Федерации. Все споры разрешаются путём переговоров. При недостижении согласия — в судебном порядке по месту нахождения Организации.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">8. Контакты</h2>
            <p className="text-text-secondary leading-relaxed">
              Мечеть «Фатиха»<br />
              Адрес: {config.mosque.address}<br />
              Email: {config.mosque.email || 'info@alfatiha-birsk.ru'}<br />
              Дата публикации: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
