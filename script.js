// ===============================================================
// CONFIGURE AQUI! Cole a sua URL e a sua Chave Anon do Supabase
// ===============================================================
const SUPABASE_URL = 'https://ojfxuehtcqmczdrryydx.supabase.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZnh1ZWh0Y3FtY3pkcnJ5eWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjc0NTcsImV4cCI6MjA3NTcwMzQ1N30.SG5HTX150fCj-XC6nzy9uYM53ti5J_7GC56elKLD1uA';
// ===============================================================

// Conecta ao Supabase
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Pega os elementos do HTML
const shortenBtn = document.getElementById('shorten-btn');
const longUrlInput = document.getElementById('long-url-input');
const resultArea = document.getElementById('result-area');
const shortUrlOutput = document.getElementById('short-url-output');

// Função para gerar um código curto aleatório
function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

// O que acontece quando o botão é clicado
shortenBtn.addEventListener('click', async () => {
    const longUrl = longUrlInput.value;

    // Validação simples do link
    if (!longUrl || !longUrl.startsWith('http')) {
        alert('Por favor, insira uma URL válida começando com http ou https.');
        return;
    }

    const shortCode = generateShortCode();
    
    // Tenta inserir no banco de dados do Supabase
    const { data, error } = await supabase
        .from('links')
        .insert([
            { url_longa: longUrl, codigo_curto: shortCode }
        ]);

    if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        alert('Ocorreu um erro ao criar o link. Tente novamente.');
    } else {
        // Se deu tudo certo, mostra o resultado
        const newShortUrl = `${window.location.origin}?id=${shortCode}`;
        shortUrlOutput.value = newShortUrl;
        resultArea.classList.remove('hidden');
    }
});


// Lógica de redirecionamento
// Verifica se a página foi carregada com um ID na URL
const params = new URLSearchParams(window.location.search);
const redirectId = params.get('id');

if (redirectId) {
    // Se tem um ID, procura no Supabase
    (async () => {
        const { data, error } = await supabase
            .from('links')
            .select('url_longa')
            .eq('codigo_curto', redirectId)
            .single(); // .single() pega apenas um resultado

        if (data && data.url_longa) {
            // Se encontrou, redireciona o usuário
            window.location.replace(data.url_longa);
        } else {
            // Se não encontrou, avisa o usuário
            document.body.innerHTML = '<h1>Link não encontrado</h1>';
        }
    })();
}
