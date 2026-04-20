// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ⚠️ Node 18+ NÃO precisa de node-fetch
// se der erro, descomenta:
// import fetch from "node-fetch";

const app = express();

// Corrige __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// ENV
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

/* =========================
   🚫 DESATIVAR CACHE (IMPORTANTE)
========================= */
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/* =========================
   📁 ARQUIVOS ESTÁTICOS
========================= */
app.use(express.static(__dirname));

/* =========================
   🏠 HOME
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   📄 PÁGINAS SEO
========================= */
app.get("/como-encurtar-link-whatsapp.html", (req, res) => {
  res.sendFile(path.join(__dirname, "como-encurtar-link-whatsapp.html"));
});

app.get("/melhor-encurtador-links-2026.html", (req, res) => {
  res.sendFile(path.join(__dirname, "melhor-encurtador-links-2026.html"));
});

/* =========================
   🔁 REDIRECIONAR PÁGINAS ANTIGAS
========================= */
app.get("/encurtador-de-links.html", (req, res) => res.redirect(301, "/"));
app.get("/encurtador-link-gratis.html", (req, res) => res.redirect(301, "/"));
app.get("/link-curto.html", (req, res) => res.redirect(301, "/"));
app.get("/url-curta.html", (req, res) => res.redirect(301, "/"));

/* =========================
   🔗 ENCURTAR LINK
========================= */
app.get("/encurtar", async (req, res) => {
  const urlLonga = req.query.url;

  if (!urlLonga) {
    return res.status(400).json({ erro: "URL não fornecida" });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ erro: "Supabase não configurado" });
  }

  try {
    const codigo = Math.random().toString(36).substring(2, 8);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/links`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        codigo_curto: codigo,
        url_longa: urlLonga,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro Supabase:", text);

      return res.status(500).json({
        erro: "Erro ao salvar link"
      });
    }

    const linkCurto = `${req.protocol}://${req.get("host")}/${codigo}`;

    return res.json({ link_curto: linkCurto });

  } catch (err) {
    console.error("Erro
