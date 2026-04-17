const longUrlInput = document.getElementById('long-url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');
const clicksEl = document.getElementById('clicks');
const stats = document.getElementById('stats');

shortenBtn.addEventListener('click', async () => {

  const url = longUrlInput.value.trim();

  if (!url) return alert('Digite uma URL');

  shortenBtn.innerText = "GERANDO...";
  shortenBtn.disabled = true;

  try {
    const res = await fetch(`/encurtar?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.link_curto) {

      shortUrlOutput.value = data.link_curto;

      resultArea.classList.remove('hidden');

      /* animação reinicia */
      resultArea.querySelector('.result-box').classList.remove('animate-pop');
      void resultArea.offsetWidth;
      resultArea.querySelector('.result-box').classList.add('animate-pop');

      /* contador (se backend mandar) */
      if (data.clicks !== undefined) {
        clicksEl.innerText = data.clicks;
        stats.classList.remove('hidden');
      }

    }

  } catch {
    alert("Erro");
  }

  shortenBtn.innerText = "ENCURTAR LINK";
  shortenBtn.disabled = false;

});

/* COPY PROFISSIONAL */
function copiarLink() {
  navigator.clipboard.writeText(shortUrlOutput.value);

  const btn = document.getElementById('copyText');
  btn.innerText = "Copiado ✔";

  setTimeout(() => {
    btn.innerText = "Copiar link";
  }, 2000);
}
