// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();

// Corrige caminhos no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// ************ Variáveis de ambiente ************
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
// ***********************************************

// Servir arquivos estáticos
app.use(express.static(__dirname));

/* =========================
   🔥 ROTAS SEO (CORREÇÃO)
========================= */

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Páginas SEO válidas
app.get("/como-encurtar-link-whatsapp.html", (req, res) => {
  res.sendFile(path.join(__dirname, "como-encurtar-link-whatsapp.html"));
});

app.get("/melhor-encurtador-links-2026.html", (req, res) => {
  res.sendFile(path.join(__dirname, "melhor-encurtador-links-2026.html"));
});

// 🔁 REDIRECIONAMENTOS (evita conteúdo duplicado)
app.get("/encurtador-de-links.html", (req, res) => {
  res.redirect(301, "/");
});

app.get("/encurtador-link-gratis.html", (req, res) => {
  res.redirect(301, "/");
});

app.get("/link
