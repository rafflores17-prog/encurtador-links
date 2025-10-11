import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // Importa fetch para chamadas ao Supabase

const app = express();

// Variáveis
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Chaves do Supabase
const SUPABASE_URL = "https://vcyllncgolzgqhbsgxfq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeWxsbmNnb2x6Z3FoYnNneGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTM5MTQsImV4cCI6MjA3NTc2OTkxNH0.4S1o26SEw3dTwsOmnV3yjz5WANumUUhgQSygjUPTFW0";

// Permite ler arquivos estáticos (index.html, script.js, style.css)
app.use(express.static(__dirname));

// 👉 Rota principal (abre o index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 👉 Rota para redirecionar links curtos
app.get("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  // Busca no Supabase
  const response = await fetch(`${SUPABASE_URL}/rest/v1/links?codigo_curto=eq.${codigo}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  const data = await response.json();

  if (data.length > 0) {
    // Redireciona para a URL original
    res.redirect(data[0].url_longa);
  } else {
    res.status(404).send("Link não encontrado 😢");
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
