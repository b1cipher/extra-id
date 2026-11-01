// Extra ID — вкладка «Информация».
//
// ═══ ВАШИ ССЫЛКИ (редактировать здесь) ═══
// Каждый раздел показывается только если в нём есть хотя бы одна ссылка.
// Разрешены только адреса https:// и mailto:.
// label — строка или объект по языкам: { en: 'Read the article', ru: 'Читать статью' }.
// Если для языка подписи нет, берётся en, затем любая доступная.
//
//   more     — «Подробнее» (статья, профиль, сайт автора)
//   contacts — контакты (почта, Telegram, соцсети)
//   donate   — поддержка проекта (донаты)
//
// Пример:
//   more: [{ url: 'https://example.com/extra-id', label: { en: 'Read more about Extra ID', ru: 'Подробнее о Extra ID' } }],
//   contacts: [{ url: 'mailto:me@example.com', label: 'me@example.com' }],
//   donate: [{ url: 'https://example.com/donate', label: { en: 'Donate', ru: 'Поддержать' } }],
export const INFO_LINKS = {
  more: [],
  contacts: [
    { url: 'mailto:b1cipher@proton.me', label: { en: 'Email', ru: 'Электронная почта', uk: 'Електронна пошта', de: 'E-Mail', fr: 'E-mail', es: 'Correo', it: 'E-mail', pl: 'E-mail', ja: 'メール', hi: 'ईमेल', id: 'Email', pt: 'E-mail' } },
  ],
  donate: [
    { url: 'https://tourniquet.app/donate/b1cipher', label: { en: 'Support the developer', ru: 'Поддержать разработчика', uk: 'Підтримати розробника', de: 'Entwickler unterstützen', fr: 'Soutenir le développeur', es: 'Apoyar al desarrollador', it: 'Sostieni lo sviluppatore', pl: 'Wesprzyj autora', ja: '開発者を支援', hi: 'डेवलपर का समर्थन करें', id: 'Dukung pengembang', pt: 'Apoiar o desenvolvedor' } },
  ],
};

