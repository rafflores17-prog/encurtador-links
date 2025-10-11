// === Conexão com Supabase ===
const SUPABASE_URL = 'https://vcyllncgolzgqhbsgxfq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeWxsbmNnb2x6Z3FoYnNneGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTM5MTQsImV4cCI6MjA3NTc2OTkxNH0.4S1o26SEw3dTwsOmnV3yjz5WANumUUhgQSygjUPTFW0';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// === Elementos do HTML ===
const longUrlInput = document.getElementById('long-url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');

// === Gerar código curto ===
function gerarCodigoCurto() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  for (let i = 0; i < 5; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

// === Botão de encurtar ===
shortenBtn.addEventListener('click', async () => {
  const urlLonga = longUrlInput.value.trim();

  if (!urlLonga) {
    alert('Por favor, insira uma URL.');
    return;
  }

  const codigoCurto = gerarCodigoCurto();

  try {
    const { error } = await db
      .from('links')
      .insert([{ url_longa: urlLonga, codigo_curto: codigoCurto }]);

    if (error) {
      console.error('Erro Supabase:', error);
      alert('Erro ao encurtar link. Veja o console.');
      return;
    }

    const shortUrl = `${window.location.origin}/${codigoCurto}`;
    shortUrlOutput.value = shortUrl;
    resultArea.classList.remove('hidden');
  } catch (err) {
    console.error('Erro geral:', err);
    alert('Erro ao conectar. Veja o console.');
  }
});
