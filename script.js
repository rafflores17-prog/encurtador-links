// Conecta ao Supabase
const SUPABASE_URL = 'https://vcyllncgolzgqhbsgxfq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeWxsbmNnb2x6Z3FoYnNneGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTM5MTQsImV4cCI6MjA3NTc2OTkxNH0.4S1o26SEw3dTwsOmnV3yjz5WANumUUhgQSygjUPTFW0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Pega os elementos do HTML
const longUrlInput = document.getElementById('long-url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');

// Gera código curto aleatório (ex: Ab3K9)
function gerarCodigoCurto() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  for (let i = 0; i < 5; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

// Evento do botão "Encurtar"
shortenBtn.addEventListener('click', async () => {
  const urlLonga = longUrlInput.value.trim();

  if (!urlLonga) {
    alert('Por favor, insira uma URL.');
    return;
  }

  const codigoCurto = gerarCodigoCurto();

  // Salva no banco Supabase
  const { data, error } = await supabase
    .from('links')
    .insert([
      { url_longa: urlLonga, codigo_curto: codigoCurto }
    ]);

  if (error) {
    console.error('Erro ao salvar no banco:', error);
    alert('Erro ao encurtar link. Veja o console.');
    return;
  }

  // Mostra o link curto
  const shortUrl = `${window.location.origin}/${codigoCurto}`;
  shortUrlOutput.value = shortUrl;
  resultArea.classList.remove('hidden');
});
