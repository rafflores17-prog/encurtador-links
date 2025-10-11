// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // se sua versão do Node já tem fetch global (>=18) pode remover esta linha

const app = express();

// Corrige caminhos no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// ************ usar variáveis de ambiente (mais seguro) ************
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
// ******************************************************************

app.use(express.static(__dirname)); // expõe index.html, script.js, style.css

// rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// rota que redireciona pelo código curto
app.get("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  try {
    // encodeURIComponent para evitar problemas com caracteres especiais
    const qs = `?codigo_curto=eq.${encodeURIComponent(codigo)}&select=url_longa`;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/links${qs}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Supabase REST error:", response.status, text);
      return res.status(500).send("Erro ao buscar link (server).");
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].url_longa) {
      // redireciona para a URL original
      return res.redirect(data[0].url_longa);
    } else {
      return res.status(404).send("Link não encontrado 😢");
    }
  } catch (err) {
    console.error("Erro ao procurar código curto:", err);
    return res.status(500).send("Erro no servidor.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
