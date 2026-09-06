"""Zero-token mechanical gate for WBT gold pages.
Runs BEFORE any LLM verifier. A page that fails here must never consume verifier tokens.
Usage: python mech_check.py <content_beaches_root> <slug> [slug...]
"""
import json, os, re, sys, unicodedata
try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: pass

HERO   = {"MONUMENT","SPIKE","LAYERED","ABSENCE"}
PAIR   = {"CLASSICAL","AUSTERE","VERNACULAR"}
VOICE  = {"CLINICAL","REVERENT","ROMANTIC","SEVERE","WRY"}
LENSES = {"travel","surf","environment","family","photography","diving","history","sand","culture"}
AUDIENCE = {"geology","history","safety","nature","local","culture","surf","economy"}
REFTYPE  = {"film","tv","music","literature","historic","brand","other"}
BIZCAT   = {"restaurant","hotel","bar","museum","kiosk","market","rental"}
SHOWCASE_KEYS = {"intro_text","spike_explainer","honest_reckoning_note","reckoning_pullquote",
  "key_facts","margin_notes","day_in_time","food_drink","timeline","zones","landmarks",
  "cultural_refs","recurring_events","businesses","things_to_know","access_note"}
BANNED = ["stunning","breathtaking","pristine","nestled","gem","paradise","must-visit",
          "hidden gem","picturesque","idyllic","crystal-clear","postcard-perfect","unspoiled"]
# Homoglyph detection: ONLY codepoints that are VISUALLY IDENTICAL to a Latin
# letter, appearing inside an otherwise-Latin word. This is the real bug class
# (Cyrillic vowels substituted into Latin place names: Zrce, Gwangalli).
# Deliberately NOT flagged: pure Greek/Cyrillic runs (a real Greek place name),
# and linguistic notation whose glyphs are not Latin lookalikes (Proto-Slavic *ezu
# uses the Cyrillic hard sign by scholarly convention).
CONFUSABLE = {
    "а":"a","е":"e","о":"o","р":"p","с":"c","х":"x",
    "у":"y","і":"i","ј":"j","һ":"h",
    "А":"A","Е":"E","О":"O","Р":"P","С":"C","Х":"X",
    "М":"M","Н":"H","Т":"T","К":"K","В":"B",
    "Α":"A","Ε":"E","Ο":"O","Ρ":"P","Χ":"X","Ι":"I",
    "Μ":"M","Ν":"N","Τ":"T","Κ":"K","Β":"B","Η":"H",
    "ο":"o","α":"a","ε":"e","ρ":"p","υ":"u",
}
LATIN = re.compile(r"[A-Za-z]")
WORD  = re.compile(r"[^\W\d_]+", re.UNICODE)

def homoglyph_tokens(text):
    bad = {}
    for m in WORD.finditer(text):
        w = m.group()
        if not LATIN.search(w):
            continue                      # pure non-Latin run = legitimate
        hits = {ch for ch in w if ch in CONFUSABLE}
        if hits:
            fixed = "".join(CONFUSABLE.get(ch, ch) for ch in w)
            bad[w] = fixed
    return sorted(f"{k!r} -> should be {v!r}" for k, v in bad.items())

QUOTED = re.compile(
    '\\\\?"[^"\\n]{1,200}\\\\?"'      # straight quotes, incl. JSON-escaped \"
    "|\u201c[^\u201d\\n]{1,200}\u201d"     # curly double quotes
    "|\u2018[^\u2019\\n]{1,200}\u2019"     # curly single quotes
)


def strip_quoted(text):
    """Remove quoted spans before scanning for banned vocabulary.

    A page is ALLOWED to quote brochure language in order to criticise it --
    that is the honest-reckoning voice the spec asks for. Flagging
    'more honest than "crystal-clear water"' is a false positive, and a gate
    with false positives burns exactly the verifier tokens it exists to save.
    """
    return QUOTED.sub(" ", text.replace('\\\\"', '"'))



def words(s): return len(re.findall(r"\S+", s or ""))

