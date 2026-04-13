// === Elementos do HTML ===
const longUrlInput = document.getElementById('long-url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');

// === Botão de encurtar ===
shortenBtn.addEventListener('click', async () => {
  const urlLonga = longUrlInput.value.trim();

  if (!urlLonga) {
    alert('Por favor, insira uma URL.');
    return;
  }

  // Desativa o botão enquanto gera
  shortenBtn.innerText = "GERANDO...";
  shortenBtn.disabled = true;

  try {
    // IMPORTANTE: Chamamos a rota do seu servidor Node no Render
    const response = await fetch(`/encurtar?url=${encodeURIComponent(urlLonga)}`);
    const data = await response.json();

    if (data.link_curto) {
      // Exibe o resultado
      shortUrlOutput.value = data.link_curto;
      resultArea.classList.remove('hidden');
      
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
    alert('Erro ao conectar com o servidor.');
    shortenBtn.disabled = false;
    shortenBtn.innerText = "TENTAR NOVAMENTE";
  }
});
