import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { config } from '@/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8">
          <ArrowLeft size={20} /> На главную
        </Link>

        <h1 className="font-display font-extrabold text-4xl text-text-primary mb-8">
          Политика конфиденциальности
        </h1>

        <div className="card-container p-8 md:p-12 space-y-8">
          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">1. Общие положения</h2>
            <p className="text-text-secondary leading-relaxed">
              Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок обработки персональных данных пользователей сайта alfatiha-birsk.ru (далее — «Сайт»), принадлежащего Мечети «Фатиха», расположенной по адресу: {config.mosque.address}.
            </p>
            <p className="text-text-secondary leading-relaxed mt-3">
              Используя Сайт, вы подтверждаете своё согласие на обработку персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">2. Какие данные мы собираем</h2>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5">
              <li>Имя (если указано при пожертвовании или обращении)</li>
              <li>Адрес электронной почты</li>
              <li>Контактный телефон</li>
              <li>Сумма пожертвования</li>
              <li>IP-адрес и данные браузера (для безопасности)</li>
              <li>Данные cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">3. Цели обработки данных</h2>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5">
              <li>Обработка пожертвований и отправка чеков</li>
              <li>Обратная связь по заявкам пользователей</li>
              <li>Обеспечение безопасности сайта</li>
              <li>Соблюдение требований законодательства</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">4. Защита данных</h2>
            <p className="text-text-secondary leading-relaxed">
              Мы принимаем необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, предоставления, распространения, а также от иных неправомерных действий.
            </p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5 mt-3">
              <li>Использование HTTPS для шифрования данных</li>
              <li>Ограниченный доступ к базе данных</li>
              <li>Регулярное обновление программного обеспечения</li>
              <li>Логирование действий администраторов</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">5. Передача данных третьим лицам</h2>
            <p className="text-text-secondary leading-relaxed">
              Мы не передаём ваши персональные данные третьим лицам, за исключением:
            </p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5 mt-2">
              <li>Платёжная система ЮKassa — для обработки платежей</li>
              <li>Государственные органы — по их законному требованию</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">6. Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              Сайт использует файлы cookies для обеспечения работоспособности, анализа трафика и улучшения качества обслуживания. Вы можете отключить cookies в настройках браузера.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">7. Ваши права</h2>
            <p className="text-text-secondary leading-relaxed">В соответствии с ФЗ-152 вы имеете право:</p>
            <ul className="text-text-secondary leading-relaxed space-y-2 list-disc pl-5 mt-2">
              <li>Запрашивать информацию о ваших персональных данных</li>
              <li>Требовать исправления неточных данных</li>
              <li>Требовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">8. Срок хранения данных</h2>
            <p className="text-text-secondary leading-relaxed">
              Персональные данные хранятся не дольше, чем это необходимо для целей обработки. Данные о пожертвованиях хранятся в соответствии с требованиями бухгалтерского учёта — не менее 5 лет.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">9. Контакты</h2>
            <p className="text-text-secondary leading-relaxed">
              По вопросам обработки персональных данных обращайтесь: {config.mosque.email || 'info@alfatiha-birsk.ru'}
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">10. Изменения</h2>
            <p className="text-text-secondary leading-relaxed">
              Мы оставляем за собой право изменять настоящую Политику. Актуальная версия всегда доступна на данной странице. Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
