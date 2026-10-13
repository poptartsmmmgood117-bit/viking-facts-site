// Shared engine for the fact pages. Each page defines window.PAGE before loading this.
(function () {
  const P = window.PAGE;
  const $ = (s) => document.querySelector(s);

  // ---- Random fact box ----
  const factText = $("#fact-text");
  let lastFact = -1;
  function nextFact() {
    let i;
    do { i = Math.floor(Math.random() * P.facts.length); } while (i === lastFact && P.facts.length > 1);
    lastFact = i;
    factText.textContent = P.facts[i];
    factText.classList.remove("pop");
    void factText.offsetWidth;
    factText.classList.add("pop");
  }
  if (factText) {
    nextFact();
    $("#fact-btn").addEventListener("click", nextFact);
  }

  // ---- Cards with search + filters ----
  const grid = $("#grid");
  const search = $("#search");
  const filters = {};
  const maxSize = Math.max(...P.items.map((d) => d.size || 0));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const bar = e.target.querySelector(".bar > div");
      if (bar) bar.style.width = bar.dataset.w;
      io.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  function matches(item) {
    const q = (search.value || "").trim().toLowerCase();
    if (q && !(item.name + " " + item.fact + " " + (item.tags || []).join(" ")).toLowerCase().includes(q)) return false;
    return Object.entries(filters).every(([, v]) => v === "All" || item.tags.includes(v));
  }

  function render() {
    grid.innerHTML = "";
    const list = P.items.filter(matches);
    if (!list.length) {
      grid.innerHTML = `<p class="empty">${P.emptyText}</p>`;
      return;
    }
    list.forEach((item, idx) => {
      const el = document.createElement("article");
      el.className = "card";
      el.tabIndex = 0;
      el.style.transitionDelay = Math.min(idx * 30, 300) + "ms";
      const sizeRow = item.size
        ? `<div class="size-row"><small>${P.sizeLabel(item)}</small><div class="bar"><div data-w="${Math.max(4, (item.size / maxSize) * 100)}%"></div></div></div>`
        : "";
      const no = String(P.items.indexOf(item) + 1).padStart(2, "0");
      el.innerHTML = `
        <span class="no">No. ${no}</span>
        <h3>${item.name}</h3>
        ${item.meaning ? `<p class="meaning">“${item.meaning}”</p>` : ""}
        <div class="tags">${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <p class="fact">${item.fact}</p>
        ${sizeRow}
        <div class="more">Read more →</div>`;
      el.addEventListener("click", () => openModal(item));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(item); } });
      grid.appendChild(el);
      io.observe(el);
    });
  }

  if (grid) {
    // Build filter chip groups
    const controls = $("#controls");
    P.filterGroups.forEach((group) => {
      filters[group.name] = "All";
      ["All", ...group.values].forEach((v) => {
        const b = document.createElement("button");
        b.className = "chip" + (v === "All" ? " on" : "");
        b.textContent = v === "All" ? `All ${group.name.toLowerCase()}` : v;
        b.dataset.group = group.name;
        b.addEventListener("click", () => {
          filters[group.name] = v;
          controls.querySelectorAll(`.chip[data-group="${group.name}"]`).forEach((c) => c.classList.toggle("on", c === b));
          render();
        });
        controls.appendChild(b);
      });
    });
    search.addEventListener("input", render);
    render();
    const count = $("#item-count");
    if (count) count.textContent = P.items.length;
  }

  // ---- Modal ----
  const modal = $("#modal");
  function openModal(item) {
    $("#modal-body").innerHTML = `
      ${item.stats ? `<div class="stats-line">${item.stats}</div>` : ""}
      <h3>${item.name}</h3>
      ${item.meaning ? `<p class="meaning">“${item.meaning}”</p>` : ""}
      <div class="tags">${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <p>${item.fact}</p>
      ${item.extra ? `<ul>${item.extra.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}`;
    modal.classList.add("open");
    $("#modal .close").focus();
  }
  function closeModal() { modal.classList.remove("open"); }
  if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    $("#modal .close").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  // ---- Quiz ----
  const quiz = $("#quiz");
  if (quiz && P.quiz) {
    let qi = 0, score = 0;
    const order = [...P.quiz].sort(() => Math.random() - 0.5);
    function showQ() {
      if (qi >= order.length) {
        quiz.innerHTML = `<p class="score">Final score</p><p class="q">${score} / ${order.length}. ${score === order.length ? P.quizPerfect : P.quizDone}</p>
          <button class="btn" id="quiz-again">Play again</button>`;
        $("#quiz-again").addEventListener("click", () => { qi = 0; score = 0; order.sort(() => Math.random() - 0.5); showQ(); });
        return;
      }
      const q = order[qi];
      quiz.innerHTML = `<p class="score">Question ${qi + 1} of ${order.length} · Score: ${score}</p>
        <p class="q">${q.q}</p><div class="opts"></div><p class="feedback"></p>`;
      const opts = quiz.querySelector(".opts");
      q.options.forEach((o, i) => {
        const b = document.createElement("button");
        b.textContent = o;
        b.addEventListener("click", () => {
          opts.querySelectorAll("button").forEach((x, j) => {
            x.disabled = true;
            if (j === q.answer) x.classList.add("right");
          });
          const fb = quiz.querySelector(".feedback");
          if (i === q.answer) { score++; fb.textContent = "Correct. " + q.why; }
          else { b.classList.add("wrong"); fb.textContent = "Wrong. " + q.why; }
          const next = document.createElement("button");
          next.className = "btn";
          next.textContent = qi + 1 < order.length ? "Next question →" : "See my score";
          next.addEventListener("click", () => { qi++; showQ(); });
          quiz.appendChild(next);
        });
        opts.appendChild(b);
      });
    }
    showQ();
  }

  // ---- Reveal on scroll ----
  const rio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => rio.observe(el));
})();
