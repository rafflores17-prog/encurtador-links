// === CONFIGURAÇÃO DO SUPABASE ===
// substitua pelos seus dados reais do Supabase
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_KEY = 'SEU-ANON-KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === CAPTURA DOS ELEMENTOS ===
const btn = document.getElementById('shorten-btn');
const input = document.getElementById('long-url');
const shortInput = document.getElementById('short-url');

// === GERA UM CÓDIGO CURTO ALEATÓRIO ===
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

// === AO CLICAR NO BOTÃO ===
btn.addEventListener('click', async () => {
  const urlLonga = input.value.trim();
  if (!urlLonga) {
    alert('Digite uma URL válida!');
    return;
  }

  const codigo = gerarCodigo();

  // Insere no Supabase
  const { data, error } = await supabase
    .from('links')
    .insert([{ url_longa: urlLonga, codigo_curto: codigo }]);

  if (error) {
    alert('Erro ao salvar no banco: ' + error.message);
    console.error(error);
    return;
  }

  // Mostra o link curto na tela
  const linkCurto = `${window.location.origin}/${codigo}`;
  shortInput.value = linkCurto;
});
