# -*- coding: utf-8 -*-
"""Bakes the landing template, the blog and the sitemap into static files.

    python _src/build.py

Landing: reads copy, prices, testimonials and flags from assets/config.js (via
Node, so the JS file stays the single source of truth), fills every `data-i`
element with the language's text, writes SEO head tags and JSON-LD, and emits:
    index.html      English  (canonical https://dopaminetracker.site/, x-default)
    tr/index.html   Turkish  (canonical https://dopaminetracker.site/tr/)
The English root carries a small client-side geo/language redirect: Turkish
browsers (or the Europe/Istanbul time zone) land on /tr/ unless the visitor
has picked a language before. landing.js re-applies the same copy at runtime.

Blog: every file in _src/blog/en/ and _src/blog/tr/ becomes a page:
    _src/blog/en/<slug>.html  ->  blog/<slug>/index.html
    _src/blog/tr/<slug>.html  ->  tr/blog/<slug>/index.html
plus the two index pages blog/index.html and tr/blog/index.html. A source file
starts with an HTML comment of `key: value` lines (title, h1, description,
excerpt, date, optional updated, optional pair = slug of the translation) and
continues with the article body. In the body {{IOS}}, {{PLAY}}, {{HOME}},
{{PRIVACY}}, {{SUPPORT}} and {{POST:<slug>}} expand to links.

Sitemap: sitemap.xml is rewritten from STATIC_PAGES below plus the blog.
"""
import html as htmllib
import hashlib, io, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://dopaminetracker.site"
HOME_UPDATED = "2026-11-25"   # bump when the landing copy changes (sitemap lastmod)

def asset_version():
    """Short hash of the CSS/JS files and the app screens, appended to their URLs (?v=...) so browsers refetch them after a change."""
    h = hashlib.sha1()
    folder = os.path.join(ROOT, "assets")
    for name in sorted(os.listdir(folder)):
        if name.endswith((".css", ".js")):
            h.update(io.open(os.path.join(folder, name), "rb").read().replace(b"\r\n", b"\n"))
    for base, _, names in sorted(os.walk(os.path.join(folder, "img", "screens"))):
        for name in sorted(names):
            h.update(io.open(os.path.join(base, name), "rb").read())
    return h.hexdigest()[:8]

def load_config():
    js = "global.window={};require(%s);process.stdout.write(JSON.stringify(window.DT_CONFIG))" % json.dumps(
        os.path.join(ROOT, "assets", "config.js").replace("\\", "/"))
    return json.loads(subprocess.check_output(["node", "-e", js], encoding="utf-8"))

GEO_SCRIPT = """<script>(function(){try{var p=location.pathname;if(p!=='/'&&p!=='/index.html')return;var c=localStorage.getItem('dt_lang');if(c==='en')return;var ls=navigator.languages||[navigator.language||''];var tr=c==='tr'||ls.some(function(l){return /^tr(-|$)/i.test(l)})||Intl.DateTimeFormat().resolvedOptions().timeZone==='Europe/Istanbul';if(tr)location.replace('/tr/'+location.hash)}catch(e){}})();</script>"""

