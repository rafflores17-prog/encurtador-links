// === Elementos do HTML ===
const longUrlInput = document.getElementById('long-url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');

// === Lógica de Encurtamento ===
shortenBtn.addEventListener('click', async () => {
  const urlLonga = longUrlInput.value.trim();

  if (!urlLonga) {
    alert('Por favor, insira uma URL.');
    return;
  }

  // Feedback visual: desativa o botão enquanto processa
  shortenBtn.innerText = "GERANDO...";
  shortenBtn.disabled = true;

  try {
    // Chama a rota do seu servidor Node no Render
    const response = await fetch(`/encurtar?url=${encodeURIComponent(urlLonga)}`);
    const data = await response.json();

    if (data.link_curto) {
      // Exibe a área de resultado e o link pronto
      shortUrlOutput.value = data.link_curto;
      resultArea.classList.remove('hidden');
      resultArea.classList.add('animate-in');
      
      // Volta o botão ao normal
      shortenBtn.innerText = "ENCURTAR LINK";
      shortenBtn.disabled = false;
    } else {
      alert('Erro: ' + (data.erro || 'Falha ao gerar link'));
      shortenBtn.disabled = false;
      shortenBtn.innerText = "TENTAR NOVAMENTE";
    }
  } catch (err) {
    console.error('Erro geral:', err);
    alert('Erro ao conectar com o servidor. Verifique sua conexão.');
    shortenBtn.disabled = false;
    shortenBtn.innerText = "TENTAR NOVAMENTE";
  }
});

// === Função para copiar o link ===
window.copiarLink = function() {
  shortUrlOutput.select();
  shortUrlOutput.setSelectionRange(0, 99999); // Para mobile
  document.execCommand("copy");
  
  const copyBtn = document.querySelector('.inner-copy');
  const originalText = copyBtn.innerText;
  
  copyBtn.innerText = "COPIADO!";
  copyBtn.style.background = "#16a34a";
  
  setTimeout(() => {
    copyBtn.innerText = originalText;
    copyBtn.style.background = ""; // Volta para a cor do CSS
  }, 2000);
};

// === Configuração do PWA (Service Worker) ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('PWA: Service Worker registrado com sucesso!', reg))
      .catch(err => console.log('PWA: Falha ao registrar Service Worker', err));
  });
}
