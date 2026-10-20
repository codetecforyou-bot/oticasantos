// TODO: preencher com o número real, só dígitos com DDI+DDD (ex.: "5511999999999").
// Enquanto estiver vazio, os botões de WhatsApp levam à seção "A loja".
const WHATSAPP_NUMBER = "";
const WHATSAPP_MESSAGE = "Olá! Vim pelo site da Óticas Popular Santos e quero saber mais.";

if (WHATSAPP_NUMBER) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

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