PAGES = {
    "en": dict(
        out="index.html", prefix="./", home_suffix="", canon=BASE + "/", geo=True,
        title="Neurofast: Social Media Blocker for iPhone and Android",
        desc="Neurofast is a social media blocker and screen time tracker for iPhone and Android. Limit Instagram, TikTok and YouTube, block Reels and Shorts. Free to start.",
        og_title="Neurofast: Block social media. Take back your time.",
        og_desc="See where your screen time goes and block the apps, Reels and Shorts that take it. Free on iPhone and Android.",
        og_locale="en_US", og_image=BASE + "/assets/img/og-en.png",
        privacy="./privacy/", support="./support/", blog="./blog/", other_href="./tr/", other_label="Türkçe",
        alts=dict(HOME="Neurofast: quick block, routines and Smart block",
                  ANALYTICS="Neurofast analytics: screen time for the last 7 days by day and category",
                  BLOCK="Neurofast block screen: Instagram blocked after its daily limit",
                  FOCUS="Neurofast focus session timer with strict mode",
                  SMART="Neurofast Smart block: Instagram Reels, YouTube Shorts and TikTok feeds switched off"),
    ),
    "tr": dict(
        out="tr/index.html", prefix="../", home_suffix="tr/", canon=BASE + "/tr/", geo=False,
        title="Neurofast: iPhone ve Android için Sosyal Medya Engelleme",
        desc="Neurofast, iPhone ve Android için sosyal medya engelleme ve ekran süresi uygulaması. Instagram, TikTok ve YouTube'a limit koy, Reels'i ve Shorts'u engelle.",
        og_title="Neurofast: Sosyal medyayı engelle. Zamanını geri al.",
        og_desc="Ekran sürenin nereye gittiğini gör; o süreyi alan uygulamaları, Reels'i ve Shorts'u engelle. iPhone ve Android'de ücretsiz.",
        og_locale="tr_TR", og_image=BASE + "/assets/img/og.png",
        privacy="./gizlilik/", support="./destek/", blog="./blog/", other_href="../", other_label="English",
        alts=dict(HOME="Neurofast: hızlı engel, rutinler ve Akıllı engel",
                  ANALYTICS="Neurofast analiz: son 7 günün güne ve kategoriye göre ekran süresi",
                  BLOCK="Neurofast engel ekranı: günlük limiti dolan Instagram engelli",
                  FOCUS="Neurofast odak seansı zamanlayıcısı ve sıkı mod",
                  SMART="Neurofast Akıllı engel: Instagram Reels, YouTube Shorts ve TikTok akışları kapalı"),
    ),
}

LOCALE = {"en": "en-US", "tr": "tr-TR"}

def fmt_cur(v, cur, lang):
    """Mirror Intl.NumberFormat currency output closely enough for static HTML."""
    out = subprocess.check_output(["node", "-e",
        "process.stdout.write(new Intl.NumberFormat(%s,{style:'currency',currency:%s}).format(%s))"
        % (json.dumps(LOCALE[lang]), json.dumps(cur), json.dumps(v))], encoding="utf-8")
    return out

def price_blocks(lang, copy, cfg):
    cur = cfg["currencyFor"][lang]
    price = cfg["pricing"].get(cur) or {}
    free = re.sub(r"[\d.,]+", "0", fmt_cur(0, cur, lang))
    if price.get("monthly") is None:
        pro = '<span class="on-play">%s</span>' % copy["price_on_play"]
    else:
        pro = ('<span id="priceM">%s</span><small><span data-i="pro_month">%s</span> · <span id="priceY">%s</span> <span data-i="pro_year">%s</span></small>'
               % (fmt_cur(price["monthly"], cur, lang), copy["pro_month"], fmt_cur(price["yearly"], cur, lang), copy["pro_year"]))
    return free, pro, cur, price

def org_node(cfg):
    return {"@type": "Organization", "@id": BASE + "/#org", "name": "Neurofast", "url": BASE + "/",
            "logo": BASE + "/assets/img/icon.png", "sameAs": [cfg["downloadUrl"], cfg["appStoreUrl"]]}

