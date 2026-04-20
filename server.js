// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // se Node >= 18, pode remover

const app = express();

// Corrige caminhos no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// ************ Variáveis de ambiente ************
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
// ***********************************************

// Servir arquivos estáticos (index.html, script.js, style.css)
app.use(express.static(__dirname));

// Página inicial
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "index.html"));
});

// Rota que encurta a URL
app.get("/encurtar", async (req, res) => {
const urlLonga = req.query.url;
if (!urlLonga) return res.status(400).json({ erro: "URL não fornecida" });

try {
// gera um código curto aleatório (ex: "a1b2c3")
const codigo = Math.random().toString(36).substring(2, 8);

// salva no Supabase  
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
  return res.status(500).json({ erro: "Erro ao salvar no Supabase" });  
}  

const linkCurto = `${req.protocol}://${req.get("host")}/${codigo}`;  
res.json({ link_curto: linkCurto });

} catch (err) {
console.error("Erro ao encurtar:", err);
res.status(500).json({ erro: "Erro no servidor" });
}
});

// Redirecionamento pelo código curto
app.get("/:codigo", async (req, res) => {
const codigo = req.params.codigo;

try {
const response = await fetch(
${SUPABASE_URL}/rest/v1/links?codigo_curto=eq.${encodeURIComponent(   codigo   )}&select=url_longa,
{
headers: {
apikey: SUPABASE_KEY,
Authorization: Bearer ${SUPABASE_KEY},
Accept: "application/json",
},
}
);

if (!response.ok) {  
  const text = await response.text();  
  console.error("Supabase REST error:", response.status, text);  
  return res.status(500).send("Erro ao buscar link (server).");  
}  

const data = await response.json();  

if (Array.isArray(data) && data.length > 0 && data[0].url_longa) {  
  // Redireciona para a URL original  
  return res.redirect(data[0].url_longa);  
} else {  
  return res.status(404).send("Link não encontrado 😢");  
}

} catch (err) {
console.error("Erro ao procurar código curto:", err);
return res.status(500).send("Erro no servidor.");
}
});

// Inicia o servidor
app.listen(PORT, () => {
console.log(🚀 Servidor rodando na porta ${PORT});
});
