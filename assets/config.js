/* Dopamine Tracker landing — single place to edit numbers, links and copy.
   The two HTML pages are generated from _src/landing.template.html by
   `python _src/build.py`, which bakes copy[lang] into static text for SEO;
   this file drives the live numbers and animations at runtime. */
window.DT_CONFIG = {
  appName: 'Dopamine Tracker',
  downloadUrl: 'https://play.google.com/store/apps/details?id=com.agilersoft.dopaminetracker',
  privacyUrl: { en: 'https://dopaminetracker.site/privacy/', tr: 'https://dopaminetracker.site/tr/gizlilik/' },
  defaultLang: 'en',

  /* Product metrics. Derived values (per user, days, months, weekly, yearly) are computed on the page.
     showImpact gates the "Impact so far" and "Time is the real currency" scenes: keep it false until
     usersHelped and hoursReclaimed are real, measured numbers. avgDailyMinutes is a general
     population figure used in the problem section, not an app metric. */
  stats: {
    showImpact: false,
    usersHelped: 0,
    hoursReclaimed: 0,
    avgDailyMinutes: 272            /* 4h 32m — problem section */
  },

  /* One real week from the app (analytics screen): minutes per day, Fri → Thu. */
  week: { labels: ['Fri','Sat','Sun','Mon','Tue','Wed','Thu'], labelsTr: ['Cum','Cmt','Paz','Pzt','Sal','Çar','Per'], minutes: [300, 325, 610, 285, 245, 430, 210], todayMinutes: 210, scoreFrom: 0, scoreTo: 56 },

  /* Today's top apps in minutes (feature 1 visualization). */
  topApps: [ { name: 'Instagram', minutes: 125 }, { name: 'TikTok', minutes: 90 }, { name: 'X', minutes: 35 }, { name: 'WhatsApp', minutes: 19 } ],

  /* Feature 2 visualization. */
  limit: { app: 'Instagram', limitMinutes: 105 },

  /* Feature 3 visualization: 14 days of social media minutes, streak days under goal. */
  trend: { minutes: [188, 176, 181, 162, 150, 158, 141, 128, 132, 117, 104, 98, 91, 84], streak: 7 },

  /* Prices per currency, as set in Play Console. The English page shows USD, the Turkish page TRY.
     A null amount renders "see the price on Google Play" instead of a number — never guess a price. */
  currencyFor: { en: 'USD', tr: 'TRY' },
  pricing: {
    TRY: { monthly: 59.99, yearly: 289.99 },
    USD: { monthly: null, yearly: null }   /* TODO: copy the US prices from Play Console → Subscriptions → base plans */
  },

  /* Real Google Play reviews (5 stars), per language. TR is the original wording. */
  testimonials: {
    tr: [
      { name: 'Orçun Ç.', source: 'Google Play', stars: 5, text: 'Ekran süremi azaltmama çok yardımcı oldu. Uygulamayı kullandığımda yaptığım işe tamamen odaklanabiliyorum; odak modu olması çok iyi bir özellik ve uygulama dizaynı kullanışı çok rahatlaştırıyor.' },
      { name: 'İrem B. G.', source: 'Google Play', stars: 5, text: 'Çok tatlı bir uygulama. Başta ekran süreleri üzerine veri koyması, bilgiler aktarması keyifliydi.' }
    ],
    en: [
      { name: 'Orçun Ç.', source: 'Google Play', stars: 5, text: 'It really helped me cut down my screen time. When I use the app I can fully focus on what I am doing. Having a focus mode is a great feature, and the design makes it very comfortable to use.' },
      { name: 'İrem B. G.', source: 'Google Play', stars: 5, text: 'Such a lovely app. Seeing data about my screen time right from the start, and the way it presents the information, was a pleasure.' }
    ]
  },

  copy: {
    en: {
      nav_product: 'Product', nav_how: 'How it works', nav_impact: 'Impact', nav_download: 'Download', nav_cta: 'Get the App',
      hero_eyebrow: 'Android · Free', hero_h1: 'Take back your time.',
      hero_lead: 'Dopamine Tracker helps you understand where your screen time goes, and take control of it.',
      cta_download: 'Download Dopamine Tracker', cta_how: 'See how it works', hero_fine: 'Free on Google Play. No card required.', scroll: 'Scroll',
      prob_eyebrow: 'The problem', prob_h2: 'How much of your life disappears into a screen?',
      prob_l1: 'average daily screen time', prob_l2: 'per week', prob_l3: 'per year', prob_note: 'Small daily numbers. Large yearly ones.',
      imp_eyebrow: 'Impact so far', imp_l0: 'people helped', imp_l1: 'hours reclaimed', imp_l2: 'hours reclaimed per person', imp_sub: 'Every dot is one person.',
      feat_eyebrow: 'Features',
      f1_num: '01 · Understand your habits', f1_h2: 'See where your time actually goes.',
      f1_p: 'Per-app screen time, a daily dopamine score from 0 to 100, and the apps that take most of your day. Measured on your phone. It never leaves it.',
      f2_num: '02 · Set boundaries', f2_h2: 'Your attention. Your rules.',
      f2_p: 'A daily limit per app, full-day blocks on the days you choose, and a block screen that reminds you why you installed the app. Blocking is free.',
      f3_num: '03 · Build momentum', f3_h2: 'Small changes. Massive difference.',
      f3_p: 'A daily goal for social media, a streak that grows every day you stay under it, and focus sessions that silence notifications.',
      viz1_t: 'Today · top apps', viz2_t: 'Instagram · daily limit', viz2_used: 'used', viz2_blocked: 'Blocked until midnight', viz3_t: 'Social media · last 14 days', viz3_streak: 'day streak',
      data_eyebrow: 'Data', data_h2: 'One week inside the app.',
      data_p: 'Real numbers from a real week: the weekly total, the daily average, and how far today landed below it.',
      data_l1: 'weekly total', data_l2: 'daily average', data_l3: 'today', data_l4: 'vs. average', data_avg: 'avg', data_score: 'Score curve · 0 → 56 over 7 days', data_week: 'This week',
      cur_eyebrow: 'Time is the real currency', cur_h2: 'Hours are abstract. Days are not.',
      cur_l0: 'hours reclaimed', cur_l1: 'days', cur_l2: 'months', cur_sub: 'Each square is one full day, given back.',
      show_eyebrow: 'The app', show_h2: 'Everything, one thumb away.',
      sc_home: 'Daily screen time', sc_analytics: 'Weekly statistics', sc_block: 'App blocking', sc_focus: 'Focus sessions', sc_account: 'Goals & progress',
      how_eyebrow: 'How it works', how_h2: 'Three steps.',
      step1_h: 'See the real number', step1_p: 'Grant usage access and see your true per-app screen time on the first launch.',
      step2_h: 'Set a limit', step2_p: 'Pick the app that pulls you back, choose a daily limit or closed days. Setting a block is free.',
      step3_h: 'Wait for midnight', step3_p: 'Once the limit is reached the app does not open. Whoever wants out early goes Pro.',
      pro_eyebrow: 'Free and Pro', pro_h2: 'Setting a block is free for everyone. Flexibility is Pro.',
      plan_free: 'Free', plan_pro: 'Pro', pro_month: '/ month', pro_year: 'a year',
      pf1: 'Daily limit per app and full-day blocks', pf2: 'Block screen and purpose reminder', pf3: 'Screen time tracking, dopamine score, analytics', pf4: 'Focus sessions, daily goal and streak', pf5: 'Unlocking a block before midnight',
      pp1: 'Everything in Free', pp2: 'Unlock a block for today or loosen a limit without waiting for midnight', pp3: 'Strict focus mode: a session you start cannot be cancelled', pp4: 'Unbreakable block: cannot be lifted even on Pro, ends with the day',
      pro_note: 'Renews automatically through Google Play unless you cancel. Cancel any time.',
      test_eyebrow: 'What people say', test_h2: 'From the people who use it.',
      price_on_play: 'See the price on Google Play',
      faq_eyebrow: 'FAQ', faq_h2: 'Common questions',
      q1: 'Is app blocking free?', a1: 'Yes. A daily limit per app and closing an app completely on chosen days are free for everyone. A block lasts until midnight.',
      q2: 'What does Pro add?', a2: 'Unlocking a block for today or loosening a limit, a strict focus mode that cannot be cancelled, and an unbreakable block that cannot be lifted even on Pro.',
      q3: 'Where does my screen time data go?', a3: 'Per-app usage never leaves your phone. Only your onboarding answers and subscription status sync with your account.',
      q4: 'Which permissions are needed?', a4: 'Usage access to measure screen time; display over other apps so the block screen can appear. Optional Do Not Disturb access to silence notifications during focus sessions.',
      q5: 'Is there an iPhone version?', a5: 'Android only for now. App blocking relies on Android\'s usage access API.',
      final_h2: 'You don\'t need more time.', final_p: 'You need more control over the time you already have.',
      foot_privacy: 'Privacy policy', foot_support: 'Support', foot_play: 'Google Play'
    },
    tr: {
      nav_product: 'Ürün', nav_how: 'Nasıl çalışır', nav_impact: 'Etki', nav_download: 'İndir', nav_cta: 'Uygulamayı al',
      hero_eyebrow: 'Android · Ücretsiz', hero_h1: 'Zamanını geri al.',
      hero_lead: 'Dopamine Tracker ekran sürenin nereye gittiğini anlamanı ve kontrolü ele almanı sağlar.',
      cta_download: 'Dopamine Tracker\'ı indir', cta_how: 'Nasıl çalıştığını gör', hero_fine: 'Google Play\'de ücretsiz. Kart bilgisi istenmez.', scroll: 'Kaydır',
      prob_eyebrow: 'Sorun', prob_h2: 'Hayatının ne kadarı bir ekranda kayboluyor?',
      prob_l1: 'günlük ortalama ekran süresi', prob_l2: 'haftada', prob_l3: 'yılda', prob_note: 'Günlük küçük rakamlar. Yıllık büyük rakamlar.',
      imp_eyebrow: 'Bugüne kadar', imp_l0: 'kişiye yardım edildi', imp_l1: 'saat geri kazanıldı', imp_l2: 'kişi başı geri kazanılan saat', imp_sub: 'Her nokta bir kişi.',
      feat_eyebrow: 'Özellikler',
      f1_num: '01 · Alışkanlıklarını anla', f1_h2: 'Zamanının gerçekten nereye gittiğini gör.',
      f1_p: 'Uygulama bazında ekran süresi, 0–100 arası günlük dopamin skoru ve gününü en çok alan uygulamalar. Telefonunda ölçülür, telefonundan çıkmaz.',
      f2_num: '02 · Sınır koy', f2_h2: 'Dikkatin. Kuralların.',
      f2_p: 'Uygulama başına günlük limit, seçtiğin günlerde tam gün kapatma ve neden yüklediğini hatırlatan engel ekranı. Engelleme ücretsiz.',
      f3_num: '03 · İvme kazan', f3_h2: 'Küçük değişiklikler. Büyük fark.',
      f3_p: 'Sosyal medya için günlük hedef, altında kaldığın her gün büyüyen seri ve bildirimleri susturan odak seansları.',
      viz1_t: 'Bugün · en çok kullanılan', viz2_t: 'Instagram · günlük limit', viz2_used: 'kullanıldı', viz2_blocked: 'Gece yarısına kadar engelli', viz3_t: 'Sosyal medya · son 14 gün', viz3_streak: 'günlük seri',
      data_eyebrow: 'Veri', data_h2: 'Uygulamanın içinde bir hafta.',
      data_p: 'Gerçek bir haftadan gerçek rakamlar: haftalık toplam, günlük ortalama ve bugünün ortalamanın ne kadar altında kaldığı.',
      data_l1: 'haftalık toplam', data_l2: 'günlük ortalama', data_l3: 'bugün', data_l4: 'ortalamaya göre', data_avg: 'ort', data_score: 'Skor eğrisi · 7 günde 0 → 56', data_week: 'Bu hafta',
      cur_eyebrow: 'Gerçek para birimi zaman', cur_h2: 'Saatler soyuttur. Günler değil.',
      cur_l0: 'saat geri kazanıldı', cur_l1: 'gün', cur_l2: 'ay', cur_sub: 'Her kare geri verilen tam bir gün.',
      show_eyebrow: 'Uygulama', show_h2: 'Her şey, bir başparmak uzağında.',
      sc_home: 'Günlük ekran süresi', sc_analytics: 'Haftalık istatistikler', sc_block: 'Uygulama engelleme', sc_focus: 'Odak seansları', sc_account: 'Hedefler ve ilerleme',
      how_eyebrow: 'Nasıl çalışır', how_h2: 'Üç adım.',
      step1_h: 'Gerçek rakamı gör', step1_p: 'Kullanım erişimi ver, ilk açılışta uygulama bazında gerçek ekran süreni gör.',
      step2_h: 'Limit koy', step2_p: 'Seni geri çeken uygulamayı seç, günlük limit ya da kapalı günler belirle. Engel kurmak ücretsiz.',
      step3_h: 'Gece yarısını bekle', step3_p: 'Limit dolunca uygulama açılmaz. Erken çıkmak isteyen Pro\'ya geçer.',
      pro_eyebrow: 'Ücretsiz ve Pro', pro_h2: 'Engel kurmak herkese ücretsiz. Esneklik Pro\'da.',
      plan_free: 'Ücretsiz', plan_pro: 'Pro', pro_month: '/ ay', pro_year: 'yıllık',
      pf1: 'Uygulama başına günlük limit ve tam gün kapatma', pf2: 'Engel ekranı ve amaç hatırlatması', pf3: 'Ekran süresi takibi, dopamin skoru, analiz', pf4: 'Odak seansları, günlük hedef ve seri', pf5: 'Engeli gece yarısından önce açma',
      pp1: 'Ücretsizdeki her şey', pp2: 'Engeli bugünlük aç veya limiti gevşet, gece yarısını bekleme', pp3: 'Sıkı odak modu: başlattığın oturum iptal edilemez', pp4: 'Kırılamaz engel: Pro\'dayken bile açılamaz, gün bitince kalkar',
      pro_note: 'İptal etmediğin sürece Google Play tarafından otomatik yenilenir. İstediğin zaman iptal edebilirsin.',
      test_eyebrow: 'Kullanıcılar ne diyor', test_h2: 'Kullananlardan.',
      price_on_play: "Fiyatı Google Play'de gör",
      faq_eyebrow: 'Sık sorulanlar', faq_h2: 'Merak edilenler',
      q1: 'Uygulama engelleme ücretsiz mi?', a1: 'Evet. Uygulama başına günlük limit koymak ve seçtiğin günlerde bir uygulamayı tamamen kapatmak herkese ücretsiz. Engel gece yarısına kadar geçerlidir.',
      q2: 'Pro ne sağlıyor?', a2: 'Engeli bugünlük açmak veya limiti gevşetmek, iptal edilemeyen sıkı odak modu ve Pro\'dayken bile açılamayan kırılamaz engel.',
      q3: 'Ekran süresi verilerim nereye gidiyor?', a3: 'Uygulama bazındaki kullanım süreleri telefonundan çıkmaz. Hesabınla yalnızca onboarding yanıtların ve abonelik durumun eşitlenir.',
      q4: 'Hangi izinler gerekiyor?', a4: 'Ekran süresini ölçmek için kullanım erişimi; engel ekranını gösterebilmek için diğer uygulamaların üzerinde gösterme izni. Odak seanslarında isteğe bağlı Rahatsız Etmeyin izni.',
      q5: 'iPhone sürümü var mı?', a5: 'Şu anda yalnızca Android. Uygulama engelleme Android\'in kullanım erişimi API\'sine dayanıyor.',
      final_h2: 'Daha fazla zamana ihtiyacın yok.', final_p: 'Zaten sahip olduğun zaman üzerinde daha fazla kontrole ihtiyacın var.',
      foot_privacy: 'Gizlilik politikası', foot_support: 'Destek', foot_play: 'Google Play'
    }
  }
};
