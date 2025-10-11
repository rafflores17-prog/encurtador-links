import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Conexão com o Supabase
const SUPABASE_URL = "https://vcyllncgolzgqhbsgxfq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeWxsbmNnb2x6Z3FoYnNneGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTM5MTQsImV4cCI6MjA3NTc2OTkxNH0.4S1o26SEw3dTwsOmnV3yjz5WANumUUhgQSygjUPTFW0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Rota principal — exibe o site
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

// Rota do link curto
app.get("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  const { data, error } = await supabase
    .from("links")
    .select("url_longa")
    .eq("codigo_curto", codigo)
    .single();

  if (error || !data) {
    return res.status(404).send("Link não encontrado 😢");
  }

  res.redirect(data.url_longa);
});

// Porta padrão Render
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