def jsonld(lang, copy, cfg, canon, cur, price, desc):
    faq, i = [], 1
    while "q%d" % i in copy:
        faq.append({"@type": "Question", "name": copy["q%d" % i],
                    "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", copy["a%d" % i])}})
        i += 1
    offers = [{"@type": "Offer", "price": "0", "priceCurrency": cur}]
    if price.get("monthly") is not None:
        offers += [{"@type": "Offer", "name": "Pro monthly", "price": str(price["monthly"]), "priceCurrency": cur},
                   {"@type": "Offer", "name": "Pro yearly", "price": str(price["yearly"]), "priceCurrency": cur}]
    return json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            org_node(cfg),
            {"@type": "WebSite", "@id": BASE + "/#site", "name": "Neurofast", "alternateName": ["Neurofast app", "Dopamine Tracker"],
             "url": BASE + "/", "inLanguage": ["en", "tr"], "publisher": {"@id": BASE + "/#org"}},
            {"@type": "SoftwareApplication", "name": "Neurofast", "alternateName": "Neurofast: Block Social Media",
             "operatingSystem": "Android, iOS", "applicationCategory": "LifestyleApplication", "url": canon,
             "installUrl": cfg["downloadUrl"], "downloadUrl": [cfg["downloadUrl"], cfg["appStoreUrl"]],
             "image": BASE + "/assets/img/icon.png", "description": desc, "inLanguage": lang,
             "publisher": {"@id": BASE + "/#org"}, "offers": offers},
            {"@type": "FAQPage", "mainEntity": faq},
        ]}, ensure_ascii=False)

def quotes_html(items):
    return "".join(
        '<figure class="quote"><span class="bar"></span><span class="stars" aria-label="%d / 5">%s</span>'
        '<p>“%s”</p><figcaption class="who"><span class="av">%s</span>%s · %s</figcaption></figure>'
        % (t["stars"], "★" * t["stars"], t["text"], t["name"][0], t["name"], t["source"]) for t in items)

def bake_copy(html, copy):
    def sub(m):
        tag, pre, key, post = m.group(1), m.group(2), m.group(3), m.group(4)
        text = copy.get(key)
        return m.group(0) if text is None else "<%s%sdata-i=\"%s\"%s>%s</%s>" % (tag, pre, key, post, text, tag)
    return re.sub(r'<(\w+)([^>]*?)data-i="(\w+)"([^>]*)>(.*?)</\1>', sub, html)

def write(rel, text):
    out = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(out) or ROOT, exist_ok=True)
    io.open(out, "w", encoding="utf-8", newline="\n").write(text)

# ---------------------------------------------------------------- blog

