// Rune translator: any text -> runes, and English -> Old Norse (word-by-word) -> runes.
(function () {
  const $ = (s) => document.querySelector(s);

  // ---- Rune alphabets ----
  // Younger Futhark (long-branch), the 16-rune alphabet of the Viking Age.
  const YOUNGER = {
    a: "ᛅ", á: "ᛅ", æ: "ᛅ", b: "ᛒ", p: "ᛒ", c: "ᚴ", k: "ᚴ", g: "ᚴ", q: "ᚴ", d: "ᛏ", t: "ᛏ",
    e: "ᛁ", é: "ᛁ", i: "ᛁ", í: "ᛁ", j: "ᛁ", f: "ᚠ", h: "ᚼ", l: "ᛚ", m: "ᛘ", n: "ᚾ",
    o: "ᚬ", ó: "ᚬ", ö: "ᚬ", ǫ: "ᚬ", r: "ᚱ", s: "ᛋ", z: "ᛋ", u: "ᚢ", ú: "ᚢ", v: "ᚢ", w: "ᚢ",
    y: "ᚢ", ý: "ᚢ", ø: "ᚢ", œ: "ᚢ", þ: "ᚦ", ð: "ᚦ", x: "ᚴᛋ",
  };
  // Elder Futhark, the older 24-rune alphabet (roughly AD 150–750).
  const ELDER = {
    a: "ᚨ", á: "ᚨ", æ: "ᚨ", b: "ᛒ", c: "ᚲ", k: "ᚲ", q: "ᚲ", d: "ᛞ", e: "ᛖ", é: "ᛖ", f: "ᚠ", g: "ᚷ",
    h: "ᚺ", i: "ᛁ", í: "ᛁ", y: "ᛁ", ý: "ᛁ", j: "ᛃ", l: "ᛚ", m: "ᛗ", n: "ᚾ", o: "ᛟ", ó: "ᛟ", ö: "ᛟ",
    ø: "ᛟ", œ: "ᛟ", p: "ᛈ", r: "ᚱ", s: "ᛊ", t: "ᛏ", u: "ᚢ", ú: "ᚢ", v: "ᚹ", w: "ᚹ", x: "ᚲᛊ",
    z: "ᛉ", þ: "ᚦ", ð: "ᚦ",
  };
  const SEP = " ᛫ ";

  function wordToRunes(word, set, norse) {
    const map = set === "elder" ? ELDER : YOUNGER;
    let w = word.toLowerCase().replace(/th/g, "þ");
    if (set === "elder") w = w.replace(/ng/g, "ŋ");
    let out = "", prev = "";
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      let r;
      if (ch === "ŋ") r = "ᛜ";
      // Old Norse nominative -r after a consonant was carved with the yr rune.
      else if (set === "younger" && norse && ch === "r" && i === w.length - 1 && i > 0 && !"aáeéiíoóöuúyýæøœ".includes(w[i - 1])) r = "ᛦ";
      else r = map[ch];
      if (!r) continue;
      // Rune carvers wrote double letters only once.
      if (r !== prev) out += r;
      prev = r;
    }
    return out;
  }
  function textToRunes(text, set, norse) {
    return text.split(/\s+/).map((w) => wordToRunes(w, set, norse)).filter(Boolean).join(SEP);
  }

  // ---- English -> Old Norse glossary (normalised Old Norse spellings) ----
  const G = {
    i: "ek", me: "mik", my: "minn", mine: "minn", you: "þú", your: "þinn", he: "hann", him: "hann", his: "hans",
    she: "hon", her: "hon", we: "vér", us: "oss", our: "várr", they: "þeir", them: "þeim", it: "þat", this: "þetta", that: "þat",
    am: "em", is: "er", are: "eru", was: "var", be: "vera", shall: "skal", will: "mun", can: "kann",
    and: "ok", or: "eða", but: "en", not: "eigi", no: "nei", yes: "já", of: "af", in: "í", on: "á", to: "til",
    with: "með", from: "frá", for: "fyrir", at: "at", over: "yfir", under: "undir",
    hello: "heill", hail: "heill", farewell: "far vel", goodbye: "far vel", cheers: "skál", thanks: "þökk", thank: "þökk",
    here: "hér", there: "þar", now: "nú", then: "þá", what: "hvat", who: "hverr", where: "hvar", why: "hví",
    all: "allr", many: "margr", more: "meira", never: "aldri", forever: "æ", always: "ávallt", again: "aftr",
    go: "fara", come: "koma", see: "sjá", know: "vita", fight: "berjask", die: "deyja", dies: "deyr", live: "lifa",
    kill: "drepa", eat: "eta", drink: "drekka", sleep: "sofa", sail: "sigla", run: "renna", fly: "fljúga", give: "gefa",
    take: "taka", speak: "mæla", say: "segja", hear: "heyra", sing: "syngja", win: "vinna", rule: "ráða",
    defend: "verja", protect: "verja", carve: "rísta", build: "byggja", hunt: "veiða", raid: "herja",
    love: "ást", hate: "hatr", name: "nafn", word: "orð", song: "ljóð", poem: "kvæði", story: "saga", saga: "saga",
    heart: "hjarta", hand: "hönd", eye: "auga", head: "höfuð", bone: "bein", tooth: "tönn", beard: "skegg", hair: "hár",
    blood: "blóð", soul: "sál", mind: "hugr", strength: "afl", power: "máttr", honor: "heiðr", honour: "heiðr",
    glory: "frægð", fame: "orðstírr", fate: "örlög", destiny: "örlög", luck: "gæfa", victory: "sigr",
    battle: "orrusta", war: "ófriðr", peace: "friðr", death: "dauði", life: "líf", fire: "eldr", water: "vatn",
    ice: "íss", snow: "snjór", sun: "sól", moon: "máni", star: "stjarna", sky: "himinn", earth: "jörð", world: "heimr",
    house: "hús", hall: "höll", mountain: "fjall", tree: "tré", forest: "skógr", stone: "steinn", rune: "rún", runes: "rúnar",
    gold: "gull", silver: "silfr", iron: "járn", night: "nótt", day: "dagr", winter: "vetr", summer: "sumar",
    wind: "vindr", rain: "regn", light: "ljós", dark: "myrkr", darkness: "myrkr", sea: "haf", ocean: "haf",
    ship: "skip", ships: "skip", boat: "bátr", sword: "sverð", axe: "øx", shield: "skjöldr", spear: "spjót",
    helmet: "hjálmr", bow: "bogi", arrow: "ör", hammer: "hamarr", ring: "hringr",
    king: "konungr", queen: "dróttning", jarl: "jarl", earl: "jarl", god: "guð", gods: "goð", man: "maðr", men: "menn",
    woman: "kona", women: "konur", child: "barn", children: "börn", warrior: "hermaðr", warriors: "hermenn",
    friend: "vinr", friends: "vinir", enemy: "óvinr", enemies: "óvinir", brother: "bróðir", sister: "systir",
    father: "faðir", mother: "móðir", son: "sonr", daughter: "dóttir", wife: "kona", husband: "bóndi", family: "ætt",
    kin: "frændr", kinsmen: "frændr", home: "heimili", farm: "bú", cattle: "fé", wealth: "fé", law: "lög", land: "land",
    oath: "eiðr", gift: "gjöf", feast: "veizla", ale: "öl", beer: "bjórr", mead: "mjöðr", bread: "brauð", meat: "kjöt",
    hero: "hetja", giant: "jötunn", troll: "troll", elf: "álfr", dwarf: "dvergr",
    wolf: "úlfr", wolves: "úlfar", raven: "hrafn", ravens: "hrafnar", horse: "hestr", dog: "hundr", cat: "köttr",
    snake: "ormr", serpent: "ormr", dragon: "dreki", fish: "fiskr", bear: "björn", eagle: "örn", boar: "göltr",
    goat: "geit", cow: "kýr",
    strong: "sterkr", brave: "hraustr", fierce: "grimmr", wise: "vitr", free: "frjáls", true: "sannr", great: "mikill",
    big: "stórr", small: "lítill", old: "gamall", young: "ungr", good: "góðr", evil: "illr", bad: "illr", dead: "dauðr",
    alive: "kvikr", red: "rauðr", black: "svartr", white: "hvítr", green: "grænn", blue: "blár", grey: "grár", gray: "grár",
    golden: "gullinn",
    one: "einn", two: "tveir", three: "þrír", four: "fjórir", five: "fimm", nine: "níu", ten: "tíu",
    north: "norðr", south: "suðr", east: "austr", west: "vestr", island: "ey", shore: "strönd", fjord: "fjörðr",
    river: "á", lake: "vatn", field: "völlr", road: "vegr", way: "vegr",
    viking: "víkingr", vikings: "víkingar", valhalla: "Valhöll", asgard: "Ásgarðr", midgard: "Miðgarðr",
    odin: "Óðinn", thor: "Þórr", loki: "Loki", freya: "Freyja", freyja: "Freyja", tyr: "Týr", frigg: "Frigg",
    baldur: "Baldr", balder: "Baldr", norway: "Nóregr", iceland: "Ísland", denmark: "Danmörk", sweden: "Svíþjóð",
    england: "England", greenland: "Grænland", vinland: "Vínland",
  };
  const SKIP = new Set(["the", "a", "an"]);

  function translate(text) {
    const words = text.toLowerCase().replace(/[’']/g, "").split(/[^a-zà-ÿþðæøœǫ]+/i).filter(Boolean);
    return words.filter((w) => !SKIP.has(w)).map((w) => {
      if (G[w]) return { en: w, on: G[w] };
      if (w.endsWith("s") && G[w.slice(0, -1)]) return { en: w, on: G[w.slice(0, -1)] };
      return { en: w, on: null };
    });
  }

  // ---- UI ----
  let mode = "runes", set = "younger";
  const input = $("#rune-input"), out = $("#rune-out");

  function render() {
    const text = input.value.trim();
    if (!text) { out.innerHTML = `<div class="translit">Type something above.</div>`; return; }
    if (mode === "runes") {
      out.innerHTML = `<div class="runes">${textToRunes(text, set, false)}</div>
        <div class="translit">${escape(text)} · ${set === "younger" ? "Younger Futhark (Viking Age, 16 runes)" : "Elder Futhark (pre-Viking, 24 runes)"}</div>`;
    } else {
      const parts = translate(text);
      const norse = parts.map((p) => p.on || `[${p.en}]`).join(" ");
      const runeSrc = parts.map((p) => p.on || p.en).join(" ");
      out.innerHTML = `<div class="norse-line">${escape(norse)}</div>
        <div class="runes">${textToRunes(runeSrc, set, true)}</div>
        <div class="gloss">${parts.map((p) => p.on
          ? `<span>${escape(p.en)} → <b>${escape(p.on)}</b></span>`
          : `<span class="miss">${escape(p.en)} → no entry, spelled out</span>`).join("")}</div>`;
    }
  }
  function escape(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("on", x === b));
    $("#rune-label").textContent = mode === "runes" ? "Your name or any text" : "English words or a short phrase";
    $("#mode-note").textContent = mode === "runes"
      ? "Runes were written by sound, so your name is spelled the way it sounds. Double letters are carved once, as Viking rune carvers did."
      : "This is a word-by-word glossary, not full grammar. Old Norse had cases and verb endings this doesn't attempt. Words with no entry get spelled out in runes. A word-final -r after a consonant is carved with ᛦ (yr), as on real rune stones.";
    if (!input.value.trim()) input.value = mode === "runes" ? "Astrid" : "The wolf and the raven";
    render();
  }));
  document.querySelectorAll("[data-set]").forEach((b) => b.addEventListener("click", () => {
    set = b.dataset.set;
    document.querySelectorAll("[data-set]").forEach((x) => x.classList.toggle("on", x === b));
    render();
  }));
  input.addEventListener("input", render);
  $("#rune-copy").addEventListener("click", () => {
    const r = out.querySelector(".runes");
    if (!r || !navigator.clipboard) return;
    navigator.clipboard.writeText(r.textContent).then(() => {
      $("#rune-copy").textContent = "Copied";
      setTimeout(() => ($("#rune-copy").textContent = "Copy runes"), 1400);
    }, () => {});
  });

  // Famous lines in Old Norse
  const PHRASES = [
    { on: "Deyr fé, deyja frændr", en: "Cattle die, kinsmen die. (Hávamál 76)" },
    { on: "Orðstírr deyr aldregi", en: "Fame never dies. (Hávamál 76)" },
    { on: "Með lögum skal land byggja", en: "With law shall the land be built. (Njáls saga)" },
    { on: "Heill þú farir", en: "Hail to you as you go. (Vafþrúðnismál)" },
    { on: "Bú er betra, þótt lítit sé", en: "A home is better, though it be small. (Hávamál 36)" },
    { on: "Skál", en: "Cheers! Literally 'bowl'." },
  ];
  $("#phrases").innerHTML = PHRASES.map((p, i) =>
    `<div class="phrase" data-i="${i}" tabindex="0"><div class="on-text">${p.on}</div><div class="en">${p.en}</div></div>`).join("");
  document.querySelectorAll(".phrase").forEach((el) => {
    const show = () => {
      const p = PHRASES[el.dataset.i];
      out.innerHTML = `<div class="norse-line">${p.on}</div><div class="runes">${textToRunes(p.on.replace(/[,.]/g, ""), set, true)}</div><div class="translit">${p.en}</div>`;
      out.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    el.addEventListener("click", show);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") show(); });
  });

  // Younger Futhark reference
  const ALPHA = [
    ["ᚠ", "fé", "wealth"], ["ᚢ", "úr", "drizzle"], ["ᚦ", "þurs", "giant"], ["ᚬ", "áss", "god"],
    ["ᚱ", "reið", "ride"], ["ᚴ", "kaun", "ulcer"], ["ᚼ", "hagall", "hail"], ["ᚾ", "nauðr", "need"],
    ["ᛁ", "íss", "ice"], ["ᛅ", "ár", "plenty"], ["ᛋ", "sól", "sun"], ["ᛏ", "Týr", "the god Týr"],
    ["ᛒ", "bjarkan", "birch"], ["ᛘ", "maðr", "man"], ["ᛚ", "lögr", "water"], ["ᛦ", "ýr", "yew"],
  ];
  $("#alphabet").innerHTML = ALPHA.map(([r, n, m]) => `<div><div class="r">${r}</div><div class="n">${n}</div><div class="m">${m}</div></div>`).join("");

  input.value = "Astrid";
  render();
})();
