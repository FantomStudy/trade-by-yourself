import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Политика использования cookies — Торгуй сам",
  description: "Политика использования файлов cookies интернет-сервиса TorguiSam.ru",
};

const CookiesPage = () => {
  return (
    <div className={styles.page}>
      {/* Заголовок */}
      <h1>Политика использования файлов Cookies</h1>
      <p className={styles.subtitle}>интернет-сервиса TorguiSam.ru</p>
      <p className={styles.revision}>Редакция от «24» февраля 2026 года</p>

      {/* 1. ВВЕДЕНИЕ */}
      <section>
        <h2>1. ВВЕДЕНИЕ</h2>
        <p>
          1.1. Настоящая Политика использования файлов cookies (далее — «Политика») объясняет, как
          интернет-сервис TorguiSam.ru (далее — «Сайт», «Сервис», «Мы») использует файлы cookies и
          аналогичные технологии при посещении Вами нашего Сайта.
        </p>
        <p>
          1.2. Оператор Сайта: Общество с ограниченной ответственностью «Олимп» (ООО «Олимп»), ИНН
          5609186174, ОГРН 1175658012441, адрес: 460005, Оренбургская область, г. Оренбург, ул.
          Шевченко, д. 20В.
        </p>
        <p>
          1.3. Используя наш Сайт, Вы соглашаетесь с использованием cookies в соответствии с данной
          Политикой. Если Вы не согласны с использованием cookies, Вы можете изменить настройки
          своего браузера или прекратить использование Сайта.
        </p>
        <p>
          1.4. Настоящая Политика является частью{" "}
          <Link href="/privacy">Политики конфиденциальности</Link>.
        </p>
      </section>

      {/* 2. ЧТО ТАКОЕ COOKIES */}
      <section>
        <h2>2. ЧТО ТАКОЕ COOKIES</h2>

        <p className={styles.label}>2.1. Простыми словами</p>
        <p>
          2.1.1. Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на Вашем
          устройстве (компьютере, смартфоне, планшете), когда Вы посещаете веб-сайты.
        </p>
        <p>
          2.1.2. Представьте, что cookies — это «записка», которую сайт оставляет в Вашем браузере.
          Когда Вы возвращаетесь на сайт, он читает эту записку и «вспоминает» Вас: Ваши настройки,
          что Вы смотрели, вошли ли Вы в свой аккаунт.
        </p>
        <p>
          2.1.3. Cookies не являются вирусами или вредоносными программами. Они не могут запускать
          код, получать доступ к файлам на Вашем компьютере или передавать вирусы.
        </p>

        <p className={styles.label}>2.2. Техническое описание</p>
        <p>
          2.2.1. Cookies — это фрагменты данных, отправляемые веб-сервером и сохраняемые в браузере
          пользователя. При каждом последующем посещении сайта браузер отправляет эти данные обратно
          серверу.
        </p>
        <p className={styles.pXs}>2.2.2. Cookies содержат:</p>
        <ul>
          <li>имя cookie;</li>
          <li>значение (данные);</li>
          <li>срок действия;</li>
          <li>домен, к которому относится cookie;</li>
          <li>путь на сайте;</li>
          <li>флаги безопасности.</li>
        </ul>
      </section>

      {/* 3. КАКИЕ ФАЙЛЫ COOKIES МЫ ИСПОЛЬЗУЕМ */}
      <section>
        <h2>3. КАКИЕ ФАЙЛЫ COOKIES МЫ ИСПОЛЬЗУЕМ</h2>

        <p className={styles.labelSpaced}>3.1. Классификация по сроку хранения</p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Тип</th>
                <th>Описание</th>
                <th>Срок хранения</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tdStrong}>Сессионные cookies</td>
                <td>
                  Временные файлы, которые удаляются при закрытии браузера. Необходимы для
                  корректной работы сайта во время Вашего визита
                </td>
                <td>До закрытия браузера</td>
              </tr>
              <tr>
                <td className={styles.tdStrong}>Постоянные cookies</td>
                <td>
                  Сохраняются на Вашем устройстве в течение определённого времени или до момента их
                  удаления Вами. Позволяют «запомнить» Вас при следующих посещениях
                </td>
                <td>От 1 дня до 2 лет</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className={styles.labelSpaced}>3.2. Классификация по назначению</p>

        {/* 3.2.1 */}
        <p className={styles.sublabel}>3.2.1. Строго необходимые (технические) cookies</p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Cookies, без которых Сайт не может нормально работать. Они
          обеспечивают базовые функции: авторизацию, безопасность, сохранение сессии.
        </p>
        <p className={styles.pXs}>Зачем нужны:</p>
        <ul>
          <li>
            чтобы Вы оставались авторизованным в Личном кабинете при переходе между страницами;
          </li>
          <li>чтобы сохранять товары, которые Вы добавили в «Избранное»;</li>
          <li>чтобы обеспечить безопасность Вашей учётной записи;</li>
          <li>чтобы запомнить Ваше согласие на использование cookies.</li>
        </ul>
        <p>
          <strong>Можно ли отключить:</strong> Нет, эти cookies необходимы для работы Сайта. Без них
          многие функции будут недоступны.
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цель</th>
                <th>Срок хранения</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["session_id", "Идентификатор сессии пользователя", "Сессия"],
                ["csrf_token", "Защита от межсайтовой подделки запросов", "Сессия"],
                ["auth_token", "Поддержание авторизации", "До 30 дней"],
                ["cookie_consent", "Сохранение Вашего выбора по cookies", "1 год"],
              ].map(([name, purpose, ttl]) => (
                <tr key={name}>
                  <td className={styles.mono}>{name}</td>
                  <td>{purpose}</td>
                  <td>{ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3.2.2 */}
        <p className={styles.sublabel}>3.2.2. Функциональные cookies</p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Cookies, которые запоминают Ваши предпочтения и настройки, делая
          использование сайта более удобным.
        </p>
        <p className={styles.pXs}>Зачем нужны:</p>
        <ul>
          <li>чтобы запомнить выбранный Вами регион для поиска объявлений;</li>
          <li>чтобы сохранить настройки отображения (вид списка, сортировка);</li>
          <li>чтобы запомнить Ваш язык (если предусмотрена мультиязычность);</li>
          <li>чтобы запомнить, какие категории Вам интересны.</li>
        </ul>
        <p>
          <strong>Можно ли отключить:</strong> Да, но некоторые функции могут работать менее удобно.
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цель</th>
                <th>Срок хранения</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["user_region", "Выбранный регион поиска", "1 год"],
                ["view_settings", "Настройки отображения объявлений", "1 год"],
                ["recent_categories", "Недавно просмотренные категории", "30 дней"],
              ].map(([name, purpose, ttl]) => (
                <tr key={name}>
                  <td className={styles.mono}>{name}</td>
                  <td>{purpose}</td>
                  <td>{ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3.2.3 */}
        <p className={styles.sublabel}>3.2.3. Аналитические (статистические) cookies</p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Cookies, которые помогают нам понять, как посетители используют
          Сайт, какие страницы популярны, где возникают проблемы.
        </p>
        <p className={styles.pXs}>Зачем нужны:</p>
        <ul>
          <li>чтобы считать количество посетителей;</li>
          <li>чтобы понять, какие страницы и объявления популярны;</li>
          <li>чтобы выявлять технические проблемы и ошибки;</li>
          <li>чтобы улучшать удобство использования Сайта;</li>
          <li>чтобы анализировать эффективность нововведений.</li>
        </ul>
        <p className={styles.note}>
          <strong>Важно:</strong> Данные собираются в обезличенном виде. Мы видим статистику, но не
          можем идентифицировать конкретного человека.
        </p>
        <p>
          <strong>Можно ли отключить:</strong> Да, это не повлияет на работу Сайта для Вас.
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Поставщик</th>
                <th>Цель</th>
                <th>Срок хранения</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["_ym_uid", "Яндекс.Метрика", "Идентификатор пользователя для статистики", "1 год"],
                ["_ym_d", "Яндекс.Метрика", "Дата первого визита", "1 год"],
                ["_ym_isad", "Яндекс.Метрика", "Определение блокировщика рекламы", "2 дня"],
                ["_ym_visorc", "Яндекс.Метрика", "Данные для Вебвизора", "30 минут"],
              ].map(([name, provider, purpose, ttl]) => (
                <tr key={name}>
                  <td className={styles.mono}>{name}</td>
                  <td>{provider}</td>
                  <td>{purpose}</td>
                  <td>{ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3.2.4 */}
        <p className={styles.sublabel}>3.2.4. Рекламные (маркетинговые) cookies</p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Cookies, которые используются для показа Вам релевантной рекламы
          и отслеживания эффективности рекламных кампаний.
        </p>
        <p className={styles.pXs}>Зачем нужны:</p>
        <ul>
          <li>чтобы показывать Вам рекламу, которая может быть Вам интересна;</li>
          <li>чтобы ограничить количество показов одной и той же рекламы;</li>
          <li>чтобы измерить эффективность рекламных кампаний;</li>
          <li>чтобы понять, пришли ли Вы к нам по рекламе.</li>
        </ul>
        <p className={styles.note}>
          <strong>Важно:</strong> Эти cookies могут отслеживать Ваше поведение на разных сайтах.
        </p>
        <p>
          <strong>Можно ли отключить:</strong> Да, Вы продолжите видеть рекламу, но она может быть
          менее релевантной.
        </p>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Поставщик</th>
                <th>Цель</th>
                <th>Срок хранения</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ym_metrika...", "Яндекс", "Рекламные кампании Яндекса", "До 2 лет"],
                ["remixlang", "ВКонтакте", "Язык интерфейса VK-виджетов", "1 год"],
                ["remixstid", "ВКонтакте", "Идентификатор для рекламы VK", "1 год"],
              ].map(([name, provider, purpose, ttl]) => (
                <tr key={name}>
                  <td className={styles.mono}>{name}</td>
                  <td>{provider}</td>
                  <td>{purpose}</td>
                  <td>{ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. СТОРОННИЕ COOKIES */}
      <section>
        <h2>4. СТОРОННИЕ COOKIES</h2>

        <p className={styles.label}>4.1. Что такое сторонние cookies</p>
        <p>
          4.1.1. Сторонние cookies (third-party cookies) — это cookies, которые устанавливаются не
          нашим Сайтом, а другими сервисами, интегрированными с нашим Сайтом.
        </p>
        <p>
          4.1.2. Мы не контролируем эти cookies напрямую. Они управляются соответствующими
          сторонними компаниями в соответствии с их собственными политиками.
        </p>

        <p className={styles.label}>4.2. Какие сторонние сервисы мы используем</p>

        <p className={styles.sublabel}>4.2.1. Яндекс.Метрика</p>
        <ul>
          <li>
            <strong>Поставщик:</strong> ООО «ЯНДЕКС» (Россия)
          </li>
          <li>
            <strong>Назначение:</strong> Веб-аналитика, статистика посещений, анализ поведения
            пользователей, Вебвизор
          </li>
          <li>
            <strong>Какие данные собирает:</strong> IP-адрес (в обезличенном виде), информация о
            браузере и устройстве, действия на сайте, источник перехода
          </li>
          <li>
            <strong>Политика конфиденциальности:</strong>{" "}
            <a
              href="https://yandex.ru/legal/confidential/"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://yandex.ru/legal/confidential/
            </a>
          </li>
          <li>
            <strong>Отказ от отслеживания:</strong>{" "}
            <a
              href="https://yandex.ru/support/metrica/general/opt-out.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://yandex.ru/support/metrica/general/opt-out.html
            </a>
          </li>
        </ul>

        <p className={styles.sublabel}>4.2.2. Рекламная сеть Яндекса (РСЯ)</p>
        <ul>
          <li>
            <strong>Поставщик:</strong> ООО «ЯНДЕКС» (Россия)
          </li>
          <li>
            <strong>Назначение:</strong> Показ таргетированной рекламы, ретаргетинг
          </li>
          <li>
            <strong>Управление рекламными предпочтениями:</strong>{" "}
            <a href="https://yandex.ru/tune/adv/" rel="noopener noreferrer" target="_blank">
              https://yandex.ru/tune/adv/
            </a>
          </li>
        </ul>

        <p className={styles.sublabel}>4.2.3. ВКонтакте (VK)</p>
        <ul>
          <li>
            <strong>Поставщик:</strong> ООО «В Контакте» (Россия)
          </li>
          <li>
            <strong>Назначение:</strong> Кнопки «Поделиться», виджеты, аналитика рекламы, пиксель
            отслеживания
          </li>
          <li>
            <strong>Какие данные собирает:</strong> Идентификатор пользователя VK (если
            авторизован), информация о взаимодействии с виджетами
          </li>
          <li>
            <strong>Политика конфиденциальности:</strong>{" "}
            <a href="https://vk.com/privacy" rel="noopener noreferrer" target="_blank">
              https://vk.com/privacy
            </a>
          </li>
          <li>
            <strong>Управление настройками приватности:</strong>{" "}
            <a href="https://vk.com/settings?act=privacy" rel="noopener noreferrer" target="_blank">
              https://vk.com/settings?act=privacy
            </a>
          </li>
        </ul>

        <p className={styles.label}>4.3. Важная информация</p>
        <p>
          4.3.1. Мы тщательно выбираем сторонних партнёров и используем только сервисы проверенных
          компаний.
        </p>
        <p>
          4.3.2. Тем не менее, мы рекомендуем ознакомиться с политиками конфиденциальности сторонних
          сервисов, чтобы понять, как они обрабатывают Ваши данные.
        </p>
        <p>
          4.3.3. Отключение сторонних cookies в настройках браузера распространяется на все сайты,
          которые Вы посещаете.
        </p>
      </section>

      {/* 5. АНАЛОГИЧНЫЕ ТЕХНОЛОГИИ */}
      <section>
        <h2>5. АНАЛОГИЧНЫЕ ТЕХНОЛОГИИ</h2>

        <p>5.1. Помимо cookies, мы можем использовать аналогичные технологии:</p>

        <p className={styles.sublabel}>
          5.1.1. Локальное хранилище (Local Storage, Session Storage)
        </p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Механизм хранения данных в браузере, похожий на cookies, но
          позволяющий хранить больше информации.
        </p>
        <p className={styles.pXs}>Для чего используем:</p>
        <ul>
          <li>сохранение черновиков объявлений;</li>
          <li>кэширование данных для ускорения работы;</li>
          <li>хранение настроек интерфейса.</li>
        </ul>

        <p className={styles.sublabel}>
          5.1.2. Пиксели отслеживания (Web Beacons, Tracking Pixels)
        </p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Невидимые изображения размером 1×1 пиксель, встроенные в
          страницы сайта или email-письма.
        </p>
        <p className={styles.pXs}>Для чего используем:</p>
        <ul>
          <li>для подсчёта просмотров страниц;</li>
          <li>для отслеживания открытия email-рассылок;</li>
          <li>для работы рекламных систем.</li>
        </ul>

        <p className={styles.sublabel}>5.1.3. Скрипты и SDK</p>
        <p className={styles.pXs}>
          <strong>Что это:</strong> Программный код сторонних сервисов, встроенный в наш Сайт.
        </p>
        <p className={styles.pXs}>Для чего используем:</p>
        <ul>
          <li>код Яндекс.Метрики для аналитики;</li>
          <li>виджеты социальных сетей;</li>
          <li>платёжные модули;</li>
          <li>SMS верификация аккаунта.</li>
        </ul>
      </section>

      {/* 6. КАК УПРАВЛЯТЬ COOKIES */}
      <section>
        <h2>6. КАК УПРАВЛЯТЬ COOKIES</h2>

        <p className={styles.label}>6.1. Баннер согласия на cookies</p>
        <p>
          6.1.1. При первом посещении нашего Сайта Вы увидите баннер с информацией об использовании
          cookies.
        </p>
        <p className={styles.pXs}>6.1.2. Вы можете:</p>
        <ul>
          <li>
            <strong>«Принять все»</strong> — согласиться на использование всех типов cookies;
          </li>
          <li>
            <strong>«Только необходимые»</strong> — разрешить только технические cookies;
          </li>
          <li>
            <strong>«Настроить»</strong> — выбрать, какие категории cookies разрешить.
          </li>
        </ul>

        <p className={styles.label}>6.2. Настройки браузера</p>
        <p>6.2.1. Вы можете управлять cookies через настройки Вашего браузера:</p>

        <div className={styles.contentGroup}>
          <div>
            <p className={styles.sublabelXs}>Google Chrome:</p>
            <ol className={styles.listDecimalSm}>
              <li>Откройте меню (три точки в правом верхнем углу)</li>
              <li>
                Перейдите в «Настройки» → «Конфиденциальность и безопасность» → «Файлы cookie и
                другие данные сайтов»
              </li>
              <li>Выберите нужные параметры</li>
            </ol>
            <p className={styles.pTopSm}>
              Подробнее:{" "}
              <a
                href="https://support.google.com/chrome/answer/95647"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://support.google.com/chrome/answer/95647
              </a>
            </p>
          </div>

          <div>
            <p className={styles.sublabelXs}>Mozilla Firefox:</p>
            <ol className={styles.listDecimalSm}>
              <li>Откройте меню (три полоски)</li>
              <li>Перейдите в «Настройки» → «Приватность и защита»</li>
              <li>В разделе «Куки и данные сайтов» настройте параметры</li>
            </ol>
            <p className={styles.pTopSm}>
              Подробнее:{" "}
              <a
                href="https://support.mozilla.org/ru/kb/udalenie-kukov"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://support.mozilla.org/ru/kb/udalenie-kukov
              </a>
            </p>
          </div>

          <div>
            <p className={styles.sublabelXs}>Safari:</p>
            <ol className={styles.listDecimalSm}>
              <li>Откройте «Настройки» → «Safari»</li>
              <li>Перейдите в раздел «Конфиденциальность и безопасность»</li>
              <li>Настройте параметры cookies</li>
            </ol>
            <p className={styles.pTopSm}>
              Подробнее:{" "}
              <a
                href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://support.apple.com/ru-ru/guide/safari/sfri11471/mac
              </a>
            </p>
          </div>

          <div>
            <p className={styles.sublabelXs}>Microsoft Edge:</p>
            <ol className={styles.listDecimalSm}>
              <li>Откройте меню (три точки)</li>
              <li>Перейдите в «Настройки» → «Файлы cookie и разрешения сайтов»</li>
              <li>Выберите нужные параметры</li>
            </ol>
          </div>

          <div>
            <p className={styles.sublabelXs}>Яндекс.Браузер:</p>
            <ol className={styles.listDecimalSm}>
              <li>Откройте меню (три полоски)</li>
              <li>Перейдите в «Настройки» → «Сайты» → «Расширенные настройки сайтов»</li>
              <li>В разделе «Cookie-файлы» настройте параметры</li>
            </ol>
            <p className={styles.pTopSm}>
              Подробнее:{" "}
              <a
                href="https://yandex.ru/support/browser/personal-data-protection/cookies.html"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://yandex.ru/support/browser/personal-data-protection/cookies.html
              </a>
            </p>
          </div>
        </div>

        <p className={styles.label}>6.3. Отказ от аналитических и рекламных cookies</p>
        <p className={styles.pXs}>6.3.1. Яндекс.Метрика:</p>
        <ul>
          <li>
            Установите расширение для браузера:{" "}
            <a
              href="https://yandex.ru/support/metrica/general/opt-out.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              ссылка
            </a>
          </li>
          <li>Или заблокируйте cookies с домена mc.yandex.ru</li>
        </ul>
        <p className={styles.pXs}>6.3.2. Рекламная сеть Яндекса:</p>
        <ul>
          <li>
            Управление рекламными предпочтениями:{" "}
            <a href="https://yandex.ru/tune/adv/" rel="noopener noreferrer" target="_blank">
              https://yandex.ru/tune/adv/
            </a>
          </li>
          <li>Отключите персонализацию рекламы</li>
        </ul>
        <p className={styles.pXs}>6.3.3. ВКонтакте:</p>
        <ul>
          <li>
            Перейдите в настройки приватности:{" "}
            <a href="https://vk.com/settings?act=privacy" rel="noopener noreferrer" target="_blank">
              https://vk.com/settings?act=privacy
            </a>
          </li>
          <li>Отключите таргетированную рекламу</li>
        </ul>
        <p>
          6.3.4. <strong>Do Not Track (DNT):</strong> Вы можете включить в браузере функцию «Не
          отслеживать» (Do Not Track). Однако не все сайты и сервисы учитывают этот сигнал.
        </p>

        <p className={styles.label}>6.4. Последствия отключения cookies</p>
        <p className={styles.pXs}>6.4.1. Если Вы отключите все cookies:</p>
        <ul>
          <li>Вы не сможете авторизоваться в Личном кабинете;</li>
          <li>не будет работать функция «Избранное»;</li>
          <li>при каждом визите придётся заново выбирать регион;</li>
          <li>некоторые страницы могут отображаться некорректно.</li>
        </ul>
        <p className={styles.pXs}>
          6.4.2. Если Вы отключите только аналитические/рекламные cookies:
        </p>
        <ul>
          <li>Сайт будет работать нормально;</li>
          <li>мы не сможем улучшать Сайт на основе статистики;</li>
          <li>реклама станет менее релевантной.</li>
        </ul>
        <p>
          6.4.3. Мы рекомендуем оставить включёнными хотя бы технические и функциональные cookies
          для комфортного использования Сайта.
        </p>
      </section>

      {/* 7. СРОК ХРАНЕНИЯ COOKIES */}
      <section>
        <h2>7. СРОК ХРАНЕНИЯ COOKIES</h2>

        <p>7.1. Различные cookies хранятся разное время:</p>
        <div className={styles.tableWrapMd}>
          <table>
            <thead>
              <tr>
                <th>Тип cookies</th>
                <th>Срок хранения</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Сессионные", "До закрытия браузера"],
                ["Авторизации", "До 30 дней (или до выхода из аккаунта)"],
                ["Функциональные", "До 1 года"],
                ["Аналитические (Яндекс.Метрика)", "До 1 года"],
                ["Рекламные", "До 2 лет"],
                ["Согласие на cookies", "1 год"],
              ].map(([type, ttl]) => (
                <tr key={type}>
                  <td>{type}</td>
                  <td>{ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>7.2. По истечении срока хранения cookies автоматически удаляются.</p>
        <p>7.3. Вы можете удалить cookies вручную в любое время через настройки браузера.</p>
      </section>

      {/* 8. ОБНОВЛЕНИЕ ПОЛИТИКИ */}
      <section>
        <h2>8. ОБНОВЛЕНИЕ ПОЛИТИКИ</h2>
        <p>
          8.1. Мы можем периодически обновлять настоящую Политику для отражения изменений в
          используемых технологиях, законодательстве или наших практиках.
        </p>
        <p>8.2. Актуальная версия Политики всегда доступна на данной странице.</p>
      </section>
    </div>
  );
};

export default CookiesPage;
