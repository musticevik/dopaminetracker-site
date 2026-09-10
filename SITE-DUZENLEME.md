# dopaminetracker.site — nasıl düzenlerim?

Bu site **GitHub Pages** ile yayınlanıyor. Sunucu yok, derleme sunucuda olmuyor:
repoya `push` ettiğin her dosya olduğu gibi `https://dopaminetracker.site` altında
yayınlanır. Push'tan sonra canlıya yansıması genelde **1–2 dakika** sürer.

- **Repo:** https://github.com/musticevik/dopaminetracker-site (dal: `main`)
- **Yerel kopya:** `D:\work_environment\projects\dopaminetracker-site`
- **Alan adı:** `CNAME` dosyasında (`dopaminetracker.site`). Bu dosyaya dokunma.

---

## Değişiklik yapmanın akışı (her seferinde aynı)

```bash
cd "D:\work_environment\projects\dopaminetracker-site"
git pull                      # 1) önce günceli çek

# 2) dosyaları düzenle (aşağıdaki haritaya bak)

python _src/build.py          # 3) SADECE metin/fiyat/şablon değiştirdiysen gerekli
python -m http.server 8000    # 4) yerelde önizle: http://127.0.0.1:8000  (Ctrl+C ile durdur)

git add -A                    # 5) yayınla
git commit -m "kısa açıklama"
git push
```

`push`'tan 1–2 dakika sonra canlıda görürsün. **Tarayıcı önbelleği** yüzünden
değişikliği görmezsen sayfayı sert yenile (Ctrl+F5) ya da gizli sekmede aç.

---

## Neyi nereden değiştiririm? (dosya haritası)

| Ne değiştirmek istiyorsun | Hangi dosya | Sonra `build.py`? |
|---|---|---|
| Ana sayfadaki **metinler** (başlık, özellik yazıları, SSS, buton yazıları) | `assets/config.js` → `copy.en` / `copy.tr` | **Evet** |
| **Fiyatlar** | `assets/config.js` → `pricing` (USD/TRY) | **Evet** |
| **Yorumlar / puanlar** | `assets/config.js` → `testimonials` | **Evet** |
| Bayrak/istatistik anahtarları (`showImpact` vb.) | `assets/config.js` → `stats` | **Evet** |
| Ana sayfanın **düzeni / bölüm sırası** (HTML iskeleti) | `_src/landing.template.html` | **Evet** |
| **Renkler, yazı tipi, boşluklar** (tasarım sistemi) | `assets/site.css` | Hayır |
| Kaydırma animasyonları, ek stiller | `assets/landing.js`, `assets/story.css`, `assets/landing.css` | Hayır |
| **Gizlilik politikası** metni | `privacy/index.html` (EN) + `tr/gizlilik/index.html` (TR) | Hayır (elle yazılıyor) |
| **Destek** sayfası metni | `support/index.html` (EN) + `tr/destek/index.html` (TR) | Hayır (elle yazılıyor) |
| **Ekran görüntüleri** | `assets/img/screens/*.jpg` (973×2048) — aynı adla değiştir | Hayır |
| Uygulama ikonu | `assets/img/icon.png` | Hayır |
| Arama motoru haritası | `sitemap.xml` | Hayır |

> **Önemli:** `index.html` ve `tr/index.html` dosyaları **üretilmiş çıktıdır** —
> onları elle düzenleme. Ana sayfa metnini değiştirmek için `assets/config.js`'i
> düzenle, sonra `python _src/build.py` çalıştır. Script bu iki dosyayı yeniden
> yazar; üretilen dosyaları kaynakla **birlikte** commit et.

---

## `assets/config.js` — tek gerçek kaynak

Ana sayfadaki neredeyse her şey buradan gelir. İki dil bloğu var: `copy.en` ve
`copy.tr`. Aynı anahtarı iki dilde de güncellemen gerekir.

- **Fiyat:** `pricing.USD` ve `pricing.TRY` altında `monthly` / `yearly`. Bir değer
  `null` ise sayfa "Fiyatı Google Play'de gör" yazar. **Fiyatı asla uydurma** —
  Play Console → Abonelikler'deki gerçek rakamı yaz. (Şu an `USD` `null`; ABD
  fiyatını girmek istersen Play Console'dan kopyala.)
- **Yorumlar:** `testimonials.en` / `testimonials.tr` — gerçek Google Play
  yorumları. Uydurma yorum ekleme.
- **`stats.showImpact`:** `false` iken "Impact so far" / "Zamanın gerçek para
  birimi" bölümleri gizli. Gerçek, ölçülmüş `usersHelped` ve `hoursReclaimed`
  sayıların olmadan `true` yapma.

Değişiklikten sonra **mutlaka** `python _src/build.py`.

---

## Sık yapılan işler için hızlı tarifler

**Bir SSS cevabını değiştir:** `config.js`'te `copy.en.a3` (ve `copy.tr.a3`) gibi
`q1..q5` / `a1..a5` anahtarlarını düzenle → `build.py` → önizle → push.

**Ekran görüntüsünü yenile:** yeni JPG'i **aynı dosya adıyla**
`assets/img/screens/` içine koy (973×2048 dikey). `build.py` gerekmez. Push.

**Gizlilik veya destek metnini değiştir:** ilgili `index.html`'i doğrudan düzenle.
İki dili de güncellemeyi unutma (`privacy/` + `tr/gizlilik/`, ya da `support/` +
`tr/destek/`). `build.py` gerekmez.

**Yeni bir yasal/bilgi sayfası ekle** (ör. `kosullar/`): mevcut `support/index.html`'i
kopyala, klasör aç (`kosullar/index.html`), başlığı/metni değiştir, `canonical` ve
`hreflang` bağlantılarını yeni URL'e göre düzelt, `sitemap.xml`'e ekle. Elle yazılan
sayfa olduğu için `build.py` gerekmez.

---

## App Store / Play için hazır bağlantılar

- Gizlilik (EN): `https://dopaminetracker.site/privacy/`
- Gizlilik (TR): `https://dopaminetracker.site/tr/gizlilik/`
- **Destek (EN):** `https://dopaminetracker.site/support/`
- **Destek (TR):** `https://dopaminetracker.site/tr/destek/`

App Store Connect'teki **Support URL** alanına `https://dopaminetracker.site/support/`
yaz.

---

## Dikkat edilecekler

- `.nojekyll` dosyasını silme — GitHub Pages'in klasörleri olduğu gibi sunması için
  gerekli.
- `CNAME` dosyasını silme/değiştirme — alan adı bağlaması bozulur.
- Üretilen `index.html` / `tr/index.html`'i elle düzenlersen, bir sonraki
  `build.py` üzerine yazar. Değişikliği kalıcı istiyorsan kaynağı (`config.js` /
  template) düzenle.
- `build.py` çalışması için bilgisayarda **Node.js** kurulu olmalı (config.js'i
  okumak için kullanılıyor) — sende var.
