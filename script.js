// Só dígitos, com DDI+DDD. Se ficar vazio, os botões levam à seção "A loja".
const WHATSAPP_NUMBER = "5551982800889";
const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Óticas Popular Santos e quero saber mais.";

function waUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function setWhatsApp(a, message = WHATSAPP_MESSAGE) {
  if (!WHATSAPP_NUMBER) return;
  a.href = waUrl(message);
  a.target = "_blank";
  a.rel = "noopener";
}
document.querySelectorAll("[data-wa]").forEach((a) => setWhatsApp(a));

const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
const fab = document.querySelector(".fab");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  updateFab();
}

menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") && !e.target.closest(".header")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
});
window.matchMedia("(min-width: 1021px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

/* O botão flutuante some onde já existe um botão de WhatsApp (hero, serviços, catálogo, rodapé)
   e enquanto o menu está aberto, para não cobrir conteúdo. */
const fabBlockers = new Set();
function updateFab() {
  fab.classList.toggle("is-hidden", fabBlockers.size > 0 || nav.classList.contains("is-open"));
}
if ("IntersectionObserver" in window) {
  const fabIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? fabBlockers.add(e.target) : fabBlockers.delete(e.target)));
    updateFab();
  }, { rootMargin: "-10% 0px -10% 0px" });
  document.querySelectorAll("[data-hide-fab]").forEach((el) => fabIo.observe(el));
} else {
  updateFab();
}

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Entrada suave das imagens ---------- */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" })
  : null;
function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.in-view)").forEach((el) => (io ? io.observe(el) : el.classList.add("in-view")));
}
observeReveals();

/* ---------- Catálogo ----------
   Armações (cat "grau") são de EXEMPLO: troque por produtos reais com nome, cores e,
   quando houver, `price` (ex.: "R$ 129") e `img` (caminho da foto).
   Lentes (cat "lentes") seguem o catálogo da loja. */
const PRODUCTS = [
  { name: "bento", cat: "grau", shape: "rect",  colors: ["#1E1512", "#44546A", "#8A6A4A"] },
  { name: "maya",  cat: "grau", shape: "round", colors: ["#C98A2B", "#1E1512", "#B9B9B9"] },
  { name: "vera",  cat: "grau", shape: "wing",  colors: ["#8F1712", "#1E1512", "#C9B38A"] },
  { name: "Smart",  cat: "lentes", shape: "lens", sub: "Lente multifocal Haytek", full: "Lente Multifocal Haytek Smart",  badge: "Haytek", colors: [] },
  { name: "Pro ID", cat: "lentes", shape: "lens", sub: "Lente multifocal Haytek", full: "Lente Multifocal Haytek Pro ID", badge: "Haytek", colors: [] },
  { name: "Top",    cat: "lentes", shape: "lens", sub: "Lente multifocal Haytek", full: "Lente Multifocal Haytek Top",    badge: "Haytek", colors: [] },
  { name: "Light",  cat: "lentes", shape: "lens", sub: "Lente multifocal Haytek", full: "Lente Multifocal Haytek Light",  badge: "Haytek", colors: [] },
];

const SHAPES = {
  round: { l: '<circle cx="62" cy="50" r="34"/>', r: '<circle cx="158" cy="50" r="34"/>', bridge: "M96 46 Q110 36 124 46" },
  rect:  { l: '<rect x="26" y="22" width="68" height="52" rx="14"/>', r: '<rect x="126" y="22" width="68" height="52" rx="14"/>', bridge: "M94 40 Q110 32 126 40" },
  cat:   { l: '<path d="M24 34 Q50 18 92 34 Q98 66 70 74 Q34 78 24 34Z"/>', r: '<path d="M196 34 Q170 18 128 34 Q122 66 150 74 Q186 78 196 34Z"/>', bridge: "M92 40 Q110 32 128 40" },
  wing:  { l: '<path d="M18 36 Q60 24 96 40 Q96 70 66 70 Q26 70 18 36Z"/>', r: '<path d="M202 36 Q160 24 124 40 Q124 70 154 70 Q194 70 202 36Z"/>', bridge: "M96 42 Q110 34 124 42" },
};

function lensSVG(label) {
  return `<svg viewBox="0 0 220 100" role="img" aria-label="${label}"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9ECFA"/><stop offset="1" stop-color="#8FC0E8"/></linearGradient></defs><ellipse cx="110" cy="50" rx="60" ry="44" fill="url(#lg)" stroke="#2D6FD0" stroke-width="4"/><path d="M92 18 Q110 14 128 18 L122 54 Q110 82 98 54 Z" fill="#fff" fill-opacity=".45"/><path d="M70 30 Q82 14 104 10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>`;
}

function frameSVG(shape, color, label) {
  if (shape === "lens") return lensSVG(label);
  const s = SHAPES[shape];
  return `<svg viewBox="0 0 220 100" role="img" aria-label="${label}" fill="rgba(120,150,170,.28)" stroke="${color}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">${s.l}${s.r}<path d="${s.bridge}" fill="none"/><path d="M12 38 L4 30 M208 38 L216 30" fill="none"/></svg>`;
}

const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.700 4 4.500 7.300 4.500c2 0 3.600 1.100 4.700 2.800 1.100-1.700 2.700-2.800 4.700-2.800 3.300 0 5.700 3.200 4.500 6.700-1.700 4.700-9.200 9.300-9.200 9.300Z"/></svg>';