MONTHS = {"en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          "tr": ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]}

BLOG = {
    "en": dict(dir="blog/", home="", privacy="privacy/", support="support/", locale="en_US", og="og-en.png",
               title="Neurofast Blog: Screen Time, Social Media Blocking and Focus",
               desc="Guides from the Neurofast team: what the app does, how to block Reels and Shorts, and how to cut the hours your phone takes.",
               h1="Neurofast blog", lead="Guides on screen time, blocking social media and getting your attention back.",
               t=dict(home="Home", blog="Blog", get="Get the app", read="min read", updated="Updated", more="More articles",
                      cta_h="Get Neurofast", cta_p="Free on iPhone and Android.", privacy="Privacy policy", support="Support", other="Türkçe")),
    "tr": dict(dir="tr/blog/", home="tr/", privacy="tr/gizlilik/", support="tr/destek/", locale="tr_TR", og="og.png",
               title="Neurofast Blog: Ekran Süresi, Sosyal Medya Engelleme ve Odak",
               desc="Neurofast ekibinden rehberler: uygulama ne yapar, Reels ve Shorts nasıl engellenir, telefonun aldığı saatler nasıl azaltılır.",
               h1="Neurofast blog", lead="Ekran süresi, sosyal medyayı engelleme ve dikkatini geri alma üzerine rehberler.",
               t=dict(home="Ana sayfa", blog="Blog", get="Uygulamayı al", read="dk okuma", updated="Güncelleme", more="Diğer yazılar",
                      cta_h="Neurofast'ı indir", cta_p="iPhone ve Android'de ücretsiz.", privacy="Gizlilik politikası", support="Destek", other="English")),
}

PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l.1.1 9.2-9.2v-.2L3.7 2.3l-.1.1zm12.3 12.3L12.9 12v-.2l3-3 .1.1 3.6 2c1 .6 1 1.6 0 2.2l-3.6 2-.1.1zm-.1.1-3-3-9.2 9.2c.3.4.9.4 1.5 0l10.7-6.2zm0-6.4L5.1 2.2c-.6-.4-1.2-.3-1.5 0l9.2 9.2 3-3z"></path></svg>'
APPLE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path></svg>'

BLOG_HEAD = """<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
{alternates}<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Neurofast">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{og_image}">
<meta property="og:locale" content="{locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0f0f14">
<meta name="apple-itunes-app" content="app-id=6810599494">
<link rel="icon" href="{p}assets/img/icon.png">
<link rel="apple-touch-icon" href="{p}assets/img/icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{p}assets/site.css?v={v}">
<link rel="stylesheet" href="{p}assets/blog.css?v={v}">
<script type="application/ld+json">{jsonld}</script>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="{home}"><img src="{p}assets/img/icon.png" alt="" width="32" height="32">Neurofast</a><nav class="nav" aria-label="Site"><a href="{home}">{t_home}</a><a href="{blog}">{t_blog}</a>{lang_link}<a class="btn primary" href="{home}#download">{t_get}</a></nav></div></header>
"""

BLOG_FOOT = """<footer><div class="wrap"><div>© 2026 Neurofast</div><div><a href="{home}">{t_home}</a><a href="{blog}">{t_blog}</a><a href="{privacy}">{t_privacy}</a><a href="{support}">{t_support}</a><a href="{ios}" rel="noopener">App Store</a><a href="{play}" rel="noopener">Google Play</a></div></div></footer>
</body>
</html>
"""

def fmt_date(iso, lang):
    y, m, d = (int(x) for x in iso.split("-"))
    return "%s %d, %d" % (MONTHS[lang][m - 1], d, y) if lang == "en" else "%d %s %d" % (d, MONTHS[lang][m - 1], y)

def load_posts(lang):
    folder = os.path.join(ROOT, "_src", "blog", lang)
    posts = []
    for name in sorted(os.listdir(folder)) if os.path.isdir(folder) else []:
        if not name.endswith(".html"):
            continue
        raw = io.open(os.path.join(folder, name), encoding="utf-8").read()
        m = re.match(r"\s*<!--(.*?)-->\s*", raw, re.S)
        if not m:
            sys.exit("blog source %s/%s has no front-matter comment" % (lang, name))
        meta = dict((k.strip(), v.strip()) for k, v in (line.split(":", 1) for line in m.group(1).strip().splitlines() if ":" in line))
        for key in ("title", "h1", "description", "excerpt", "date"):
            if not meta.get(key):
                sys.exit("blog source %s/%s is missing '%s'" % (lang, name, key))
        meta.update(slug=name[:-5], lang=lang, body=raw[m.end():].strip())
        posts.append(meta)
    return sorted(posts, key=lambda p: (p["date"], p["slug"]), reverse=True)

def post_url(p):
    return "%s/%s%s/" % (BASE, BLOG[p["lang"]]["dir"], p["slug"])

def stores_html(cfg):
    return ('<a class="btn primary" href="%s" rel="noopener">%sApp Store</a><a class="btn primary" href="%s" rel="noopener">%sGoogle Play</a>'
            % (cfg["appStoreUrl"], APPLE_SVG, cfg["downloadUrl"], PLAY_SVG))

def card_html(p, href):
    return ('<a class="post-card" href="%s"><span class="date">%s</span><h3>%s</h3><p>%s</p></a>'
            % (href, fmt_date(p["date"], p["lang"]), p["h1"], p["excerpt"]))

def blog_shell(lang, depth, cfg, **kw):
    """Shared head/foot values for a blog page `depth` folders below the site root."""
    b, p = BLOG[lang], "../" * depth
    t = b["t"]
    vals = dict(lang=lang, p=p, v=asset_version(), home=p + b["home"], blog=p + b["dir"], privacy=p + b["privacy"], support=p + b["support"],
                locale=b["locale"], og_image="%s/assets/img/%s" % (BASE, b["og"]), ios=cfg["appStoreUrl"], play=cfg["downloadUrl"],
                t_home=t["home"], t_blog=t["blog"], t_get=t["get"], t_privacy=t["privacy"], t_support=t["support"])
    vals.update(kw)
    for k in ("title", "desc"):
        vals[k] = htmllib.escape(vals[k], quote=True)
    return vals

def alternates_html(urls):
    """urls: {lang: absolute url}; x-default points at English when it exists."""
    if len(urls) < 2:
        return ""
    out = "".join('<link rel="alternate" hreflang="%s" href="%s">\n' % (l, u) for l, u in sorted(urls.items()))
    return out + ('<link rel="alternate" hreflang="x-default" href="%s">\n' % urls["en"] if "en" in urls else "")

def build_blog(cfg):
    posts = {lang: load_posts(lang) for lang in BLOG}
    by_slug = {lang: {p["slug"]: p for p in posts[lang]} for lang in BLOG}
    other = {"en": "tr", "tr": "en"}
    sitemap = []
    for lang, b in BLOG.items():
        t = b["t"]
        # ---- articles
        for post in posts[lang]:
            depth = b["dir"].count("/") + 1
            pair = by_slug[other[lang]].get(post.get("pair", ""))
            if post.get("pair") and not pair:
                sys.exit("blog post %s/%s: pair '%s' not found" % (lang, post["slug"], post["pair"]))
            urls = {lang: post_url(post)}
            if pair:
                urls[other[lang]] = post_url(pair)
            body = post["body"]
            for key, val in (("{{IOS}}", cfg["appStoreUrl"]), ("{{PLAY}}", cfg["downloadUrl"]), ("{{HOME}}", "../" * depth + b["home"]),
                             ("{{PRIVACY}}", "../" * depth + b["privacy"]), ("{{SUPPORT}}", "../" * depth + b["support"])):
                body = body.replace(key, val)
            def link(m):
                if m.group(1) not in by_slug[lang]:
                    sys.exit("blog post %s/%s links to unknown post '%s'" % (lang, post["slug"], m.group(1)))
                return "../%s/" % m.group(1)
            body = re.sub(r"\{\{POST:([\w-]+)\}\}", link, body)
            words = len(re.sub(r"<[^>]+>", " ", body).split())
            updated = post.get("updated") or post["date"]
            ld = json.dumps({"@context": "https://schema.org", "@graph": [
                {"@type": "BlogPosting", "headline": post["h1"], "description": post["description"], "inLanguage": lang,
                 "datePublished": post["date"], "dateModified": updated, "mainEntityOfPage": urls[lang],
                 "image": "%s/assets/img/%s" % (BASE, b["og"]), "author": org_node(cfg), "publisher": org_node(cfg)},
                {"@type": "BreadcrumbList", "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Neurofast", "item": "%s/%s" % (BASE, b["home"])},
                    {"@type": "ListItem", "position": 2, "name": t["blog"], "item": "%s/%s" % (BASE, b["dir"])},
                    {"@type": "ListItem", "position": 3, "name": post["h1"], "item": urls[lang]}]}]}, ensure_ascii=False)
            lang_link = ('<a class="lang" href="../../%s%s/" hreflang="%s">%s</a>' % ("../" * (depth - 2) + BLOG[other[lang]]["dir"], pair["slug"], other[lang], other[lang].upper())
                         if pair else "")
            vals = blog_shell(lang, depth, cfg, title=post["title"], desc=post["description"], canon=urls[lang],
                              alternates=alternates_html(urls), og_type="article", jsonld=ld, lang_link=lang_link)
            meta_line = "%s · %d %s" % (fmt_date(post["date"], lang), max(1, round(words / 200.0)), t["read"])
            if updated != post["date"]:
                meta_line += " · %s: %s" % (t["updated"], fmt_date(updated, lang))
            more = "".join(card_html(p, "../%s/" % p["slug"]) for p in posts[lang] if p is not post)
            html = (BLOG_HEAD.format(**vals)
                    + '<main class="legal post">\n<p class="crumbs"><a href="%s">Neurofast</a> / <a href="%s">%s</a></p>\n' % (vals["home"], vals["blog"], t["blog"])
                    + '<h1>%s</h1>\n<p class="updated">%s</p>\n' % (post["h1"], meta_line)
                    + body + "\n"
                    + '<aside class="get"><h2>%s</h2><p>%s</p><div class="cta">%s</div></aside>\n' % (t["cta_h"], t["cta_p"], stores_html(cfg))
                    + ('<h2 class="more-h">%s</h2>\n<div class="posts">%s</div>\n' % (t["more"], more) if more else "")
                    + "</main>\n" + BLOG_FOOT.format(**vals))
            leftover = re.findall(r"{{[\w:-]+}}", html)
            if leftover:
                sys.exit("unfilled placeholders in blog post %s/%s: %s" % (lang, post["slug"], sorted(set(leftover))))
            write("%s%s/index.html" % (b["dir"], post["slug"]), html)
            sitemap.append((urls[lang], updated, urls))
            print("wrote %s%s/ (%d words)" % (b["dir"], post["slug"], words))
        # ---- index
        depth = b["dir"].count("/")
        urls = {l: "%s/%s" % (BASE, BLOG[l]["dir"]) for l in BLOG if posts[l]}
        ld = json.dumps({"@context": "https://schema.org", "@type": "Blog", "name": b["title"], "url": urls.get(lang), "inLanguage": lang,
                         "publisher": org_node(cfg),
                         "blogPost": [{"@type": "BlogPosting", "headline": p["h1"], "url": post_url(p), "datePublished": p["date"]} for p in posts[lang]]},
                        ensure_ascii=False)
        lang_link = '<a class="lang" href="%s" hreflang="%s">%s</a>' % ("../" * depth + BLOG[other[lang]]["dir"], other[lang], other[lang].upper()) if posts[other[lang]] else ""
        vals = blog_shell(lang, depth, cfg, title=b["title"], desc=b["desc"], canon="%s/%s" % (BASE, b["dir"]),
                          alternates=alternates_html(urls), og_type="website", jsonld=ld, lang_link=lang_link)
        html = (BLOG_HEAD.format(**vals)
                + '<main class="legal post blog-index">\n<p class="eyebrow">%s</p>\n<h1>%s</h1>\n<p class="lede">%s</p>\n' % (t["blog"], b["h1"], b["lead"])
                + '<div class="posts">%s</div>\n' % "".join(card_html(p, "./%s/" % p["slug"]) for p in posts[lang])
                + '<aside class="get"><h2>%s</h2><p>%s</p><div class="cta">%s</div></aside>\n' % (t["cta_h"], t["cta_p"], stores_html(cfg))
                + "</main>\n" + BLOG_FOOT.format(**vals))
        write(b["dir"] + "index.html", html)
        if posts[lang]:
            sitemap.append(("%s/%s" % (BASE, b["dir"]), max(p.get("updated") or p["date"] for p in posts[lang]), urls))
        print("wrote %sindex.html (%d posts)" % (b["dir"], len(posts[lang])))
    return posts, sitemap