def check(root, slug):
    d = os.path.join(root, slug); errs=[]; warns=[]
    def E(m): errs.append(m)
    def W(m): warns.append(m)
    cp = os.path.join(d,"composition.json"); sp = os.path.join(d,"showcase.json")
    if not os.path.exists(cp): return ["composition.json MISSING"], []
    if not os.path.exists(sp): return ["showcase.json MISSING"], []
    try: c = json.load(open(cp,encoding="utf-8"))
    except Exception as e: return [f"composition.json INVALID JSON: {e}"], []
    try: s = json.load(open(sp,encoding="utf-8"))
    except Exception as e: return [f"showcase.json INVALID JSON: {e}"], []

    if c.get("slug") != slug: E(f"slug mismatch: {c.get('slug')!r} != dir {slug!r}")
    if c.get("version") != "0.9": E(f"version {c.get('version')!r} != '0.9'")
    if c.get("tier") not in (1,2): E(f"tier {c.get('tier')!r} not 1|2")
    if c.get("byline") != "Written by Erin Rose": E(f"byline {c.get('byline')!r}")
    sk = (c.get("spike_statement") or "")
    if not sk: E("spike_statement empty")
    elif len(sk) > 160: E(f"spike_statement {len(sk)} chars > 160")
    elif not sk.rstrip().endswith("."): W("spike_statement does not end with a period")
    lv = c.get("levers") or {}
    if lv.get("hero_type") not in HERO: E(f"hero_type {lv.get('hero_type')!r}")
    if lv.get("display_pairing") not in PAIR: E(f"display_pairing {lv.get('display_pairing')!r}")
    if lv.get("voice_register") not in VOICE: E(f"voice_register {lv.get('voice_register')!r}")
    for ck in ("primary_color","supporting_color"):
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", str(lv.get(ck) or "")): E(f"{ck} {lv.get(ck)!r} not #rrggbb")
    extra = set(lv) - {"primary_color","supporting_color","hero_type","display_pairing","voice_register","photo_tone"}
    if extra: E(f"stray levers keys: {sorted(extra)}")
    if len(c.get("sections") or []) < 15: E(f"sections {len(c.get('sections') or [])} < 15")

    for spk in (c.get("spokes") or []):
        if spk.get("slug") not in LENSES: E(f"spoke slug {spk.get('slug')!r} not a valid lens -> route 404s")
        if not os.path.exists(os.path.join(d, f"{spk.get('slug')}.mdx")): E(f"spoke mdx missing: {spk.get('slug')}.mdx")

    missing = SHOWCASE_KEYS - set(s); 
    if missing: E(f"showcase missing keys: {sorted(missing)}")
    stray = set(s) - SHOWCASE_KEYS
    if stray: W(f"showcase stray keys: {sorted(stray)}")
    tier = c.get("tier"); need = 800 if tier == 1 else 700
    w = words(s.get("spike_explainer"))
    if w < need: E(f"spike_explainer {w} words < {need}")
    il = len(s.get("intro_text") or "")
    if not (1500 <= il <= 3000): W(f"intro_text {il} chars outside 1800-2400 guidance")
    for k, lo in (("key_facts",6),("margin_notes",5),("timeline",6),("zones",3),("landmarks",2),
                  ("cultural_refs",3),("things_to_know",3),("food_drink",3)):
        n = len(s.get(k) or [])
        if n < lo: W(f"{k} has {n} (spec floor {lo})")
    paras = len((s.get("intro_text") or "").split("\n\n"))
    for m in (s.get("margin_notes") or []):
        if m.get("audience") not in AUDIENCE: E(f"margin_note audience {m.get('audience')!r}")
        ai = m.get("anchor_para_index")
        if not isinstance(ai,int) or ai < 0 or ai >= paras: E(f"margin_note anchor_para_index {ai} out of range (0..{paras-1})")
    for r in (s.get("cultural_refs") or []):
        if r.get("ref_type") not in REFTYPE: E(f"cultural_ref ref_type {r.get('ref_type')!r}")
    for b in (s.get("businesses") or []):
        if b.get("category") not in BIZCAT: E(f"business category {b.get('category')!r}")
    dt = s.get("day_in_time") or {}
    if set(dt) != {"dawn","midday","golden","night"}: E(f"day_in_time keys {sorted(dt)}")

    # prose scans across every authored surface
    blob = json.dumps(s, ensure_ascii=False)
    for f in os.listdir(d):
        if f.endswith(".mdx"): blob += open(os.path.join(d,f),encoding="utf-8",errors="replace").read()
    low = strip_quoted(blob).lower()
    hits = sorted({b for b in BANNED if re.search(r"\b"+re.escape(b)+r"\b", low)})
    if hits: E(f"banned brochure words: {hits}")
    hg = homoglyph_tokens(blob)
    if hg: E(f"homoglyphs inside Latin words: {hg}")
    return errs, warns

if __name__ == "__main__":
    root = sys.argv[1]; slugs = sys.argv[2:]
    npass = 0
    for slug in slugs:
        e, w = check(root, slug)
        status = "PASS" if not e else "FAIL"
        npass += not e
        print(f"[{status}] {slug}")
        for m in e: print(f"    ERR  {m}")
        for m in w: print(f"    warn {m}")
    print(f"\nMECH GATE: {npass}/{len(slugs)} pass")
