/* Neurofast landing — single place to edit numbers, links and copy.
   The two HTML pages are generated from _src/landing.template.html by
   `python _src/build.py`, which bakes copy[lang] into static text for SEO;
   this file drives the live numbers and animations at runtime. */
window.DT_CONFIG = {
  appName: 'Neurofast',
  downloadUrl: 'https://play.google.com/store/apps/details?id=com.agilersoft.dopaminetracker',
  appStoreUrl: 'https://apps.apple.com/app/id6810599494',
  privacyUrl: { en: 'https://dopaminetracker.site/privacy/', tr: 'https://dopaminetracker.site/tr/gizlilik/' },
  defaultLang: 'en',

  /* Product metrics. Derived values (per user, days, months, weekly, yearly) are computed on the page.
     showImpact gates the "Impact so far" and "Time is the real currency" scenes: keep it false until
     usersHelped and hoursReclaimed are real, measured numbers. avgDailyMinutes is a general
     population figure used in the problem section, not an app metric.
     The two figures shown in the hero and above the reviews (300+ active users, 1,000+ hours saved)
     are the owner's numbers from 2026-11-25; they live in copy.*.proof_* and in FAQ answer a8. */
  stats: {
    showImpact: false,
    usersHelped: 0,
    hoursReclaimed: 0,
    avgDailyMinutes: 272            /* 4h 32m — problem section */
  },

  /* One real week from the app (analytics screen): minutes per day, Fri → Thu. */
  week: { labels: ['Fri','Sat','Sun','Mon','Tue','Wed','Thu'], labelsTr: ['Cum','Cmt','Paz','Pzt','Sal','Çar','Per'], minutes: [300, 325, 610, 285, 245, 430, 210], todayMinutes: 210 },

  /* Today's top apps in minutes (feature 1 visualization). */
  topApps: [ { name: 'Instagram', minutes: 125 }, { name: 'TikTok', minutes: 90 }, { name: 'X', minutes: 35 }, { name: 'WhatsApp', minutes: 19 } ],

  /* Feature 2 visualization. */
  limit: { app: 'Instagram', limitMinutes: 105 },


  /* Prices per currency, as set in Play Console. The English page shows USD, the Turkish page TRY.
     A null amount renders "see the price on Google Play" instead of a number — never guess a price. */
  currencyFor: { en: 'USD', tr: 'TRY' },
  pricing: {
    TRY: { monthly: 59.99, yearly: 289.99 },
    USD: { monthly: 4.99, yearly: 29.99 }   /* US App Store prices read on 2026-11-25 (Unlock for Today: 1.99); check Play Console for the Play price */
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
      nav_product: 'Product', nav_how: 'How it works', nav_impact: 'Impact', nav_download: 'Download', nav_blog: 'Blog', nav_cta: 'Get the App',
      hero_eyebrow: 'Neurofast · Free social media blocker for iPhone and Android', hero_h1: 'Take back your time.',
      hero_lead: 'Neurofast shows where your screen time goes and blocks the apps, Reels and Shorts that take it.',
      cta_download: 'Download Neurofast', cta_ios: 'App Store', cta_android: 'Google Play', cta_how: 'See how it works', scroll: 'Scroll',
      proof_users_n: '300+', proof_users_l: 'active users', proof_hours_n: '1,000+', proof_hours_l: 'hours saved',
      prob_eyebrow: 'The problem', prob_h2: 'How much of your life disappears into a screen?',
      prob_l1: 'average daily screen time', prob_l2: 'per week', prob_l3: 'per year', prob_note: 'Small daily numbers. Large yearly ones.',
      imp_eyebrow: 'Impact so far', imp_l0: 'people helped', imp_l1: 'hours reclaimed', imp_l2: 'hours reclaimed per person', imp_sub: 'Every dot is one person.',
      feat_eyebrow: 'Features',
      f1_num: '01 · See your time', f1_h2: 'See where your week went.',
      f1_p: 'Screen time for every app by day and by week, the categories it falls into and your heaviest day. Measured on your phone. It never leaves it.',
      f2_num: '02 · Block', f2_h2: 'Your apps stay closed.',
      f2_p: 'A daily limit per app, full-day blocks, routines for work, study and sleep, and a quick block for the next 15 minutes to 2 hours. Setting a block is free.',
      f3_num: '03 · Smart block', f3_h2: 'Social media without Reels.',
      f3_p: 'Reels, Shorts and the For You feed are blocked. Messages, the videos friends send you, posts and profiles keep working. Part of Pro.',
      viz1_t: 'Today · top apps', viz2_t: 'Instagram · daily limit', viz2_used: 'used', viz2_blocked: 'Blocked until midnight', viz3_t: 'Instagram · YouTube · TikTok',
      data_eyebrow: 'Data', data_h2: 'One week inside the app.',
      data_p: 'Real numbers from a real week: the weekly total, the daily average, and how far today landed below it.',
      data_l1: 'weekly total', data_l2: 'daily average', data_l3: 'today', data_l4: 'vs. average', data_avg: 'avg', data_week: 'This week',
      cur_eyebrow: 'Time is the real currency', cur_h2: 'Hours are abstract. Days are not.',
      cur_l0: 'hours reclaimed', cur_l1: 'days', cur_l2: 'months', cur_sub: 'Each square is one full day, given back.',
      show_eyebrow: 'The app', show_h2: 'Everything, one thumb away.',
      sc_home: 'Quick block and routines', sc_analytics: 'Your week', sc_block: 'Blocked until midnight', sc_focus: 'Focus sessions',
      how_eyebrow: 'How it works', how_h2: 'Three steps.',
      step1_h: 'See the real number', step1_p: 'Grant usage access and see your true per-app screen time on the first launch.',
      step2_h: 'Set a limit', step2_p: 'Pick the app that pulls you back and choose a daily limit, closed days or a routine such as Deep work or Wind down. Setting a block is free.',
      step3_h: 'The block holds', step3_p: 'Once the limit is reached the app does not open until midnight. Opening it early is free on Pro and a small one-time fee without it.',
      pro_eyebrow: 'Free and Pro', pro_h2: 'Setting a block is free. Pro adds Smart block and stricter rules.',
      plan_free: 'Free', plan_pro: 'Pro', pro_month: '/ month', pro_year: 'a year',
      pf1: 'Daily limit per app and full-day blocks (one app at a time on iPhone)', pf2: 'Quick block, one routine and the block screen with your own reason', pf3: 'Screen time by day, week and category', pf4: 'Focus sessions with a timer', pf5: 'Opening a block early without a fee',
      pp1: 'Everything in Free', pp2: 'Open a block for today or loosen a limit without a fee', pp3: 'Strict focus: a session you start cannot be cancelled', pp4: 'Unbreakable block: no way in until the block ends, even on Pro', pp5: 'Smart block: Instagram without Reels, YouTube without Shorts, TikTok without the feed',
      pro_note: 'New subscribers start with a free trial. Renews automatically through Google Play or the App Store unless you cancel. US App Store prices; they vary by country and store.',
      test_eyebrow: 'What people say', test_h2: 'From the people who use it.',
      price_on_play: 'See the price in the App Store or on Google Play',
      blog_eyebrow: 'Blog', blog_h2: 'Guides and comparisons', blog_all: 'All articles',
      faq_eyebrow: 'FAQ', faq_h2: 'Common questions',
      q1: 'Is app blocking free?', a1: 'Yes. A daily limit per app, closing an app completely on chosen days, quick block and one routine are free. On iPhone the free plan blocks one app at a time. A daily limit holds until midnight.',
      q2: 'What does Pro add?', a2: 'Smart block for Reels, Shorts and TikTok\'s feeds, opening a block for today or loosening a limit without a fee, strict focus sessions, unbreakable blocks, several routines at once and a short wait before an app opens.',
      q3: 'Where does my screen time data go?', a3: 'Per-app usage never leaves your phone. Only your onboarding answers and subscription status sync with your account.',
      q4: 'Which permissions are needed?', a4: 'On Android: usage access to measure screen time, and display over other apps so the block screen can appear. Do Not Disturb access is optional, and Smart block asks for accessibility access only if you turn it on. On iPhone: Screen Time access.',
      q5: 'Is there an iPhone version?', a5: 'Yes. Neurofast is on the App Store for iPhone (iOS 16 or later) and on Google Play for Android. On iPhone, blocks run on Apple\'s Screen Time and the free plan blocks one app at a time.',
      q6: 'Can it block Reels and Shorts without blocking the whole app?', a6: 'Yes, with Smart block (Pro). On Android it blocks Instagram Reels, YouTube Shorts and TikTok\'s feeds while messages and regular videos keep working. On iPhone, Neurofast opens Instagram, YouTube and TikTok in its own browser with those feeds left out.',
      q7: 'What is Neurofast?', a7: 'Neurofast is a social media blocker and screen time tracker for iPhone and Android. It shows how long you spend in each app and blocks the ones you choose once you reach your limit. It was called Dopamine Tracker until November 2026.',
      q8: 'How many people use Neurofast?', a8: 'More than 300 people use Neurofast actively, and together they have saved more than 1,000 hours of screen time (November 2026).',
      final_h2: 'You don\'t need more time.', final_p: 'You need more control over the time you already have.',
      foot_privacy: 'Privacy policy', foot_support: 'Support', foot_blog: 'Blog', foot_ios: 'App Store', foot_play: 'Google Play',
      viz3_stay: 'Stays',
      viz3_s1: 'Messages',
      viz3_s2: 'Videos friends send you',
      viz3_s3: 'Posts and profiles',
      viz3_gone: 'Gone',
      viz3_g1: 'Reels',
      viz3_g2: 'Shorts',
      viz3_g3: 'For You feed',
      sc_smart: 'Reels and Shorts blocked',
      pp6: 'Several routines at once, and a short wait before an app opens',
      q9: 'How is Neurofast different from Opal or ScreenZen?',
      a9: 'Opal, ScreenZen, one sec and AppBlock also block distracting apps. Neurofast costs less than Opal, blocks Reels and Shorts on both iPhone and Android, and makes a block cost something to lift. The details are in <a href="./blog/opal-alternative/">Neurofast vs Opal</a>, <a href="./blog/screenzen-alternative/">Neurofast vs ScreenZen</a> and <a href="./blog/best-social-media-blocker-apps/">the best social media blocker apps compared</a>.'
    },
    tr: {
      nav_product: 'Ürün', nav_how: 'Nasıl çalışır', nav_impact: 'Etki', nav_download: 'İndir', nav_blog: 'Blog', nav_cta: 'Uygulamayı al',
      hero_eyebrow: 'Neurofast · iPhone ve Android için ücretsiz sosyal medya engelleme', hero_h1: 'Zamanını geri al.',
      hero_lead: 'Neurofast ekran sürenin nereye gittiğini gösterir; o süreyi alan uygulamaları, Reels\'i ve Shorts\'u engeller.',
      cta_download: 'Neurofast\'ı indir', cta_ios: 'App Store', cta_android: 'Google Play', cta_how: 'Nasıl çalıştığını gör', scroll: 'Kaydır',
      proof_users_n: '300+', proof_users_l: 'aktif kullanıcı', proof_hours_n: '1.000+', proof_hours_l: 'saat geri kazanıldı',
      prob_eyebrow: 'Sorun', prob_h2: 'Hayatının ne kadarı bir ekranda kayboluyor?',
      prob_l1: 'günlük ortalama ekran süresi', prob_l2: 'haftada', prob_l3: 'yılda', prob_note: 'Günlük küçük rakamlar. Yıllık büyük rakamlar.',
      imp_eyebrow: 'Bugüne kadar', imp_l0: 'kişiye yardım edildi', imp_l1: 'saat geri kazanıldı', imp_l2: 'kişi başı geri kazanılan saat', imp_sub: 'Her nokta bir kişi.',
      feat_eyebrow: 'Özellikler',
      f1_num: '01 · Zamanını gör', f1_h2: 'Haftanın nereye gittiğini gör.',
      f1_p: 'Her uygulamanın günlük ve haftalık ekran süresi, hangi kategoriye girdiği ve en yoğun günün. Telefonunda ölçülür, telefonundan çıkmaz.',
      f2_num: '02 · Engelle', f2_h2: 'Uygulamalar kapalı kalır.',
      f2_p: 'Uygulama başına günlük limit, tam gün kapatma, çalışma, ders ve uyku için rutinler, önümüzdeki 15 dakika ile 2 saat arası için hızlı engel. Engel kurmak ücretsiz.',
      f3_num: '03 · Akıllı engel', f3_h2: 'Reels\'siz sosyal medya.',
      f3_p: 'Reels, Shorts ve Sana Özel akışı engellenir. Mesajlar, arkadaşlarının gönderdiği videolar, gönderiler ve profiller çalışmaya devam eder. Pro\'ya dahil.',
      viz1_t: 'Bugün · en çok kullanılan', viz2_t: 'Instagram · günlük limit', viz2_used: 'kullanıldı', viz2_blocked: 'Gece yarısına kadar engelli', viz3_t: 'Instagram · YouTube · TikTok',
      data_eyebrow: 'Veri', data_h2: 'Uygulamanın içinde bir hafta.',
      data_p: 'Gerçek bir haftadan gerçek rakamlar: haftalık toplam, günlük ortalama ve bugünün ortalamanın ne kadar altında kaldığı.',
      data_l1: 'haftalık toplam', data_l2: 'günlük ortalama', data_l3: 'bugün', data_l4: 'ortalamaya göre', data_avg: 'ort', data_week: 'Bu hafta',
      cur_eyebrow: 'Gerçek para birimi zaman', cur_h2: 'Saatler soyuttur. Günler değil.',
      cur_l0: 'saat geri kazanıldı', cur_l1: 'gün', cur_l2: 'ay', cur_sub: 'Her kare geri verilen tam bir gün.',
      show_eyebrow: 'Uygulama', show_h2: 'Her şey, bir başparmak uzağında.',
      sc_home: 'Hızlı engel ve rutinler', sc_analytics: 'Haftan', sc_block: 'Gece yarısına kadar engelli', sc_focus: 'Odak seansları',
      how_eyebrow: 'Nasıl çalışır', how_h2: 'Üç adım.',
      step1_h: 'Gerçek rakamı gör', step1_p: 'Kullanım erişimi ver, ilk açılışta uygulama bazında gerçek ekran süreni gör.',
      step2_h: 'Limit koy', step2_p: 'Seni geri çeken uygulamayı seç; günlük limit, kapalı günler ya da Derin çalışma, Gece modu gibi bir rutin belirle. Engel kurmak ücretsiz.',
      step3_h: 'Engel yerinde kalır', step3_p: 'Limit dolunca uygulama gece yarısına kadar açılmaz. Erken açmak Pro\'da ücretsizdir, Pro\'n yoksa küçük bir tek seferlik ücrete tabidir.',
      pro_eyebrow: 'Ücretsiz ve Pro', pro_h2: 'Engel kurmak ücretsiz. Pro, Akıllı engeli ve daha sıkı kuralları ekler.',
      plan_free: 'Ücretsiz', plan_pro: 'Pro', pro_month: '/ ay', pro_year: 'yıllık',
      pf1: 'Uygulama başına günlük limit ve tam gün kapatma (iPhone\'da aynı anda tek uygulama)', pf2: 'Hızlı engel, bir rutin ve kendi amacını hatırlatan engel ekranı', pf3: 'Güne, haftaya ve kategoriye göre ekran süresi', pf4: 'Zamanlayıcılı odak seansları', pf5: 'Engeli ücret ödemeden erken açma',
      pp1: 'Ücretsizdeki her şey', pp2: 'Engeli bugünlük aç ya da limiti gevşet, ücret ödemeden', pp3: 'Sıkı odak: başlattığın seans iptal edilemez', pp4: 'Kırılamaz engel: Pro\'dayken bile engel bitene kadar açılamaz', pp5: 'Akıllı engel: Reels\'siz Instagram, Shorts\'suz YouTube, akışsız TikTok',
      pro_note: 'Yeni aboneler ücretsiz denemeyle başlar. İptal etmediğin sürece Google Play ya da App Store üzerinden otomatik yenilenir. Fiyatlar ülkeye ve mağazaya göre değişebilir.',
      test_eyebrow: 'Kullanıcılar ne diyor', test_h2: 'Kullananlardan.',
      price_on_play: "Fiyatı App Store'da ya da Google Play'de gör",
      blog_eyebrow: 'Blog', blog_h2: 'Rehberler ve karşılaştırmalar', blog_all: 'Tüm yazılar',
      faq_eyebrow: 'Sık sorulanlar', faq_h2: 'Merak edilenler',
      q1: 'Uygulama engelleme ücretsiz mi?', a1: 'Evet. Uygulama başına günlük limit, seçtiğin günlerde tam kapatma, hızlı engel ve bir rutin ücretsiz. iPhone\'da ücretsiz plan aynı anda tek uygulamayı engeller. Günlük limit gece yarısına kadar geçerlidir.',
      q2: 'Pro ne sağlıyor?', a2: 'Reels, Shorts ve TikTok akışları için Akıllı engel, engeli bugünlük açmak ya da limiti gevşetmek (ücretsiz), sıkı odak seansları, kırılamaz engeller, aynı anda birden fazla rutin ve uygulama açılmadan önce kısa bir bekleme.',
      q3: 'Ekran süresi verilerim nereye gidiyor?', a3: 'Uygulama bazındaki kullanım süreleri telefonundan çıkmaz. Hesabınla yalnızca onboarding yanıtların ve abonelik durumun eşitlenir.',
      q4: 'Hangi izinler gerekiyor?', a4: 'Android\'de: ekran süresini ölçmek için kullanım erişimi ve engel ekranını gösterebilmek için diğer uygulamaların üzerinde gösterme izni. Rahatsız Etmeyin izni isteğe bağlıdır; Akıllı engel erişilebilirlik iznini yalnızca sen açarsan ister. iPhone\'da: Ekran Süresi erişimi.',
      q5: 'iPhone sürümü var mı?', a5: 'Evet. Neurofast iPhone için App Store\'da (iOS 16 ve üzeri), Android için Google Play\'de. iPhone\'da engeller Apple\'ın Ekran Süresi altyapısıyla çalışır ve ücretsiz plan aynı anda tek uygulamayı engeller.',
      q6: 'Uygulamanın tamamını kapatmadan Reels ve Shorts engellenebilir mi?', a6: 'Evet, Akıllı engel (Pro) ile. Android\'de Instagram Reels\'i, YouTube Shorts\'u ve TikTok akışlarını engeller; mesajlar ve normal videolar çalışmaya devam eder. iPhone\'da Neurofast, Instagram, YouTube ve TikTok\'u kendi tarayıcısında bu akışlar olmadan açar.',
      q7: 'Neurofast nedir?', a7: 'Neurofast, iPhone ve Android için bir sosyal medya engelleme ve ekran süresi takibi uygulamasıdır. Her uygulamada ne kadar zaman geçirdiğini gösterir ve seçtiğin uygulamaları limitin dolunca engeller. Kasım 2026\'ya kadar adı Dopamine Tracker\'dı.',
      q8: 'Neurofast\'ı kaç kişi kullanıyor?', a8: '300\'den fazla kişi Neurofast\'ı aktif olarak kullanıyor ve birlikte 1.000 saatten fazla ekran süresini geri kazandılar (Kasım 2026).',
      final_h2: 'Daha fazla zamana ihtiyacın yok.', final_p: 'Zaten sahip olduğun zaman üzerinde daha fazla kontrole ihtiyacın var.',
      foot_privacy: 'Gizlilik politikası', foot_support: 'Destek', foot_blog: 'Blog', foot_ios: 'App Store', foot_play: 'Google Play',
      viz3_stay: 'Kalır',
      viz3_s1: 'Mesajlar',
      viz3_s2: 'Arkadaşlarının gönderdiği videolar',
      viz3_s3: 'Gönderiler ve profiller',
      viz3_gone: 'Gider',
      viz3_g1: 'Reels',
      viz3_g2: 'Shorts',
      viz3_g3: 'Sana Özel akışı',
      sc_smart: 'Reels ve Shorts engelli',
      pp6: 'Aynı anda birden fazla rutin ve uygulama açılmadan önce kısa bir bekleme',
      q9: 'Neurofast\'ın Opal ya da ScreenZen\'den farkı ne?',
      a9: 'Opal, ScreenZen, one sec ve AppBlock da dikkat dağıtan uygulamaları engeller. Neurofast Opal\'dan ucuzdur, Reels\'i ve Shorts\'u hem iPhone\'da hem Android\'de engeller ve engeli kaldırmayı bir bedele bağlar. Ayrıntılar: <a href="./blog/opal-alternatifi/">Opal alternatifi olarak Neurofast</a>, <a href="./blog/screenzen-alternatifi/">ScreenZen alternatifi olarak Neurofast</a> ve <a href="./blog/en-iyi-sosyal-medya-engelleme-uygulamalari/">en iyi sosyal medya engelleme uygulamaları</a>.'
    }
  }
};