// ═══ Тексты ═══
// faq — пары [вопрос, ответ]; tips — пары [заголовок, текст].
export const INFO = {
  en: {
    faqTitle: 'FAQ',
    tipsTitle: 'Security and anonymity tips',
    moreTitle: 'Learn more',
    contactsTitle: 'Contacts',
    donateTitle: 'Support the project',
    faq: [
      ['Are my real details shared?', 'No. Websites receive only what the selected profile contains. The extension never asks for your real name or email.'],
      ['Where is my data stored?', 'In this browser only. It is encrypted with a key kept next to it, which hides it from casual viewing but not from someone with access to your browser profile. Exported backups are not encrypted.'],
      ['What does the sites list keep?', 'Sites where you filled a form with a profile and the unique password created for each one, saved locally. You can view, copy or delete them.'],
      ['Why do some sites reject the temporary email?', 'Many services block known disposable-mail domains. Use temporary mailboxes only for low-stakes sign-ups.'],
    ],
    tips: [
      ['One password per site', 'Never reuse passwords. The profile gives each service its own random one; a password manager helps for the accounts that matter.'],
      ['Keep it for low-stakes accounts', 'A temporary mailbox can disappear. Don’t use it for banks, government services or anything you may need to recover later.'],
      ['A fake name is not full anonymity', 'Your IP address, cookies, browser fingerprint and payment details can still link you. For stronger anonymity, look at tools like Tor Browser.'],
      ['Check links before you click', 'Emails from unknown senders can be phishing. Compare the address in your browser with the site you expect before entering anything.'],
      ['Turn on two-factor authentication', 'For accounts that matter, use an authenticator app; codes sent to a disposable mailbox are a weak second factor.'],
      ['Use it responsibly', 'Some services legitimately require real details. Don’t use profiles to dodge bans, age checks or identity verification.'],
    ],
  },
  ru: {
    faqTitle: 'FAQ',
    tipsTitle: 'Советы по безопасности и анонимности',
    moreTitle: 'Подробнее',
    contactsTitle: 'Контакты',
    donateTitle: 'Поддержать проект',
    faq: [
      ['Передаются ли мои настоящие данные?', 'Нет. Сайты получают только то, что есть в выбранной персоне. Расширение не запрашивает ваше настоящее имя и почту.'],
      ['Где хранятся мои данные?', 'Только в этом браузере. Они зашифрованы ключом, который лежит рядом: это скрывает их от случайного взгляда, но не от того, кто получил доступ к вашему профилю браузера. Экспортированные копии не шифруются.'],
      ['Что хранит список сайтов?', 'Сайты, где вы заполняли форму персоной, и уникальный пароль каждого из них — локально. Их можно посмотреть, скопировать или удалить.'],
      ['Почему некоторые сайты не принимают временную почту?', 'Многие сервисы блокируют известные домены одноразовых ящиков. Используйте временную почту только для некритичных регистраций.'],
    ],
    tips: [
      ['Один пароль — один сайт', 'Не повторяйте пароли. Персона даёт каждому сервису свой случайный пароль; для важных аккаунтов удобен менеджер паролей.'],
      ['Только для некритичных аккаунтов', 'Временный ящик может исчезнуть. Не используйте его для банков, госуслуг и всего, что вам понадобится восстановить.'],
      ['Вымышленное имя — не полная анонимность', 'Вас по-прежнему могут связать IP-адрес, cookie, отпечаток браузера и платёжные данные. Для более серьёзной анонимности изучите такие инструменты, как Tor Browser.'],
      ['Проверяйте ссылки перед кликом', 'Письма от неизвестных отправителей могут быть фишингом. Сверяйте адрес в браузере с ожидаемым сайтом, прежде чем что-то вводить.'],
      ['Включайте двухфакторную защиту', 'Для важных аккаунтов используйте приложение-аутентификатор: коды на одноразовый ящик — слабый второй фактор.'],
      ['Используйте ответственно', 'Некоторые сервисы вправе требовать настоящие данные. Не применяйте персоны, чтобы обходить баны, возрастные ограничения и проверку личности.'],
    ],
  },
  es: {
    faqTitle: 'Preguntas frecuentes',
    tipsTitle: 'Consejos de seguridad y anonimato',
    moreTitle: 'Más información',
    contactsTitle: 'Contacto',
    donateTitle: 'Apoyar el proyecto',
    faq: [
      ['¿Se comparten mis datos reales?', 'No. Los sitios solo reciben lo que contiene el perfil elegido. La extensión nunca te pide tu nombre ni tu correo reales.'],
      ['¿Dónde se guardan mis datos?', 'Solo en este navegador. Se cifran con una clave guardada junto a ellos: eso evita miradas casuales, pero no protege frente a quien acceda a tu perfil del navegador. Las copias exportadas no están cifradas.'],
      ['¿Qué guarda la lista de sitios?', 'Los sitios donde rellenaste un formulario con un perfil y la contraseña única de cada uno, en local. Puedes verlos, copiarlos o borrarlos.'],
      ['¿Por qué algunos sitios rechazan el correo temporal?', 'Muchos servicios bloquean los dominios de correo desechable conocidos. Úsalo solo para registros de poca importancia.'],
    ],
    tips: [
      ['Una contraseña por sitio', 'No repitas contraseñas. El perfil da a cada servicio una aleatoria; para las cuentas importantes ayuda un gestor de contraseñas.'],
      ['Solo para cuentas poco importantes', 'Un buzón temporal puede desaparecer. No lo uses para bancos, trámites oficiales ni nada que quizá debas recuperar.'],
      ['Un nombre falso no es anonimato total', 'La IP, las cookies, la huella del navegador y los datos de pago aún pueden vincularte. Para más anonimato, mira herramientas como Tor Browser.'],
      ['Revisa los enlaces antes de pulsar', 'Los correos de remitentes desconocidos pueden ser phishing. Compara la dirección del navegador con el sitio esperado antes de escribir nada.'],
      ['Activa la verificación en dos pasos', 'En cuentas importantes usa una app de autenticación; los códigos enviados a un buzón desechable son un segundo factor débil.'],
      ['Úsalo con responsabilidad', 'Algunos servicios exigen legítimamente datos reales. No uses los perfiles para eludir bloqueos, controles de edad ni verificaciones de identidad.'],
    ],
  },
  pt: {
    faqTitle: 'Perguntas frequentes',
    tipsTitle: 'Dicas de segurança e anonimato',
    moreTitle: 'Saiba mais',
    contactsTitle: 'Contatos',
    donateTitle: 'Apoiar o projeto',
    faq: [
      ['Meus dados reais são compartilhados?', 'Não. Os sites recebem só o que está no perfil escolhido. A extensão nunca pede seu nome ou e-mail reais.'],
      ['Onde meus dados ficam guardados?', 'Somente neste navegador. Eles são criptografados com uma chave guardada ao lado, o que evita olhares casuais, mas não protege contra quem acessar seu perfil do navegador. Backups exportados não são criptografados.'],
      ['O que a lista de sites guarda?', 'Os sites em que você preencheu um formulário com um perfil e a senha única de cada um, salvos localmente. Você pode ver, copiar ou apagar.'],
      ['Por que alguns sites rejeitam o e-mail temporário?', 'Muitos serviços bloqueiam domínios conhecidos de e-mail descartável. Use só em cadastros de pouca importância.'],
    ],
    tips: [
      ['Uma senha por site', 'Não reutilize senhas. O perfil dá a cada serviço uma senha aleatória; para contas importantes, um gerenciador de senhas ajuda.'],
      ['Só para contas sem importância', 'Uma caixa temporária pode sumir. Não use para bancos, serviços públicos nem nada que talvez precise recuperar.'],
      ['Nome falso não é anonimato total', 'IP, cookies, impressão digital do navegador e dados de pagamento ainda podem ligar você a um cadastro. Para mais anonimato, conheça ferramentas como o Tor Browser.'],
      ['Confira os links antes de clicar', 'E-mails de remetentes desconhecidos podem ser phishing. Compare o endereço no navegador com o site esperado antes de digitar algo.'],
      ['Ative a verificação em duas etapas', 'Em contas importantes, use um app autenticador; códigos enviados a uma caixa descartável são um segundo fator fraco.'],
      ['Use com responsabilidade', 'Alguns serviços exigem, com razão, dados reais. Não use os perfis para burlar banimentos, verificação de idade ou de identidade.'],
    ],
  },
  de: {
    faqTitle: 'FAQ',
    tipsTitle: 'Tipps zu Sicherheit und Anonymität',
    moreTitle: 'Mehr erfahren',
    contactsTitle: 'Kontakt',
    donateTitle: 'Projekt unterstützen',
    faq: [
      ['Werden meine echten Daten weitergegeben?', 'Nein. Webseiten erhalten nur, was im gewählten Profil steht. Die Erweiterung fragt nie nach deinem echten Namen oder deiner E-Mail.'],
      ['Wo werden meine Daten gespeichert?', 'Nur in diesem Browser. Sie sind mit einem daneben gespeicherten Schlüssel verschlüsselt – das schützt vor beiläufigem Einblick, nicht vor jemandem mit Zugriff auf dein Browserprofil. Exportierte Sicherungen sind nicht verschlüsselt.'],
      ['Was speichert die Seitenliste?', 'Seiten, auf denen du ein Formular mit einem Profil ausgefüllt hast, und das jeweils eigene Passwort, lokal gespeichert. Du kannst sie ansehen, kopieren oder löschen.'],
      ['Warum lehnen manche Seiten die temporäre E-Mail ab?', 'Viele Dienste sperren bekannte Wegwerf-Domains. Nutze temporäre Postfächer nur für unwichtige Registrierungen.'],
    ],
    tips: [
      ['Ein Passwort pro Seite', 'Verwende Passwörter nie doppelt. Das Profil gibt jedem Dienst ein eigenes Zufallspasswort; für wichtige Konten hilft ein Passwortmanager.'],
      ['Nur für unwichtige Konten', 'Ein temporäres Postfach kann verschwinden. Nutze es nicht für Banken, Behörden oder alles, was du später wiederherstellen musst.'],
      ['Ein falscher Name ist keine volle Anonymität', 'IP-Adresse, Cookies, Browser-Fingerabdruck und Zahlungsdaten können dich weiterhin zuordnen. Für mehr Anonymität lohnt ein Blick auf Werkzeuge wie den Tor Browser.'],
      ['Links vor dem Klick prüfen', 'E-Mails unbekannter Absender können Phishing sein. Vergleiche die Adresse im Browser mit der erwarteten Seite, bevor du etwas eingibst.'],
      ['Zwei-Faktor-Authentifizierung aktivieren', 'Nutze bei wichtigen Konten eine Authenticator-App; Codes an ein Wegwerf-Postfach sind ein schwacher zweiter Faktor.'],
      ['Verantwortungsvoll nutzen', 'Manche Dienste verlangen berechtigt echte Daten. Nutze Profile nicht, um Sperren, Altersprüfungen oder Identitätsprüfungen zu umgehen.'],
    ],
  },
  fr: {
    faqTitle: 'FAQ',
    tipsTitle: 'Conseils de sécurité et d’anonymat',
    moreTitle: 'En savoir plus',
    contactsTitle: 'Contact',
    donateTitle: 'Soutenir le projet',
    faq: [
      ['Mes vraies données sont-elles partagées ?', 'Non. Les sites reçoivent uniquement ce que contient le profil choisi. L’extension ne demande jamais votre vrai nom ni votre e-mail.'],
      ['Où sont stockées mes données ?', 'Uniquement dans ce navigateur. Elles sont chiffrées avec une clé conservée à côté : cela évite les regards fortuits, mais pas une personne ayant accès à votre profil de navigateur. Les sauvegardes exportées ne sont pas chiffrées.'],
      ['Que contient la liste des sites ?', 'Les sites où vous avez rempli un formulaire avec un profil et le mot de passe unique de chacun, enregistrés localement. Vous pouvez les voir, les copier ou les supprimer.'],
      ['Pourquoi certains sites refusent l’e-mail temporaire ?', 'Beaucoup de services bloquent les domaines d’adresses jetables connus. Réservez-les aux inscriptions sans enjeu.'],
    ],
    tips: [
      ['Un mot de passe par site', 'Ne réutilisez jamais un mot de passe. Le profil en fournit un aléatoire par service ; pour les comptes importants, un gestionnaire de mots de passe aide.'],
      ['Pour les comptes sans enjeu', 'Une boîte temporaire peut disparaître. Ne l’utilisez pas pour une banque, une administration ou tout ce que vous pourriez devoir récupérer.'],
      ['Un faux nom n’est pas l’anonymat complet', 'Adresse IP, cookies, empreinte du navigateur et données de paiement peuvent encore vous relier. Pour plus d’anonymat, étudiez des outils comme Tor Browser.'],
      ['Vérifiez les liens avant de cliquer', 'Les e-mails d’expéditeurs inconnus peuvent être du phishing. Comparez l’adresse du navigateur au site attendu avant de saisir quoi que ce soit.'],
      ['Activez la double authentification', 'Pour les comptes importants, utilisez une application d’authentification ; des codes envoyés à une boîte jetable forment un second facteur fragile.'],
      ['Utilisez-le avec responsabilité', 'Certains services exigent légitimement de vraies données. N’utilisez pas les profils pour contourner des bannissements, des contrôles d’âge ou d’identité.'],
    ],
  },
  it: {
    faqTitle: 'Domande frequenti',
    tipsTitle: 'Consigli su sicurezza e anonimato',
    moreTitle: 'Scopri di più',
    contactsTitle: 'Contatti',
    donateTitle: 'Sostieni il progetto',
    faq: [
      ['I miei dati reali vengono condivisi?', 'No. I siti ricevono solo ciò che contiene il profilo scelto. L’estensione non chiede mai il tuo vero nome o la tua email.'],
      ['Dove sono salvati i miei dati?', 'Solo in questo browser. Sono cifrati con una chiave conservata accanto: evita sguardi casuali, ma non protegge da chi accede al tuo profilo del browser. I backup esportati non sono cifrati.'],
      ['Cosa conserva l’elenco dei siti?', 'I siti in cui hai compilato un modulo con un profilo e la password unica di ciascuno, salvati in locale. Puoi vederli, copiarli o eliminarli.'],
      ['Perché alcuni siti rifiutano la posta temporanea?', 'Molti servizi bloccano i domini noti di email usa e getta. Usala solo per iscrizioni poco importanti.'],
    ],
    tips: [
      ['Una password per sito', 'Non riutilizzare le password. Il profilo dà a ogni servizio una password casuale; per gli account importanti aiuta un gestore di password.'],
      ['Solo per account poco importanti', 'Una casella temporanea può sparire. Non usarla per banche, servizi pubblici o qualsiasi cosa che potresti dover recuperare.'],
      ['Un nome falso non è anonimato totale', 'IP, cookie, impronta del browser e dati di pagamento possono ancora collegarti. Per più anonimato, valuta strumenti come Tor Browser.'],
      ['Controlla i link prima di cliccare', 'Le email di mittenti sconosciuti possono essere phishing. Confronta l’indirizzo nel browser con il sito atteso prima di inserire qualcosa.'],
      ['Attiva la verifica in due passaggi', 'Per gli account importanti usa un’app di autenticazione: i codici inviati a una casella usa e getta sono un secondo fattore debole.'],
      ['Usalo con responsabilità', 'Alcuni servizi richiedono legittimamente dati reali. Non usare i profili per aggirare ban, controlli dell’età o verifiche d’identità.'],
    ],
  },
  pl: {
    faqTitle: 'FAQ',
    tipsTitle: 'Wskazówki dotyczące bezpieczeństwa i anonimowości',
    moreTitle: 'Dowiedz się więcej',
    contactsTitle: 'Kontakt',
    donateTitle: 'Wesprzyj projekt',
    faq: [
      ['Czy moje prawdziwe dane są udostępniane?', 'Nie. Strony dostają tylko to, co zawiera wybrany profil. Rozszerzenie nigdy nie pyta o Twoje prawdziwe imię ani e-mail.'],
      ['Gdzie są przechowywane moje dane?', 'Tylko w tej przeglądarce. Są szyfrowane kluczem trzymanym obok, co chroni przed przypadkowym wglądem, ale nie przed osobą z dostępem do Twojego profilu przeglądarki. Wyeksportowane kopie nie są szyfrowane.'],
      ['Co zapisuje lista stron?', 'Strony, na których formularz został wypełniony profilem, oraz unikalne hasło każdej z nich – lokalnie. Można je podejrzeć, skopiować lub usunąć.'],
      ['Dlaczego niektóre strony odrzucają tymczasowy e-mail?', 'Wiele usług blokuje znane domeny jednorazowych skrzynek. Używaj ich tylko do mało ważnych rejestracji.'],
    ],
    tips: [
      ['Jedno hasło na stronę', 'Nie powtarzaj haseł. Profil daje każdej usłudze osobne, losowe hasło; przy ważnych kontach pomoże menedżer haseł.'],
      ['Tylko do mało ważnych kont', 'Tymczasowa skrzynka może zniknąć. Nie używaj jej do banków, urzędów ani niczego, co możesz musieć odzyskać.'],
      ['Fałszywe imię to nie pełna anonimowość', 'Adres IP, ciasteczka, odcisk przeglądarki i dane płatnicze nadal mogą Cię powiązać. Dla większej anonimowości poznaj narzędzia takie jak Tor Browser.'],
      ['Sprawdzaj linki przed kliknięciem', 'E-maile od nieznanych nadawców mogą być phishingiem. Porównaj adres w przeglądarce z oczekiwaną stroną, zanim cokolwiek wpiszesz.'],
      ['Włącz uwierzytelnianie dwuskładnikowe', 'Przy ważnych kontach używaj aplikacji uwierzytelniającej; kody na jednorazową skrzynkę to słaby drugi składnik.'],
      ['Korzystaj odpowiedzialnie', 'Część usług słusznie wymaga prawdziwych danych. Nie używaj profili do omijania banów, weryfikacji wieku ani tożsamości.'],
    ],
  },
  uk: {
    faqTitle: 'FAQ',
    tipsTitle: 'Поради з безпеки й анонімності',
    moreTitle: 'Докладніше',
    contactsTitle: 'Контакти',
    donateTitle: 'Підтримати проєкт',
    faq: [
      ['Чи передаються мої справжні дані?', 'Ні. Сайти отримують лише те, що є у вибраній персоні. Розширення ніколи не просить ваше справжнє ім’я чи пошту.'],
      ['Де зберігаються мої дані?', 'Лише в цьому браузері. Вони зашифровані ключем, що лежить поруч: це ховає їх від випадкового погляду, але не від того, хто має доступ до вашого профілю браузера. Експортовані копії не шифруються.'],
      ['Що зберігає список сайтів?', 'Сайти, де ви заповнювали форму персоною, і унікальний пароль кожного з них — локально. Їх можна переглянути, скопіювати або видалити.'],
      ['Чому деякі сайти не приймають тимчасову пошту?', 'Багато сервісів блокують відомі домени одноразових скриньок. Використовуйте тимчасову пошту лише для неважливих реєстрацій.'],
    ],
    tips: [
      ['Один пароль — один сайт', 'Не повторюйте паролі. Персона дає кожному сервісу власний випадковий пароль; для важливих акаунтів зручний менеджер паролів.'],
      ['Лише для неважливих акаунтів', 'Тимчасова скринька може зникнути. Не використовуйте її для банків, держпослуг і всього, що доведеться відновлювати.'],
      ['Вигадане ім’я — не повна анонімність', 'Вас усе ще можуть пов’язати IP-адреса, cookie, відбиток браузера та платіжні дані. Для серйознішої анонімності вивчіть такі інструменти, як Tor Browser.'],
      ['Перевіряйте посилання перед кліком', 'Листи від невідомих відправників можуть бути фішингом. Звіряйте адресу в браузері з очікуваним сайтом, перш ніж щось вводити.'],
      ['Вмикайте двофакторний захист', 'Для важливих акаунтів використовуйте застосунок-автентифікатор: коди на одноразову скриньку — слабкий другий фактор.'],
      ['Користуйтеся відповідально', 'Деякі сервіси мають право вимагати справжні дані. Не застосовуйте персони для обходу банів, вікових обмежень і перевірки особи.'],
    ],
  },
  ja: {
    faqTitle: 'FAQ',
    tipsTitle: 'セキュリティと匿名性のヒント',
    moreTitle: '詳しく見る',
    contactsTitle: '連絡先',
    donateTitle: 'プロジェクトを支援',
    faq: [
      ['本名などの実際の情報は共有されますか?', 'いいえ。サイトに渡るのは選択したプロフィールの内容だけです。本名やメールアドレスを求めることはありません。'],
      ['データはどこに保存されますか?', 'このブラウザ内だけです。隣に保存された鍵で暗号化されるため、ちょっとした盗み見は防げますが、ブラウザのプロファイルにアクセスできる人は防げません。エクスポートしたバックアップは暗号化されません。'],
      ['サイト一覧には何が残りますか?', 'プロフィールでフォームを入力したサイトと、各サイト用の固有パスワードが端末内に保存されます。確認・コピー・削除ができます。'],
      ['一時メールを拒否するサイトがあるのはなぜですか?', '多くのサービスは既知の使い捨てメールのドメインをブロックしています。重要でない登録だけに使ってください。'],
    ],
    tips: [
      ['サイトごとに別のパスワード', 'パスワードを使い回さないでください。プロフィールはサービスごとにランダムなパスワードを用意します。重要なアカウントにはパスワードマネージャーが便利です。'],
      ['重要でないアカウント向け', '一時メールボックスは消える場合があります。銀行や行政サービス、後で復旧が必要になるものには使わないでください。'],
      ['偽名は完全な匿名ではありません', 'IPアドレス、Cookie、ブラウザのフィンガープリント、決済情報から特定される可能性があります。より高い匿名性が必要なら Tor Browser などを検討してください。'],
      ['クリックする前にリンクを確認', '知らない送信者のメールはフィッシングかもしれません。入力する前に、ブラウザのアドレスが想定したサイトか確認しましょう。'],
      ['二段階認証を有効に', '重要なアカウントには認証アプリを使いましょう。使い捨てメールに届くコードは弱い第二要素です。'],
      ['責任を持って使う', '実名の入力が正当に求められるサービスもあります。BANや年齢確認、本人確認を回避する目的で使わないでください。'],
    ],
  },
  hi: {
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    tipsTitle: 'सुरक्षा और गुमनामी के सुझाव',
    moreTitle: 'और जानें',
    contactsTitle: 'संपर्क',
    donateTitle: 'प्रोजेक्ट का समर्थन करें',
    faq: [
      ['क्या मेरी असली जानकारी साझा होती है?', 'नहीं। साइटों को सिर्फ़ वही मिलता है जो चुनी हुई प्रोफ़ाइल में है। एक्सटेंशन आपका असली नाम या ईमेल कभी नहीं माँगता।'],
      ['मेरा डेटा कहाँ सहेजा जाता है?', 'सिर्फ़ इसी ब्राउज़र में। वह पास में रखी कुंजी से एन्क्रिप्ट होता है, जो आम नज़र से बचाता है, लेकिन आपके ब्राउज़र प्रोफ़ाइल तक पहुँच रखने वाले से नहीं। एक्सपोर्ट किए गए बैकअप एन्क्रिप्टेड नहीं होते।'],
      ['साइटों की सूची में क्या रहता है?', 'वे साइटें जहाँ आपने प्रोफ़ाइल से फ़ॉर्म भरा और हर साइट का अलग पासवर्ड, स्थानीय रूप से सहेजे जाते हैं। आप उन्हें देख, कॉपी या हटा सकते हैं।'],
      ['कुछ साइटें अस्थायी ईमेल क्यों अस्वीकार करती हैं?', 'कई सेवाएँ जाने-पहचाने डिस्पोज़ेबल-मेल डोमेन ब्लॉक करती हैं। इसे सिर्फ़ कम महत्व वाले साइन-अप के लिए इस्तेमाल करें।'],
    ],
    tips: [
      ['हर साइट के लिए अलग पासवर्ड', 'पासवर्ड दोबारा इस्तेमाल न करें। प्रोफ़ाइल हर सेवा को अलग रैंडम पासवर्ड देती है; ज़रूरी खातों के लिए पासवर्ड मैनेजर मददगार है।'],
      ['सिर्फ़ कम महत्व वाले खातों के लिए', 'अस्थायी मेलबॉक्स गायब हो सकता है। बैंक, सरकारी सेवाओं या ऐसी किसी चीज़ के लिए इसका उपयोग न करें जिसे बाद में वापस पाना पड़े।'],
      ['नकली नाम पूरी गुमनामी नहीं है', 'IP पता, कुकी, ब्राउज़र फ़िंगरप्रिंट और भुगतान की जानकारी से आप फिर भी पहचाने जा सकते हैं। ज़्यादा गुमनामी के लिए Tor Browser जैसे टूल देखें।'],
      ['क्लिक से पहले लिंक जाँचें', 'अनजान भेजने वालों के ईमेल फ़िशिंग हो सकते हैं। कुछ भी दर्ज करने से पहले ब्राउज़र का पता अपेक्षित साइट से मिलाएँ।'],
      ['टू-फ़ैक्टर ऑथेंटिकेशन चालू करें', 'ज़रूरी खातों के लिए ऑथेंटिकेटर ऐप इस्तेमाल करें; डिस्पोज़ेबल मेलबॉक्स पर आने वाले कोड कमज़ोर दूसरा फ़ैक्टर हैं।'],
      ['ज़िम्मेदारी से इस्तेमाल करें', 'कुछ सेवाओं को असली जानकारी चाहिए होती है, और यह जायज़ है। प्रतिबंध, उम्र की जाँच या पहचान सत्यापन से बचने के लिए प्रोफ़ाइल का उपयोग न करें।'],
    ],
  },
  id: {
    faqTitle: 'FAQ',
    tipsTitle: 'Tips keamanan dan anonimitas',
    moreTitle: 'Selengkapnya',
    contactsTitle: 'Kontak',
    donateTitle: 'Dukung proyek',
    faq: [
      ['Apakah data asli saya dibagikan?', 'Tidak. Situs hanya menerima isi profil yang dipilih. Ekstensi tidak pernah meminta nama atau email asli Anda.'],
      ['Di mana data saya disimpan?', 'Hanya di browser ini. Data dienkripsi dengan kunci yang disimpan di dekatnya, sehingga aman dari pandangan sekilas tetapi tidak dari orang yang bisa mengakses profil browser Anda. Cadangan yang diekspor tidak dienkripsi.'],
      ['Apa yang disimpan daftar situs?', 'Situs tempat Anda mengisi formulir dengan profil beserta kata sandi unik masing-masing, disimpan secara lokal. Anda bisa melihat, menyalin, atau menghapusnya.'],
      ['Mengapa sebagian situs menolak email sementara?', 'Banyak layanan memblokir domain email sekali pakai yang dikenal. Gunakan hanya untuk pendaftaran yang tidak penting.'],
    ],
    tips: [
      ['Satu kata sandi per situs', 'Jangan memakai ulang kata sandi. Profil memberi setiap layanan kata sandi acak sendiri; untuk akun penting, pengelola kata sandi sangat membantu.'],
      ['Untuk akun yang tidak penting saja', 'Kotak surat sementara bisa hilang. Jangan dipakai untuk bank, layanan pemerintah, atau apa pun yang mungkin perlu dipulihkan.'],
      ['Nama palsu bukan anonimitas penuh', 'Alamat IP, cookie, sidik jari browser, dan data pembayaran tetap bisa menghubungkan Anda. Untuk anonimitas lebih kuat, pelajari alat seperti Tor Browser.'],
      ['Periksa tautan sebelum mengeklik', 'Email dari pengirim tak dikenal bisa berupa phishing. Cocokkan alamat di browser dengan situs yang diharapkan sebelum mengisi apa pun.'],
      ['Aktifkan autentikasi dua faktor', 'Untuk akun penting, gunakan aplikasi autentikator; kode yang dikirim ke kotak surat sekali pakai adalah faktor kedua yang lemah.'],
      ['Gunakan dengan bertanggung jawab', 'Sebagian layanan memang berhak meminta data asli. Jangan gunakan profil untuk menghindari pemblokiran, verifikasi usia, atau verifikasi identitas.'],
    ],
  },
};

export const infoFor = (code) => INFO[code] || INFO.en;
