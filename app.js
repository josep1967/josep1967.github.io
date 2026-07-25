console.log("UI carregada");

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

console.log("Supabase carregat via ESM");

const supabase = createClient(
  "https://whfinmlryocgrpzygdmj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZmlubWxyeW9jZ3JwenlnZG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTgxODQsImV4cCI6MjA5MTAzNDE4NH0.t9K8l3jejOHgafhgswrzYMQNxtdB_GhP-qDv-br9seU"
);

console.log("Supabase:", supabase);

// 🔥 VARIABLES DEL DOM
const buscador = document.getElementById("buscador");
const resultats = document.getElementById("resultats");
const detall = document.getElementById("detall");
const botoTancar = document.getElementById("tancar-detall");

// 🔥 LISTENER DEL BOTÓ “TANCAR”
botoTancar.onclick = () => {
  detall.classList.add("ocult");
};

// 🔥 LISTENER DEL BUSCADOR
buscador.addEventListener("input", async () => {
  const text = buscador.value.toLowerCase();
  resultats.innerHTML = "";

  if (text.length === 0) return;

  const { data, error } = await supabase
    .from("localitzacions")
    .select("*")
    .ilike("nom", `%${text}%`)
    .limit(30);

  if (error) {
    console.error("Error Supabase:", error);
    return;
  }

  data.forEach(loc => {
    const div = document.createElement("div");
    div.className = "resultat";
    div.textContent = loc.nom;
    div.onclick = () => mostrarDetall(loc);
    resultats.appendChild(div);
  });
});

// 🔥 FUNCIÓ DETALL
function mostrarDetall(loc) {
  document.getElementById("detall-nom").textContent = loc.nom;
  document.getElementById("detall-lat").textContent = loc.lat;
  document.getElementById("detall-lon").textContent = loc.lon;
  document.getElementById("detall-poblacio").textContent = loc.poblacio;
  document.getElementById("detall-comarca").textContent = loc.comarca;
  document.getElementById("detall-telefon").textContent = loc.telefon;
  document.getElementById("detall-comentari").textContent = loc.comentari;

  const gpsButtons = document.getElementById("gps-buttons");
  gpsButtons.innerHTML = "";

  function crearBoto(url, label) {
    const boto = document.createElement("button");
    boto.textContent = label;
    boto.style.marginRight = "10px";
    boto.onclick = () => window.open(url, "_blank");
    gpsButtons.appendChild(boto);
  }

  if (loc.gps1) crearBoto(loc.gps1, "GPS 1");
  if (loc.gps2) crearBoto(loc.gps2, "GPS 2");
  if (loc.gps3) crearBoto(loc.gps3, "GPS 3");

  detall.classList.remove("ocult");
}


// 🔥 BOTÓ D’INSTAL·LAR PWA — VERSIÓ DEFINITIVA
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Funció per saber si la PWA està instal·lada
function pwaInstalada() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    navigator.standalone === true
  );
}

// 🟩 1) Si la PWA està instal·lada → amaguem el botó i NO configurem res més
if (pwaInstalada()) {
  installBtn.classList.add("ocult");
  console.log("PWA instal·lada → no mostrar botó");
} else {

  // 🟩 2) Només escoltem l’esdeveniment si NO està instal·lada
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("beforeinstallprompt disparat");

    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove("ocult");
  });

  // 🟩 3) Acció del botó d’instal·lar
  installBtn.addEventListener("click", async () => {
    installBtn.classList.add("ocult");
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log("Instal·lació:", result);
    deferredPrompt = null;
  });
}