# ---------------------------------------------------------------- sitemap

def pair(en, tr, lastmod):
    urls = {"en": BASE + en, "tr": BASE + tr}
    return [(urls["en"], lastmod, urls), (urls["tr"], lastmod, urls)]

# Hand-written pages: bump the date when you edit one.
STATIC_PAGES = (pair("/", "/tr/", HOME_UPDATED) + pair("/privacy/", "/tr/gizlilik/", "2026-11-13")
                + pair("/support/", "/tr/destek/", "2026-11-25") + [(BASE + "/terms/", "2026-11-18", {})])

def build_sitemap(entries):
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for loc, lastmod, urls in entries:
        out.append("  <url>\n    <loc>%s</loc>" % loc)
        if len(urls) > 1:
            out += ['    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (l, u) for l, u in sorted(urls.items())]
            if "en" in urls:
                out.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % urls["en"])
        out.append("    <lastmod>%s</lastmod>\n  </url>" % lastmod)
    out.append("</urlset>\n")
    write("sitemap.xml", "\n".join(out))
    print("wrote sitemap.xml (%d urls)" % len(entries))

# ---------------------------------------------------------------- landing

def build():
    cfg = load_config()
    posts, blog_entries = build_blog(cfg)
    tpl = io.open(os.path.join(ROOT, "_src", "landing.template.html"), encoding="utf-8").read()
    show_impact = bool(cfg["stats"].get("showImpact"))
    for lang, p in PAGES.items():
        copy = cfg["copy"][lang]
        html = tpl
        if not show_impact:
            html = re.sub(r"<!--IMPACT-->.*?<!--/IMPACT-->", "", html, flags=re.S)
            html = re.sub(r"<!--IMPACT_NAV-->.*?<!--/IMPACT_NAV-->", "", html, flags=re.S)
        else:
            for tag in ("<!--IMPACT-->", "<!--/IMPACT-->", "<!--IMPACT_NAV-->", "<!--/IMPACT_NAV-->"):
                html = html.replace(tag, "")
        if not posts[lang]:
            html = re.sub(r'<section id="blog">.*?</section>\s*', "", html, flags=re.S)
        html = bake_copy(html, copy)
        free, pro, cur, price = price_blocks(lang, copy, cfg)
        switch = ('<a href="%s" hreflang="en" lang="en"%s>EN</a><a href="%s" hreflang="tr" lang="tr"%s>TR</a>' % (
            p["prefix"], ' class="is-active"' if lang == "en" else "",
            p["prefix"] + "tr/", ' class="is-active"' if lang == "tr" else ""))
        rep = {
            "{{LANG}}": lang, "{{TITLE}}": p["title"], "{{DESC}}": p["desc"], "{{CANON}}": p["canon"],
            "{{OG_TITLE}}": p["og_title"], "{{OG_DESC}}": p["og_desc"], "{{OG_LOCALE}}": p["og_locale"], "{{OG_IMAGE}}": p["og_image"],
            "{{P}}": p["prefix"], "{{SCR}}": "tr/" if lang == "tr" else "", "{{V}}": asset_version(), "{{HOME_SUFFIX}}": p["home_suffix"], "{{LANG_SWITCH}}": switch,
            "{{GEO_SCRIPT}}": GEO_SCRIPT if p["geo"] else "",
            "{{PRICE_FREE}}": free, "{{PRICE_PRO}}": pro,
            "{{JSONLD}}": jsonld(lang, copy, cfg, p["canon"], cur, price, p["desc"]),
            "{{QUOTES}}": quotes_html(cfg["testimonials"].get(lang) or cfg["testimonials"]["en"]),
            "{{PRIVACY_HREF}}": p["privacy"], "{{SUPPORT_HREF}}": p["support"], "{{BLOG_HREF}}": p["blog"],
            "{{BLOG_CARDS}}": "".join(card_html(x, "%s%s/" % (p["blog"], x["slug"])) for x in posts[lang][:6]),
            "{{OTHER_HREF}}": p["other_href"], "{{OTHER_LABEL}}": p["other_label"],
        }
        for k, v in p["alts"].items():
            rep["{{ALT_%s}}" % k] = v
        for k, v in rep.items():
            html = html.replace(k, v)
        leftover = re.findall(r"{{\w+}}", html)
        if leftover:
            sys.exit("unfilled placeholders in %s: %s" % (p["out"], sorted(set(leftover))))
        write(p["out"], html)
        print("wrote", p["out"], len(html), "bytes |", cur, "monthly:", price.get("monthly"))
    build_sitemap(STATIC_PAGES + blog_entries)

if __name__ == "__main__":
    build()
