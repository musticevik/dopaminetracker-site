# -*- coding: utf-8 -*-
"""Bakes the landing template into one static page per language.

    python _src/build.py

Reads copy, testimonials and flags from assets/config.js (via Node, so the
JS file stays the single source of truth), fills every `data-i` element with
the language's text, writes SEO head tags and JSON-LD, and emits:
    index.html      Turkish  (canonical https://dopaminetracker.site/)
    en/index.html   English  (canonical https://dopaminetracker.site/en/)
landing.js re-applies the same copy at runtime, so the two never drift.
"""
import io, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://dopaminetracker.site"

def load_config():
    js = "global.window={};require(%s);process.stdout.write(JSON.stringify(window.DT_CONFIG))" % json.dumps(
        os.path.join(ROOT, "assets", "config.js").replace("\\", "/"))
    return json.loads(subprocess.check_output(["node", "-e", js], encoding="utf-8"))

PAGES = {
    "tr": dict(
        out="index.html", prefix="./", home_suffix="", canon=BASE + "/",
        title="Dopamine Tracker: Ekran Süresi Takibi ve Uygulama Engelleme (Android)",
        desc="Ekran süreni gerçek rakamlarla gör, Instagram ve TikTok gibi uygulamalara günlük limit koy, limit dolunca uygulama açılmasın. Telefon bağımlılığına karşı ücretsiz Android uygulaması.",
        og_title="Dopamine Tracker: Zamanını geri al.",
        og_desc="Ekran sürenin nereye gittiğini gör ve kontrolü ele al. Android için ücretsiz.",
        og_locale="tr_TR", privacy="./gizlilik/", other_href="./en/", other_label="English",
        alts=dict(HOME="Dopamine Tracker ana sayfası: günlük dopamin skoru ve bugünkü ekran süresi",
                  ANALYTICS="Analiz: haftalık ekran süresi grafiği ve kategoriler",
                  BLOCK="Engelle: günlük limitli uygulamalar",
                  FOCUS="Odak seansı zamanlayıcısı",
                  ACCOUNT="Hesap: hedefler ve ilerleme"),
        currency_note="TRY",
    ),
    "en": dict(
        out="en/index.html", prefix="../", home_suffix="en/", canon=BASE + "/en/",
        title="Dopamine Tracker: Screen Time Tracker and App Blocker for Android",
        desc="See your real screen time, set daily limits on Instagram, TikTok and other apps, and stop them from opening once the limit is reached. Free Android app against phone addiction.",
        og_title="Dopamine Tracker: Take back your time.",
        og_desc="See where your screen time goes and take control of it. Free on Android.",
        og_locale="en_US", privacy="./privacy/", other_href="../", other_label="Türkçe",
        alts=dict(HOME="Dopamine Tracker home: today's dopamine score and screen time",
                  ANALYTICS="Analytics: weekly screen time chart and categories",
                  BLOCK="Block: apps with daily limits",
                  FOCUS="Focus session timer",
                  ACCOUNT="Account: goals and progress"),
        currency_note="TRY",
    ),
}

def jsonld(lang, copy, cfg, canon):
    faq = [{"@type": "Question", "name": copy["q%d" % i],
            "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", copy["a%d" % i])}} for i in range(1, 6)]
    price = cfg["pricing"]
    return json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "SoftwareApplication", "name": "Dopamine Tracker", "operatingSystem": "Android",
             "applicationCategory": "LifestyleApplication", "url": canon, "installUrl": cfg["downloadUrl"],
             "image": BASE + "/assets/img/icon.png",
             "description": copy["f1_p"] if lang == "en" else copy["f1_p"],
             "offers": [
                 {"@type": "Offer", "price": "0", "priceCurrency": price["currency"]},
                 {"@type": "Offer", "name": "Pro monthly", "price": str(price["monthly"]), "priceCurrency": price["currency"]},
                 {"@type": "Offer", "name": "Pro yearly", "price": str(price["yearly"]), "priceCurrency": price["currency"]}]},
            {"@type": "FAQPage", "mainEntity": faq},
        ]}, ensure_ascii=False)

def quotes_html(items):
    out = []
    for t in items:
        out.append('<figure class="quote"><span class="bar"></span><span class="stars" aria-label="%d / 5">%s</span>'
                   '<p>“%s”</p><figcaption class="who"><span class="av">%s</span>%s · %s</figcaption></figure>'
                   % (t["stars"], "★" * t["stars"], t["text"], t["name"][0], t["name"], t["source"]))
    return "".join(out)

def bake_copy(html, copy):
    def sub(m):
        tag, pre, key, post, _inner = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
        text = copy.get(key)
        return m.group(0) if text is None else "<%s%sdata-i=\"%s\"%s>%s</%s>" % (tag, pre, key, post, text, tag)
    return re.sub(r'<(\w+)([^>]*?)data-i="(\w+)"([^>]*)>(.*?)</\1>', sub, html)

def build():
    cfg = load_config()
    tpl = io.open(os.path.join(ROOT, "_src", "landing.template.html"), encoding="utf-8").read()
    show_impact = bool(cfg["stats"].get("showImpact"))
    for lang, p in PAGES.items():
        copy = cfg["copy"][lang]
        html = tpl
        if not show_impact:
            html = re.sub(r"<!--IMPACT-->.*?<!--/IMPACT-->", "", html, flags=re.S)
            html = re.sub(r"<!--IMPACT_NAV-->.*?<!--/IMPACT_NAV-->", "", html, flags=re.S)
        else:
            html = html.replace("<!--IMPACT-->", "").replace("<!--/IMPACT-->", "").replace("<!--IMPACT_NAV-->", "").replace("<!--/IMPACT_NAV-->", "")
        html = bake_copy(html, copy)
        other = "en" if lang == "tr" else "tr"
        switch = ('<a href="%s" hreflang="tr" lang="tr"%s>TR</a><a href="%s" hreflang="en" lang="en"%s>EN</a>' % (
            p["prefix"], ' class="is-active"' if lang == "tr" else "",
            p["prefix"] + "en/", ' class="is-active"' if lang == "en" else ""))
        rep = {
            "{{LANG}}": lang, "{{TITLE}}": p["title"], "{{DESC}}": p["desc"], "{{CANON}}": p["canon"],
            "{{OG_TITLE}}": p["og_title"], "{{OG_DESC}}": p["og_desc"], "{{OG_LOCALE}}": p["og_locale"],
            "{{P}}": p["prefix"], "{{HOME_SUFFIX}}": p["home_suffix"], "{{LANG_SWITCH}}": switch,
            "{{JSONLD}}": jsonld(lang, copy, cfg, p["canon"]),
            "{{QUOTES}}": quotes_html(cfg["testimonials"].get(lang) or cfg["testimonials"]["en"]),
            "{{PRIVACY_HREF}}": p["privacy"], "{{OTHER_HREF}}": p["other_href"], "{{OTHER_LABEL}}": p["other_label"],
        }
        for k, v in p["alts"].items():
            rep["{{ALT_%s}}" % k] = v
        for k, v in rep.items():
            html = html.replace(k, v)
        leftover = re.findall(r"{{\w+}}", html)
        if leftover:
            sys.exit("unfilled placeholders in %s: %s" % (p["out"], sorted(set(leftover))))
        out = os.path.join(ROOT, p["out"])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        io.open(out, "w", encoding="utf-8", newline="\n").write(html)
        print("wrote", p["out"], len(html), "bytes")

if __name__ == "__main__":
    build()
