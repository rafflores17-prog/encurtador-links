const longUrlInput = document.getElementById('long-url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');

shortenBtn.addEventListener('click', async () => {
  const urlLonga = longUrlInput.value.trim();

  if (!urlLonga) {
    alert('Digite uma URL válida');
    return;
  }

  shortenBtn.innerText = "GERANDO...";
  shortenBtn.disabled = true;

  try {
    const res = await fetch(`/encurtar?url=${encodeURIComponent(urlLonga)}`, {
      cache: "no-store"
    });

    const data = await res.json();

    if (data.link_curto) {
      shortUrlOutput.value = data.link_curto;
      resultArea.classList.remove('hidden');
    } else {
      alert('Erro ao gerar link');
    }

  } catch (e) {
    alert('Erro de conexão');
  }

  shortenBtn.innerText = "ENCURTAR LINK";
  shortenBtn.disabled = false;
});

window.copiarLink = async function () {
  try {
    await navigator.clipboard.writeText(shortUrlOutput.value);
    alert("Copiado!");
  } catch {
    alert("Erro ao copiar");
  }
};
