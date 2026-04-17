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
    }

  } catch {
    alert('Erro de conexão');
  }

  shortenBtn.innerText = "ENCURTAR LINK";
  shortenBtn.disabled = false;
});

/* 🔥 COPY PROFISSIONAL */
window.copiarLink = async function () {
  const btn = document.querySelector('.inner-copy');
  const text = document.getElementById('copyText');

  try {
    await navigator.clipboard.writeText(shortUrlOutput.value);

    btn.classList.add("copied");
    text.innerText = "COPIADO";

    setTimeout(() => {
      btn.classList.remove("copied");
      text.innerText = "COPIAR";
    }, 2000);

  } catch {
    alert("Erro ao copiar");
  }
};

/* 🔥 FOOTER */
function toggleFooter() {
  document.getElementById("footerBox").classList.toggle("active");
}