let favs = new Set();
try { favs = new Set(JSON.parse(localStorage.getItem("favs") || "[]")); } catch {}
const saveFavs = () => { try { localStorage.setItem("favs", JSON.stringify([...favs])); } catch {} };

const list = document.getElementById("products");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const chips = document.querySelectorAll(".chip");
let filter = "todos";

function render() {
  const items = PRODUCTS.filter((p) => filter === "todos" || (filter === "fav" ? favs.has(p.name) : p.cat === filter));
  list.innerHTML = items.map((p, i) => `
    <li class="product" data-name="${p.name}">
      <div class="product__media reveal" style="--d:${(i % 4) * 90}ms">
        ${p.img ? `<img src="${p.img}" alt="${p.full || "Armação " + p.name}">` : frameSVG(p.shape, p.colors[0], `${p.full || "Armação " + p.name} (ilustração)`)}
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button type="button" class="fav" aria-pressed="${favs.has(p.name)}" aria-label="Favoritar ${p.name}">${HEART}</button>
        <a class="add" data-model="${p.full || p.name}" href="#loja" aria-label="Perguntar sobre ${p.full || p.name} no WhatsApp">+</a>
      </div>
      <div class="product__row"><h3 class="product__name">${p.name}</h3><span class="product__price">${p.price || "consulte o valor"}</span></div>
      ${p.sub ? `<p class="product__sub">${p.sub}</p>` : ""}
      ${p.colors.length ? `<div class="swatches" role="group" aria-label="Cores de ${p.name}">
        ${p.colors.map((c, i) => `<button type="button" class="swatch" style="background:${c}" data-color="${c}" aria-pressed="${i === 0}" aria-label="Cor ${i + 1}"></button>`).join("")}
      </div>` : ""}
    </li>`).join("");
  list.querySelectorAll(".add").forEach((a) => setWhatsApp(a, `Olá! Tenho interesse em "${a.dataset.model}" que vi no site da Óticas Popular Santos.`));
  observeReveals(list);
  emptyEl.hidden = items.length > 0;
  countEl.textContent = items.length ? `${items.length} ${items.length === 1 ? "modelo" : "modelos"}` : "";
}

chips.forEach((chip) => chip.addEventListener("click", () => {
  filter = chip.dataset.filter;
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
  render();
}));

list.addEventListener("click", (e) => {
  const li = e.target.closest(".product");
  if (!li) return;
  const name = li.dataset.name;
  const favBtn = e.target.closest(".fav");
  const sw = e.target.closest(".swatch");
  if (favBtn) {
    favs.has(name) ? favs.delete(name) : favs.add(name);
    saveFavs();
    if (filter === "fav") render(); else favBtn.setAttribute("aria-pressed", String(favs.has(name)));
  } else if (sw) {
    li.querySelectorAll(".swatch").forEach((s) => s.setAttribute("aria-pressed", String(s === sw)));
    const svg = li.querySelector(".product__media > svg");
    if (svg) svg.setAttribute("stroke", sw.dataset.color);
  }
});

render();

/* ---------- Aberto agora ---------- */
// Horário de funcionamento (0 = domingo). Feriados não são considerados.
const HOURS = { 0: null, 1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19], 6: [9, 18] };
const DAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function storeStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(now).reduce((o, p) => ((o[p.type] = p.value), o), {});
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const minutes = +parts.hour * 60 + +parts.minute;
  const today = HOURS[day];
  if (today && minutes >= today[0] * 60 && minutes < today[1] * 60) {
    return { open: true, text: `Aberto agora, até ${today[1]}h` };
  }
  if (today && minutes < today[0] * 60) return { open: false, text: `Fechado agora. Abrimos hoje às ${today[0]}h` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (HOURS[d]) return { open: false, text: `Fechado agora. Abrimos ${i === 1 ? "amanhã" : DAY_NAMES[d]} às ${HOURS[d][0]}h` };
  }
  return null;
}
function updateStatus() {
  const s = storeStatus();
  document.querySelectorAll("[data-status]").forEach((el) => {
    if (!s) { el.hidden = true; return; }
    el.textContent = s.text;
    el.classList.toggle("is-open", s.open);
    el.hidden = false;
  });
}
updateStatus();
setInterval(updateStatus, 60000);

/* ---------- Formulário rápido → WhatsApp ---------- */
const quick = document.getElementById("quick-form");
if (quick) {
  const erro = document.getElementById("q-erro");
  quick.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = quick.nome.value.trim();
    const interesse = quick.interesse.value;
    quick.interesse.setAttribute("aria-invalid", String(!interesse));
    if (!interesse) { erro.textContent = "Escolha o que você precisa."; quick.interesse.focus(); return; }
    erro.textContent = "";
    const msg = `Olá! ${nome ? `Meu nome é ${nome}. ` : ""}Vim pelo site da Óticas Popular Santos e preciso de: ${interesse}.`;
    if (!WHATSAPP_NUMBER) { erro.textContent = "WhatsApp indisponível no momento."; return; }
    window.open(waUrl(msg), "_blank", "noopener");
  });
  quick.interesse.addEventListener("change", () => { erro.textContent = ""; quick.interesse.removeAttribute("aria-invalid"); });
}
