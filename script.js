// TODO: preencher com o número real, só dígitos com DDI+DDD (ex.: "5511999999999").
// Enquanto estiver vazio, os botões de WhatsApp levam à seção "A loja".
const WHATSAPP_NUMBER = "";
const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Óticas Popular Santos e quero saber mais.";

function setWhatsApp(a, message = WHATSAPP_MESSAGE) {
  if (!WHATSAPP_NUMBER) return;
  a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  a.target = "_blank";
  a.rel = "noopener";
}
document.querySelectorAll("[data-wa]").forEach((a) => setWhatsApp(a));

const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
});

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Catálogo ----------
   Modelos de EXEMPLO. Troque por produtos reais: nome, categoria, cores e,
   quando houver, `price` (ex.: "R$ 129") e `img` (caminho da foto). */
const PRODUCTS = [
  { name: "nara",   cat: "sol",      shape: "cat",   badge: "novo",   colors: ["#5A2E1B", "#B5532F", "#2A1020"] },
  { name: "lola",   cat: "sol",      shape: "wing",  badge: "novo",   colors: ["#A32A22", "#2F4A2B", "#7FB5A5"] },
  { name: "bento",  cat: "grau",     shape: "rect",  colors: ["#1E1512", "#44546A", "#8A6A4A"] },
  { name: "maya",   cat: "grau",     shape: "round", colors: ["#C98A2B", "#1E1512", "#B9B9B9"] },
  { name: "theo",   cat: "infantil", shape: "round", badge: "infantil", colors: ["#2D6FD0", "#D02D26", "#2F9E5B"] },
  { name: "luna",   cat: "infantil", shape: "cat",   colors: ["#E86AA6", "#7A5CD0", "#FFB300"] },
  { name: "rio",    cat: "sol",      shape: "rect",  colors: ["#1E1512", "#3B6EA8", "#6B7A3A"] },
  { name: "vera",   cat: "grau",     shape: "wing",  colors: ["#8F1712", "#1E1512", "#C9B38A"] },
];

const SHAPES = {
  round: { l: '<circle cx="62" cy="50" r="34"/>', r: '<circle cx="158" cy="50" r="34"/>', bridge: "M96 46 Q110 36 124 46" },
  rect:  { l: '<rect x="26" y="22" width="68" height="52" rx="14"/>', r: '<rect x="126" y="22" width="68" height="52" rx="14"/>', bridge: "M94 40 Q110 32 126 40" },
  cat:   { l: '<path d="M24 34 Q50 18 92 34 Q98 66 70 74 Q34 78 24 34Z"/>', r: '<path d="M196 34 Q170 18 128 34 Q122 66 150 74 Q186 78 196 34Z"/>', bridge: "M92 40 Q110 32 128 40" },
  wing:  { l: '<path d="M18 36 Q60 24 96 40 Q96 70 66 70 Q26 70 18 36Z"/>', r: '<path d="M202 36 Q160 24 124 40 Q124 70 154 70 Q194 70 202 36Z"/>', bridge: "M96 42 Q110 34 124 42" },
};

function frameSVG(shape, color, label) {
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
  list.innerHTML = items.map((p) => `
    <li class="product" data-name="${p.name}">
      <div class="product__media">
        ${p.img ? `<img src="${p.img}" alt="Armação ${p.name}">` : frameSVG(p.shape, p.colors[0], `Armação ${p.name} (ilustração)`)}
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <button type="button" class="fav" aria-pressed="${favs.has(p.name)}" aria-label="Favoritar ${p.name}">${HEART}</button>
        <a class="add" data-model="${p.name}" href="#loja" aria-label="Perguntar sobre ${p.name} no WhatsApp">+</a>
      </div>
      <div class="product__row"><h3 class="product__name">${p.name}</h3><span class="product__price">${p.price || "consulte o valor"}</span></div>
      <div class="swatches" role="group" aria-label="Cores de ${p.name}">
        ${p.colors.map((c, i) => `<button type="button" class="swatch" style="background:${c}" data-color="${c}" aria-pressed="${i === 0}" aria-label="Cor ${i + 1}"></button>`).join("")}
      </div>
    </li>`).join("");
  list.querySelectorAll(".add").forEach((a) => setWhatsApp(a, `Olá! Tenho interesse no modelo "${a.dataset.model}" que vi no site da Óticas Popular Santos.`));
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
