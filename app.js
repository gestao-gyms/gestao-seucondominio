// ==============================================================
// 1. CONEXÃO HÍBRIDA SUPABASE (LOCAL-FIRST + CLOUD BACKUP)
// ==============================================================
const SUPABASE_URL = 'https://opmtzbrwnoejnqzwaxof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbXR6YnJ3bm9lam5xendheG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMDg3OTgsImV4cCI6MjEwNzU4NDc5OH0.Ui_VX8yMCtH64xU5hfIJoznWSPRqsu5dp8ATrSK2CiU';
let supabaseClient = null;

try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {}

// ==============================================================
// 2. PENSAMENTOS ESPÍRITAS + EDIÇÃO SIMULTÂNEA (TÍTULO E FRASE!)
// ==============================================================
const PENSAMENTOS_PADRAO = [
    {
        mantra: "AMOR • CARIDADE • BENEVOLÊNCIA • PAZ",
        frase: "“Fora da caridade não há salvação. O amor é a centelha divina que ilumina todo o Universo.”",
        autor: "Allan Kardec"
    },
    {
        mantra: "INFINITO • EVOLUÇÃO • LUZ • ETERNIDADE",
        frase: "“Nascer, morrer, renascer ainda e progredir sempre, tal é a Lei.”",
        autor: "Allan Kardec"
    },
    {
        mantra: "SERENIDADE • PACIÊNCIA • AMOR • HARMONIA",
        frase: "“A paciência também é uma caridade; praticai-a com todos aqueles que cruzam o vosso caminho.”",
        autor: "Emmanuel • Chico Xavier"
    },
    {
        mantra: "PLENITUDE • FÉ RACIOCINADA • FRATERNIDADE",
        frase: "“O amor é de essência divina; resume toda a doutrina de Jesus, porque é o sentimento por excelência.”",
        autor: "O Evangelho Segundo o Espiritismo"
    },
    {
        mantra: "MANSIDÃO • EQUILÍBRIO • COMPAIXÃO • LUZ",
        frase: "“A calma é o escudo da alma serena. Onde há equilíbrio, a solução sempre encontra caminho.”",
        autor: "Joanna de Ângelis"
    },
    {
        mantra: "SERVIÇO • GRATIDÃO • HUMILDADE • BEM",
        frase: "“O trabalho digno é oração em movimento; cada gesto de auxílio acende uma estrela no íntimo.”",
        autor: "André Luiz"
    },
    {
        mantra: "CONSOLO • ESPERANÇA • FRATERNIDADE • PAZ",
        frase: "“Quem espalha gentileza no atendimento colhe paz na consciência e luz na própria jornada.”",
        autor: "Bezerra de Menezes"
    }
];

let pensamentosLuz = JSON.parse(localStorage.getItem('sc_pensamentos_espirita')) || PENSAMENTOS_PADRAO;
let indicePensamento = 0;

function atualizarAuraHorarioHorizonte() {
    const h = new Date().getHours();
    const classe = (h >= 5 && h < 12) ? 'horizon-manha' : (h >= 12 && h < 18 ? 'horizon-tarde' : 'horizon-noite');
    const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
    const horizon = doc.querySelector('.cosmic-horizon') || document.querySelector('.cosmic-horizon');
    if (horizon) {
        horizon.classList.remove('horizon-manha', 'horizon-tarde', 'horizon-noite');
        horizon.classList.add(classe);
    }
}

function trocarPensamentoEspirita(e) {
    const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
    const elFrase = doc.getElementById('frase-espirita') || document.getElementById('frase-espirita');
    const elMantra = doc.getElementById('mantra-palavras') || document.getElementById('mantra-palavras');
    const elAutor = doc.getElementById('autor-espirita') || document.getElementById('autor-espirita');
    if (!elFrase || !elMantra) return;

    if (elFrase.getAttribute('contenteditable') === 'true' || elMantra.getAttribute('contenteditable') === 'true') {
        return;
    }

    if (!Array.isArray(pensamentosLuz) || pensamentosLuz.length < 2) {
        pensamentosLuz = PENSAMENTOS_PADRAO;
    }

    indicePensamento = (indicePensamento + 1) % pensamentosLuz.length;
    const item = pensamentosLuz[indicePensamento];

    elFrase.style.opacity = 0;
    if (elAutor) elAutor.style.opacity = 0;
    setTimeout(() => {
        elMantra.innerText = item.mantra;
        elFrase.innerText = item.frase;
        if (elAutor) {
            elAutor.innerText = item.autor ? `— ${item.autor}` : '';
            elAutor.style.opacity = 1;
        }
        elFrase.style.opacity = 1;
    }, 140);

    if (typeof reagirAnjo === 'function') reagirAnjo('spark', 800);
    if (typeof tocarNotaEterea === 'function') tocarNotaEterea('suave');
}

function ativarEdicaoFraseTopo(e) {
    e.preventDefault();
    const elFrase = document.getElementById('frase-espirita');
    const elMantra = document.getElementById('mantra-palavras');
    const horizonBox = document.querySelector('.cosmic-horizon');

    const jaEditando = elFrase.getAttribute('contenteditable') === 'true';
    if (!jaEditando) {
        elMantra.setAttribute('contenteditable', 'true');
        elFrase.setAttribute('contenteditable', 'true');

        if (e.target === elMantra || elMantra.contains(e.target)) {
            elMantra.focus();
        } else {
            elFrase.focus();
        }

        mostrarToast("✨ Edição ativada! Clique no Título ou na Frase e pressione Enter para salvar.");

        const finalizarEdicao = () => {
            elMantra.setAttribute('contenteditable', 'false');
            elFrase.setAttribute('contenteditable', 'false');
            pensamentosLuz[indicePensamento] = {
                mantra: elMantra.innerText.trim() || "AMOR • CARIDADE • LUZ",
                frase: elFrase.innerText.trim() || "“Fora da caridade não há salvação.”"
            };
            localStorage.setItem('sc_pensamentos_espirita', JSON.stringify(pensamentosLuz));
            mostrarToast("🌟 Título e Frase salvos!");
        };

        const checarEnter = (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                finalizarEdicao();
            } else if (ev.key === 'Escape') {
                finalizarEdicao();
            }
        };

        elMantra.onkeydown = checarEnter;
        elFrase.onkeydown = checarEnter;

        const clicarFora = (ev) => {
            if (!horizonBox.contains(ev.target)) {
                finalizarEdicao();
                document.removeEventListener('mousedown', clicarFora);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', clicarFora), 100);
    }
}

// ==============================================================
// 3. MOTOR ULTRA-LEVE 2 CAMADAS: ESTRELAS 0% CPU + COMETAS EM DIRTY-RECT
// ==============================================================
function iniciarCosmosInfinito(targetDocument = document) {
    const canvas = targetDocument.getElementById('cosmos-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const staticCanvas = targetDocument.getElementById('cosmos-stars-canvas');
    const staticCtx = staticCanvas ? staticCanvas.getContext('2d', { alpha: true }) : null;

    function gerarCeuEGalaxiaEstatica() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        if (!staticCanvas || !staticCtx) return;

        staticCanvas.width = w;
        staticCanvas.height = h;
        staticCtx.clearRect(0, 0, w, h);

        // 1. DESENHA 130 ESTRELAS UMA ÚNICA VEZ (0% CPU EM REPOUSO!)
        for (let i = 0; i < 130; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 1.45 + 0.3;
            const alpha = Math.random() * 0.72 + 0.2;
            const cor = Math.random() > 0.7 ? '254, 240, 138' : (Math.random() > 0.4 ? '216, 180, 254' : '186, 230, 253');

            staticCtx.beginPath();
            staticCtx.arc(x, y, r, 0, Math.PI * 2);
            staticCtx.fillStyle = `rgba(${cor}, ${alpha})`;
            staticCtx.fill();

            if (i % 14 === 0) {
                staticCtx.strokeStyle = `rgba(${cor}, ${alpha * 0.55})`;
                staticCtx.lineWidth = 0.7;
                const tam = r * 3.4;
                staticCtx.beginPath();
                staticCtx.moveTo(x - tam, y); staticCtx.lineTo(x + tam, y);
                staticCtx.moveTo(x, y - tam); staticCtx.lineTo(x, y + tam);
                staticCtx.stroke();
            }
        }

        // 2. GALÁXIA ESPIRAL ESTÁTICA
        const gx = w > 680 ? 330 : 75;
        const gy = 48;

        const coreGrad = staticCtx.createRadialGradient(gx, gy, 1, gx, gy, 55);
        coreGrad.addColorStop(0, 'rgba(254, 249, 195, 0.65)');
        coreGrad.addColorStop(0.25, 'rgba(192, 132, 252, 0.28)');
        coreGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        staticCtx.fillStyle = coreGrad;
        staticCtx.beginPath();
        staticCtx.arc(gx, gy, 55, 0, Math.PI * 2);
        staticCtx.fill();

        const bracos = 2;
        for (let j = 0; j < 190; j++) {
            const dist = Math.random() * 58 + 2;
            const anguloBraco = (j % bracos) * Math.PI;
            const espiral = dist * 0.085;
            const dispersao = (Math.random() - 0.5) * 0.65;
            const ang = anguloBraco + espiral + dispersao;

            const rawX = Math.cos(ang) * dist;
            const rawY = Math.sin(ang) * dist * 0.42;
            const rot = -0.35;
            const px = gx + (rawX * Math.cos(rot) - rawY * Math.sin(rot));
            const py = gy + (rawX * Math.sin(rot) + rawY * Math.cos(rot));

            const alphaStar = Math.max(0.08, (1 - dist / 62) * 0.85);
            const rStar = dist < 14 ? Math.random() * 1.2 + 0.4 : Math.random() * 0.85 + 0.2;
            const corStar = dist < 15 ? '254, 240, 138' : (j % 3 === 0 ? '125, 211, 252' : '233, 213, 255');

            staticCtx.beginPath();
            staticCtx.arc(px, py, rStar, 0, Math.PI * 2);
            staticCtx.fillStyle = `rgba(${corStar}, ${alphaStar})`;
            staticCtx.fill();
        }
    }

    gerarCeuEGalaxiaEstatica();
    let timerResizeCosmos = null;
    window.addEventListener('resize', () => {
        clearTimeout(timerResizeCosmos);
        timerResizeCosmos = setTimeout(gerarCeuEGalaxiaEstatica, 180);
    });

    function criarCometaTopo(direcao) {
        const indoEsq = direcao === 1;
        return {
            tipo: 'topo',
            direcao: direcao,
            x: indoEsq ? canvas.width + 40 : -40,
            y: Math.random() * 45 + 18,
            vx: indoEsq ? -3.4 : 3.4,
            vy: 0.12,
            angulo: 0,
            corCabeca: '254, 240, 138',
            corCauda: '192, 132, 252',
            prevRect: null
        };
    }

    function criarCometaTelaToda(direcao) {
        const indoEsq = direcao === 1;
        return {
            tipo: 'telaToda',
            direcao: direcao,
            x: indoEsq ? canvas.width + 60 : -60,
            y: Math.random() * (canvas.height * 0.55) + 100,
            vx: indoEsq ? -4.0 : 4.0,
            vy: 0.85,
            angulo: 0,
            corCabeca: '125, 211, 252',
            corCauda: '56, 189, 248',
            prevRect: null
        };
    }

    let cometas = [criarCometaTopo(1), criarCometaTelaToda(-1)];
    let ultimoFrame = 0;

    function animar(timestamp) {
        requestAnimationFrame(animar);
        if (document.hidden) return; // Pausa 100% quando a aba está oculta!
        if (timestamp - ultimoFrame < 33) return; // 30 FPS leves só nos 2 cometas
        ultimoFrame = timestamp;

        // Limpa APENAS o retângulo anterior de cada cometa (zero drawImage de tela cheia!)
        for (let i = 0; i < cometas.length; i++) {
            const r = cometas[i].prevRect;
            if (r) ctx.clearRect(r.x, r.y, r.w, r.h);
        }

        cometas.forEach((c, idx) => {
            c.x += c.vx;
            c.y += c.vy;
            c.angulo += 0.12;

            if (c.tipo === 'topo') {
                if ((c.vx < 0 && c.x < -110) || (c.vx > 0 && c.x > canvas.width + 110)) {
                    cometas[idx] = criarCometaTopo(c.direcao * -1);
                    return;
                }
            } else {
                if ((c.vx < 0 && c.x < -120) || (c.vx > 0 && c.x > canvas.width + 120) || c.y > canvas.height + 100) {
                    cometas[idx] = criarCometaTelaToda(c.direcao * -1);
                    return;
                }
            }

            const tailX = c.x - c.vx * 22;
            const tailY = c.y - c.vy * 22;

            const minX = Math.min(c.x, tailX) - 14;
            const minY = Math.min(c.y, tailY) - 14;
            const maxX = Math.max(c.x, tailX) + 14;
            const maxY = Math.max(c.y, tailY) + 14;
            c.prevRect = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };

            const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.15, `rgba(${c.corCabeca}, 0.9)`);
            grad.addColorStop(0.5, `rgba(${c.corCauda}, 0.4)`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.angulo);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-6, 0); ctx.lineTo(6, 0);
            ctx.moveTo(0, -6); ctx.lineTo(0, 6);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.restore();
        });
    }
    requestAnimationFrame(animar);
}

const SCRIPTS_INICIAIS = [];
let listaScripts = JSON.parse(localStorage.getItem('sc_cockpit_scripts_v5') || localStorage.getItem('sc_cockpit_scripts_v4') || localStorage.getItem('sc_cockpit_scripts_v3')) || SCRIPTS_INICIAIS;
let categoriaAtiva = 'todas';
if (localStorage.getItem('sc_modo_compacto') === null) {
    localStorage.setItem('sc_modo_compacto', 'true');
}
let modoCompacto = localStorage.getItem('sc_modo_compacto') === 'true';
let idsVisiveisNoMomento = [];
let indiceFocadoTeclado = 0;

const CATEGORIAS_PADRAO = [
    { id: 'todas', label: '🔥 Todas', fixa: true },
    { id: 'Favoritos', label: '⭐ Fixadas', fixa: true },
    { id: 'Saudação', label: '👋 Saudação' },
    { id: 'Reservas', label: '🎉 Reservas' },
    { id: 'Cadastros', label: '👤 Cadastros' },
    { id: 'Financeiro', label: '💰 Financeiro' },
    { id: 'Portaria', label: '🛡️ Portaria' },
    { id: 'Erros', label: '🛠️ Erros' },
    { id: 'Encerramento', label: '✅ Fim' },
    { id: 'Prompts IA', label: '🤖 Prompts IA', ocultaNaHome: true }
];

let CATEGORIAS_OFICIAIS = JSON.parse(localStorage.getItem('sc_categorias_custom_v1')) || CATEGORIAS_PADRAO;

function salvarCategoriasCustom() {
    localStorage.setItem('sc_categorias_custom_v1', JSON.stringify(CATEGORIAS_OFICIAIS));
    renderizarPillsCategorias();
    renderizarOpcoesCategoriaModal();
    renderizarCards();
}
// ==============================================================
// 5. SAUDAÇÃO LIMPA NA BARRA + VÍRGULA OCULTA AUTOMÁTICA NO TEXTO
// ==============================================================
function obterSaudacaoHorario() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "bom dia";
    if (h >= 12 && h < 18) return "boa tarde";
    return "boa noite";
}

function atualizarBadgeSaudacao() {
    const s = obterSaudacaoHorario();
    const icone = s === 'bom dia' ? '☀️' : (s === 'boa tarde' ? '🌤️' : '🌙');
    const el = document.getElementById('badge-saudacao-atual');
    if (el) el.innerText = `${icone} ${s}`;
}

function processarTexto(textoBruto, isHtmlPreview = false) {
    const nome = document.getElementById('var-nome')?.value.trim() || "";
    const condominio = document.getElementById('var-condominio')?.value.trim() || "";
    const saudacao = obterSaudacaoHorario();

    let t = textoBruto;

    t = t.replace(/\{saudacao\}/gi, isHtmlPreview ? `<span class="var-highlight">${saudacao}</span>` : saudacao);

    if (nome) {
        t = t.replace(/,?\s*\{nome\}/gi, isHtmlPreview ? `, <span class="var-highlight">${nome}</span>` : `, ${nome}`);
    } else {
        t = t.replace(/,?\s*\{nome\}/gi, "");
    }

    if (condominio) {
        t = t.replace(/\{condominio\}/gi, isHtmlPreview ? `<span class="var-highlight">(${condominio})</span>` : `(${condominio})`);
    } else {
        t = t.replace(/\s*\{condominio\}/gi, "");
    }

    return t.replace(/,\s*,/g, ",").replace(/ +!/g, "!").replace(/ +,/g, ",").replace(/  +/g, " ");
}

async function colarRapido(inputId) {
    try {
        const txt = await navigator.clipboard.readText();
        if (txt) {
            document.getElementById(inputId).value = txt.trim();
            renderizarCards();
        }
    } catch (e) {}
}

function limparVariaveis() {
    document.getElementById('var-nome').value = '';
    document.getElementById('var-condominio').value = '';
    renderizarCards();
    mostrarToast("Variáveis limpas!");
}

// ==============================================================
// 6. RENDERIZAÇÃO DOS CARDS (COM ÍCONE DE CAIXINHA INLINE + CANETINHA)
// ==============================================================
function renderizarPillsCategorias() {
    const container = document.getElementById('container-categorias');
    if (!container) return;

    const apenasAtendimento = listaScripts.filter(s => s.categoria !== 'Prompts IA');
    document.getElementById('contador-total-sidebar').innerText = apenasAtendimento.length;

    container.innerHTML = '';
    CATEGORIAS_OFICIAIS.forEach(cat => { if (cat.ocultaNaHome) return;
        let qtd = 0;
        if (cat.id === 'todas') qtd = apenasAtendimento.length;
        else if (cat.id === 'Favoritos') qtd = apenasAtendimento.filter(s => s.favorito).length;
        else qtd = apenasAtendimento.filter(s => s.categoria === cat.id).length;

        const btn = document.createElement('button');
        btn.className = `pill ${categoriaAtiva === cat.id ? 'active' : ''}`;
        btn.onclick = () => {
            categoriaAtiva = cat.id;
            indiceFocadoTeclado = 0;
            renderizarPillsCategorias();
            renderizarCards();
        };
        btn.innerHTML = `${cat.label} <span class="count">${qtd}</span>`;
        container.appendChild(btn);
    });
}

let _timerDebounceBusca = null;
let _timerDebounceVars = null;

function capitalizarNomeCliente(str) {
    if (!str) return "";
    const conectores = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
    return str.trim().split(/\s+/).map((palavra, idx) => {
        const lower = palavra.toLowerCase();
        if (idx > 0 && conectores.has(lower)) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(' ');
}

function aoDigitarVariavelPersonalizacao() {
    clearTimeout(_timerDebounceVars);
    _timerDebounceVars = setTimeout(() => {
        const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
        const inputNome = doc.getElementById('var-nome') || document.getElementById('var-nome');
        if (inputNome && inputNome.value.trim()) {
            const pos = inputNome.selectionStart;
            const cap = capitalizarNomeCliente(inputNome.value);
            if (inputNome.value.trim() !== cap && !inputNome.value.endsWith(' ')) {
                inputNome.value = cap;
                try { inputNome.setSelectionRange(pos, pos); } catch (e) {}
            }
        }
        // Atualiza apenas os previews dos cards já visíveis (zero reconstrução de DOM!)
        if (!modoCompacto) {
            idsVisiveisNoMomento.forEach(id => {
                const item = listaScripts.find(s => s.id === id);
                const elBody = doc.getElementById(`body-preview-${id}`);
                if (item && elBody) {
                    elBody.innerHTML = processarTexto(item.texto, true);
                }
            });
        }
    }, 80);
}

function aoDigitarBusca() {
    const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
    const val = (doc.getElementById('busca-rapida') || document.getElementById('busca-rapida'))?.value || '';
    const btnLimpar = doc.getElementById('btn-limpar-busca') || document.getElementById('btn-limpar-busca');
    if (btnLimpar) btnLimpar.style.display = val ? 'flex' : 'none';
    indiceFocadoTeclado = 0;
    clearTimeout(_timerDebounceBusca);
    _timerDebounceBusca = setTimeout(() => renderizarCards(), 85);
}

function limparBuscaRapida() {
    const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
    const input = doc.getElementById('busca-rapida') || document.getElementById('busca-rapida');
    if (!input) return;
    input.value = '';
    const btnLimpar = doc.getElementById('btn-limpar-busca') || document.getElementById('btn-limpar-busca');
    if (btnLimpar) btnLimpar.style.display = 'none';
    indiceFocadoTeclado = 0;
    renderizarCards();
    input.focus();
}

function renderizarCards() {
    const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
    const grid = doc.getElementById('grid-respostas') || document.getElementById('grid-respostas');
    if (!grid) return;

    grid.className = `cards-grid ${modoCompacto ? 'modo-compacto' : ''}`;
    const btnTxt = doc.getElementById('txt-view-mode');
    if (btnTxt) btnTxt.innerText = modoCompacto ? "Expandir" : "Compactar";
    const busca = ((doc.getElementById('busca-rapida') || document.getElementById('busca-rapida'))?.value || "").toLowerCase().trim();

    let filtrados = listaScripts.filter(item => item.categoria !== 'Prompts IA').filter(item => {
        if (categoriaAtiva === 'Favoritos' && !item.favorito) return false;
        if (categoriaAtiva !== 'todas' && categoriaAtiva !== 'Favoritos' && item.categoria !== categoriaAtiva) return false;

        if (!busca) return true;
        return (
            item.titulo.toLowerCase().includes(busca) ||
            item.texto.toLowerCase().includes(busca) ||
            (item.atalho && item.atalho.toLowerCase().includes(busca))
        );
    });

    filtrados.sort((a, b) => {
        if (b.favorito !== a.favorito) return b.favorito ? 1 : -1;
        return (b.usos || 0) - (a.usos || 0);
    });

    idsVisiveisNoMomento = filtrados.map(f => f.id);
    if (indiceFocadoTeclado >= idsVisiveisNoMomento.length) indiceFocadoTeclado = 0;

    const frag = doc.createDocumentFragment();

    filtrados.forEach((item, index) => {
        const previewHtml = modoCompacto ? '' : processarTexto(item.texto, true);
        const atalhoTag = item.atalho ? `<span class="shortcut-code">${item.atalho}</span>` : '';
        const isFocado = (busca !== '' && index === indiceFocadoTeclado) ? 'teclado-focado' : '';

        const card = doc.createElement('div');
        card.id = `card-resp-${item.id}`;
        card.className = `glass-card response-card ${item.favorito ? 'pinned' : ''} ${isFocado}`;
        card.setAttribute('data-tip', 'Clique para copiar');

        card.onclick = () => copiarScriptPorId(item.id);
        card.oncontextmenu = (e) => {
            e.preventDefault();
            toggleAjusteInline(item.id);
        };

        card.innerHTML = `
            <div class="card-top">
                <div class="card-title-wrap">
                    ${atalhoTag}
                    <span class="card-title">${item.titulo}</span>
                </div>
                <div class="card-mini-actions" onclick="event.stopPropagation()">
                    <button id="btn-inline-${item.id}" class="icon-btn" data-tip="Editar somente o texto aqui na caixinha" onclick="toggleAjusteInline(${item.id})">
                        <span class="material-icons-round">edit_note</span>
                    </button>
                    <button class="icon-btn ${item.favorito ? 'pin-active' : ''}" data-tip="Fixar no topo" onclick="toggleFavorito(${item.id})">
                        <span class="material-icons-round">push_pin</span>
                    </button>
                    <button class="icon-btn" data-tip="Editar título, atalho e resposta" onclick="editarScript(${item.id})">
                        <span class="material-icons-round">edit</span>
                    </button>
                    <button class="icon-btn" data-tip="Excluir" onclick="excluirScript(${item.id})">
                        <span class="material-icons-round">delete</span>
                    </button>
                </div>
            </div>
            <div class="card-body" id="body-preview-${item.id}">${previewHtml}</div>
        `;
        frag.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);
}

function toggleAjusteInline(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;

    const doc = (typeof obterDocAtivo === 'function') ? obterDocAtivo() : document;
    const card = doc.getElementById(`card-resp-${id}`);
    const bodyPreview = doc.getElementById(`body-preview-${id}`);
    const btnIcon = doc.getElementById(`btn-inline-${id}`);
    if (!card || !bodyPreview) return;

    let boxTweak = doc.getElementById(`box-tweak-${id}`);
    if (!boxTweak) {
        // Criação sob demanda (lazy): evita 74 textareas ocultas no DOM!
        boxTweak = doc.createElement('div');
        boxTweak.id = `box-tweak-${id}`;
        boxTweak.className = 'inline-tweak-box';
        boxTweak.style.display = 'none';
        boxTweak.onclick = (e) => e.stopPropagation();
        boxTweak.innerHTML = `
            <textarea id="textarea-tweak-${id}" class="inline-tweak-area" rows="4"></textarea>
            <div style="display: flex; gap: 6px;">
                <button class="btn-copy-tweak" style="flex: 1;" onclick="copiarScriptPorId(${id})">
                    <span class="material-icons-round" style="font-size: 14px;">content_copy</span> COPIAR TEXTO
                </button>
                <button class="btn-reset-mini" data-tip="Salvar alteração no texto padrão" onclick="salvarEdicaoInlinePermanente(${id})">
                    <span class="material-icons-round" style="font-size: 14px; color: var(--neon-blue);">save</span>
                </button>
                <button class="btn-reset-mini" data-tip="Fechar caixinha" onclick="toggleAjusteInline(${id})">
                    <span class="material-icons-round" style="font-size: 14px;">close</span>
                </button>
            </div>
        `;
        card.appendChild(boxTweak);
    }

    const textarea = doc.getElementById(`textarea-tweak-${id}`);
    if (boxTweak.style.display === 'none') {
        textarea.value = processarTexto(item.texto, false);
        boxTweak.style.display = 'flex';
        bodyPreview.style.display = 'none';
        btnIcon?.classList.add('inline-active');
        textarea.focus();
    } else {
        boxTweak.style.display = 'none';
        bodyPreview.style.display = '';
        btnIcon?.classList.remove('inline-active');
    }
}

function salvarEdicaoInlinePermanente(id) {
    const item = listaScripts.find(s => s.id === id);
    const textarea = document.getElementById(`textarea-tweak-${id}`);
    if (!item || !textarea) return;

    item.texto = textarea.value.trim();
    salvarNoCacheESupabase(item);
    renderizarCards();
    mostrarToast("Texto atualizado permanentemente!");
}

// ==============================================================
// ESTÚDIO DE ENGENHARIA DE PROMPTS DE IA (PARAMETRIZADO E INTERATIVO)
// ==============================================================
let filtroEspecialidadeIA = 'todos';

// Estado vivo dos parâmetros do seu Prompt Imobiliário
let configPromptImobiliario = {
    regraUnidade: "invertida", // invertida (01 - 101), blocoLetra (A - 101), semZero (303), livre
    regraCustom: "Bloco 01 - Apto 101",
    folhasPorVez: "2 em 2 folhas"
};

const PROMPTS_MESTRES_DEFAULT = [
    {
        id: 9001,
        categoria: "Prompts IA",
        especialidade: "Extração & Dados",
        atalho: "/pdf-unidades",
        titulo: "🏢 Motor Imobiliário: Extração de Unidades PDF ➔ 11 Colunas (Seu Condomínio)",
        texto: `Atue como um assistente especializado em migração de dados imobiliários. Vou enviar arquivos PDF de contatos de unidades e você deve extrair os dados seguindo estritamente estas regras:

1. Formatação das Colunas (Igual ao Sistema)
Gere uma tabela com as seguintes colunas, nesta ordem exata:
Unidade | Limpar Unidade | Unidade Tipo | Principal | Mora Unidade | Responsável | Locatário | Nome | CPF/CNPJ | E-mail | Telefones

2. Regras de Preenchimento de Dados
• Unidade: {{ESTRUTURA_UNIDADE}}
• Limpar Unidade: Deixe sempre em branco.
• Unidade Tipo: Preencha conforme o PDF (Geralmente 'Proprietário'), se for Locatário preencha (Morador) e sendo morador, deixe a coluna Principal em branco e preencha Locatário com 'Sim'.
• Principal: Se for Proprietário, preencha sempre como 'Sim', se for Residente, deixe sempre em branco.
• Mora Unidade: Preencha sempre com 'Sim'.
• Responsável: Escreva 'Sim' apenas se o termo 'Responsável' aparecer junto ao nome no PDF. Caso contrário, deixe em branco.
• Nome: Converta todos os nomes para LETRA DE FORMA (MAIÚSCULAS).
• Residente: Se houver o termo "residente", ele será considerado um morador.
• CPF/CNPJ: Mantenha a identidade absoluta do documento. OBRIGATÓRIO: Adicione um apóstrofo (') antes do número (ex: '075...) para que o Excel não remova o zero inicial.
• Telefones: Se houver mais de um número para a mesma pessoa, coloque-os na mesma célula separados por vírgula. Use o apóstrofo (') se o número começar com zero.

3. Organização da Resposta
• Processe o arquivo seguindo a sequência exata das linhas do PDF, sem excluir ninguém.
• OBS: sempre que a unidade estiver em branco, repita a unidade que estiver acima dela, incluindo na tabela.
• Divida a resposta de {{PAGINACAO}}.
• Aguarde meu 'OK' após cada lote para gerar a próxima parte.`
    },
    {
        id: 9002,
        categoria: "Prompts IA",
        especialidade: "Customer Success",
        atalho: "/cs-blindagem",
        titulo: "🛡️ Blindagem Customer Success: Acalmar Síndico / Transformar Resposta Técnica",
        texto: `Atue como um Especialista Sênior em Customer Success da plataforma "Seu Condomínio".
Reescreva e lapide o meu rascunho de resposta abaixo para enviar a um cliente (Síndico ou Administradora), mantendo:
1. Tom extremamente empático, calmo, seguro e resolutivo (transmitindo parceria e domínio técnico).
2. Passo a passo numerado e visualmente limpo (fácil de ler no WhatsApp/Chat).
3. Sem parecer robótico e sem prometer prazos de desenvolvimento que fogem ao suporte N1/N2.

{{DADOS_ANEXADOS}}`
    },
    {
        id: 9003,
        categoria: "Prompts IA",
        especialidade: "Auditoria & Erros",
        atalho: "/auditar-ofx",
        titulo: "🔍 Auditor de Divergência Financeira (Retorno Bancário / OFX / Boletos)",
        texto: `Atue como um Auditor Financeiro de Sistemas Condominiais. Analise os dados/relato abaixo de divergência entre o extrato bancário e o sistema Seu Condomínio:
1. Identifique se a causa raiz é cruzamento de datas no arquivo OFX, boleto excluído sem baixa de remessa no banco, ou conciliação a menor (juros/multa).
2. Gere uma explicação clara e mastigada para eu enviar ao administrador do condomínio com o plano de ação exato no painel Financeiro > Cobranças.

{{DADOS_ANEXADOS}}`
    }
];

function garantirPromptsMestresNaBase() {
    let mudou = false;
    PROMPTS_MESTRES_DEFAULT.forEach(def => {
        const existe = listaScripts.find(s => s.id === def.id);
        if (!existe) {
            listaScripts.push({ ...def, favorito: true, usos: 10 });
            mudou = true;
        } else if (def.id === 9001 && !existe.texto.includes('{{ESTRUTURA_UNIDADE}}')) {
            // Atualiza o prompt 9001 antigo para a versão com variáveis vivas!
            existe.titulo = def.titulo;
            existe.texto = def.texto;
            existe.especialidade = def.especialidade;
            mudou = true;
        }
    });
    if (mudou) salvarNoCacheESupabase();
}

function obterTextoRegraUnidade() {
    switch (configPromptImobiliario.regraUnidade) {
        case 'invertida':
            return "Apenas o número e hífen invertendo Bloco para a frente (remova termos como ADM1200; exemplo: quando no PDF for '101 01', na planilha terá que ser '01 - 101'; quando for '201 02', terá que ser '02 - 201', seguindo rigorosamente essa estrutura).";
        case 'blocoLetra':
            return "Padronize como 'LETRA_DO_BLOCO - UNIDADE' (exemplo: se estiver no BLOCO A e unidade 002 ou 2, formate como 'A - 02'; se for 101, formate como 'A - 101', mantendo térreo com 2 dígitos e andares com 3 dígitos).";
        case 'semZero':
            return "Remova zeros à esquerda de unidades centenárias (exemplo: se no PDF estiver '0303', converta para '303'; se estiver 'Bloco 4 Apto 401', converta para '04 - 401').";
        case 'custom':
            return `Siga rigorosamente esta máscara de parametrização para as unidades: ${configPromptImobiliario.regraCustom}. Remova códigos administrativos estranhos (como ADM1200).`;
        default:
            return "Mantenha o número limpo da unidade conforme o documento.";
    }
}

function compilarPromptIA(item, paraHtml = false, idCard = null) {
    let txt = item.texto;
    const regraUnid = obterTextoRegraUnidade();
    const paginacao = configPromptImobiliario.folhasPorVez;

    if (paraHtml) {
        txt = txt.replace(/\{\{ESTRUTURA_UNIDADE\}\}/g, `<span class="ai-token-live">${regraUnid}</span>`);
        txt = txt.replace(/\{\{PAGINACAO\}\}/g, `<span class="ai-token-live">${paginacao}</span>`);
        txt = txt.replace(/\{\{DADOS_ANEXADOS\}\}/g, `<span class="ai-token-live">[Os dados que você colar na gaveta abaixo entrarão automaticamente aqui]</span>`);
    } else {
        txt = txt.replace(/\{\{ESTRUTURA_UNIDADE\}\}/g, regraUnid);
        txt = txt.replace(/\{\{PAGINACAO\}\}/g, paginacao);

        const dadosInput = idCard ? document.getElementById(`payload-input-${idCard}`)?.value.trim() : "";
        if (dadosInput) {
            if (txt.includes('{{DADOS_ANEXADOS}}')) {
                txt = txt.replace(/\{\{DADOS_ANEXADOS\}\}/g, `\n--- DADOS / TEXTO PARA ANÁLISE ---\n${dadosInput}`);
            } else {
                txt += `\n\n--- DADOS / TEXTO PARA PROCESSAR ---\n${dadosInput}`;
            }
        } else {
            txt = txt.replace(/\{\{DADOS_ANEXADOS\}\}/g, "");
        }
    }
    return txt.trim();
}

function filtrarPromptsIA(esp, btnEl) {
    filtroEspecialidadeIA = esp;
    document.querySelectorAll('.ai-cat-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderizarPrompts();
}

function renderizarPrompts() {
    garantirPromptsMestresNaBase();
    const grid = document.getElementById('grid-prompts');
    if (!grid) return;
    grid.innerHTML = '';

    const prompts = listaScripts.filter(s => s.categoria === 'Prompts IA').filter(p => {
        if (filtroEspecialidadeIA === 'todos') return true;
        return (p.especialidade || 'Extração & Dados') === filtroEspecialidadeIA;
    });

    prompts.forEach(p => {
        const temParametrosImobiliarios = p.texto.includes('{{ESTRUTURA_UNIDADE}}') || p.texto.includes('{{PAGINACAO}}');
        const previewHtml = compilarPromptIA(p, true, p.id);

        const card = document.createElement('div');
        card.id = `card-resp-${p.id}`;
        card.className = 'ai-workstation-card';

        card.innerHTML = `
            <div class="ai-ws-header">
                <div class="ai-ws-title-group">
                    <span class="shortcut-code">${p.atalho || '/ia'}</span>
                    <span class="card-title" style="font-size: 14px;">${p.titulo}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="ai-spec-tag">${p.especialidade || 'Engenharia IA'}</span>
                    <button class="icon-btn" data-tip="Editar estrutura deste Prompt" onclick="editarPromptIA(${p.id})">
                        <span class="material-icons-round">edit</span>
                    </button>
                    <button class="icon-btn" data-tip="Excluir Prompt" onclick="excluirScript(${p.id})">
                        <span class="material-icons-round">delete</span>
                    </button>
                </div>
            </div>

            ${temParametrosImobiliarios ? `
                <!-- BARRA VIVA DE PARAMETRIZAÇÃO DE UNIDADE E FOLHAS -->
                <div class="ai-live-params" onclick="event.stopPropagation()">
                    <div class="ai-param-group">
                        <label>🏢 Estrutura da Unidade:</label>
                        <select class="ai-param-select" onchange="atualizarParametroImob('regraUnidade', this.value)">
                            <option value="invertida" ${configPromptImobiliario.regraUnidade === 'invertida' ? 'selected' : ''}>101 01 ➔ 01 - 101 (Bloco na frente)</option>
                            <option value="blocoLetra" ${configPromptImobiliario.regraUnidade === 'blocoLetra' ? 'selected' : ''}>Bloco A / 002 ➔ A - 02 (Araguaia)</option>
                            <option value="semZero" ${configPromptImobiliario.regraUnidade === 'semZero' ? 'selected' : ''}>0303 ➔ 303 / Bloco 4 ➔ 04 - 401</option>
                            <option value="custom" ${configPromptImobiliario.regraUnidade === 'custom' ? 'selected' : ''}>✏️ Regra Personalizada...</option>
                        </select>
                    </div>

                    ${configPromptImobiliario.regraUnidade === 'custom' ? `
                        <div class="ai-param-group">
                            <input type="text" class="ai-param-input" value="${configPromptImobiliario.regraCustom}" placeholder="Ex: Bloco A - Apto 101" oninput="atualizarParametroImob('regraCustom', this.value, ${p.id})">
                        </div>
                    ` : ''}

                    <div class="ai-param-group">
                        <label>📄 Divisão:</label>
                        <select class="ai-param-select" onchange="atualizarParametroImob('folhasPorVez', this.value)">
                            <option value="2 em 2 folhas" ${configPromptImobiliario.folhasPorVez === '2 em 2 folhas' ? 'selected' : ''}>De 2 em 2 folhas (Seguro)</option>
                            <option value="3 em 3 folhas" ${configPromptImobiliario.folhasPorVez === '3 em 3 folhas' ? 'selected' : ''}>De 3 em 3 folhas</option>
                            <option value="5 em 5 folhas" ${configPromptImobiliario.folhasPorVez === '5 em 5 folhas' ? 'selected' : ''}>De 5 em 5 folhas (Rápido)</option>
                            <option value="1 folha por vez" ${configPromptImobiliario.folhasPorVez === '1 folha por vez' ? 'selected' : ''}>1 folha por vez</option>
                        </select>
                    </div>
                </div>
            ` : ''}

            <div class="ai-code-viewer" id="ai-viewer-${p.id}">${previewHtml}</div>

            <!-- GAVETA OPCIONAL PARA COLAR DADOS BRUTOS OU TEXTO DO CLIENTE -->
            <div id="payload-drawer-${p.id}" class="ai-payload-drawer" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 10px; font-weight: 800; color: var(--neon-yellow);">📥 ANEXAR TEXTO DO CLIENTE OU TRECHO DO PDF JUNTO AO PROMPT:</span>
                    <button class="btn-reset-mini" onclick="document.getElementById('payload-input-${p.id}').value=''">Limpar</button>
                </div>
                <textarea id="payload-input-${p.id}" rows="3" placeholder="Cole aqui a mensagem do cliente, log de erro ou dados brutos para já irem grudados no final do Prompt..."></textarea>
            </div>

            <div id="ai-direct-output-${p.id}" class="gemini-live-output" style="display:none; margin-top:4px;"></div>

            <div class="ai-ws-footer">
                <button class="btn-copy-prompt-master" onclick="copiarPromptCompilado(${p.id}, false)">
                    <span class="material-icons-round" style="font-size: 16px;">content_copy</span>
                    COPIAR PROMPT
                </button>
                <button class="btn-ai-launch" style="border-color:var(--neon-purple); color:#f5d0fe;" onclick="executarPromptDiretoNaAPI(${p.id})" data-tip="Executa este Prompt + Dados anexados direto na API do Gemini aqui dentro!">
                    <span class="material-icons-round" style="font-size: 15px; color: var(--neon-purple);">bolt</span>
                    Rodar na Gem Aqui
                </button>
                <button class="btn-ai-launch" onclick="toggleGavetaPayload(${p.id})" data-tip="Colar texto/dados para processar junto">
                    <span class="material-icons-round" style="font-size: 15px; color: var(--neon-yellow);">attach_file</span>
                    + Anexar Dados
                </button>
                <button class="btn-ai-launch" onclick="copiarPromptCompilado(${p.id}, true)" data-tip="Copia o prompt e abre o site do Gemini">
                    <span class="material-icons-round" style="font-size: 15px; color: #38bdf8;">rocket_launch</span>
                    Abrir Gemini
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function atualizarParametroImob(chave, valor, idCardEspecifico = null) {
    configPromptImobiliario[chave] = valor;
    if (chave === 'regraCustom' && idCardEspecifico) {
        const item = listaScripts.find(s => s.id === idCardEspecifico);
        const viewer = document.getElementById(`ai-viewer-${idCardEspecifico}`);
        if (item && viewer) viewer.innerHTML = compilarPromptIA(item, true, idCardEspecifico);
    } else {
        renderizarPrompts();
    }
}

function toggleGavetaPayload(id) {
    const gaveta = document.getElementById(`payload-drawer-${id}`);
    if (!gaveta) return;
    const abrir = gaveta.style.display === 'none';
    gaveta.style.display = abrir ? 'flex' : 'none';
    if (abrir) document.getElementById(`payload-input-${id}`)?.focus();
}

function copiarPromptCompilado(id, abrirGemini = false) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;

    const textoFinal = compilarPromptIA(item, false, id);
    navigator.clipboard.writeText(textoFinal);

    item.usos = (item.usos || 0) + 1;
    salvarNoCacheESupabase(item);

    const cardEl = document.getElementById(`card-resp-${id}`);
    if (cardEl) {
        cardEl.classList.add('copiado-flash');
        setTimeout(() => cardEl.classList.remove('copiado-flash'), 500);
    }

    mostrarToast(`🤖 Prompt "${item.titulo}" copiado com seus parâmetros!`);
    if (abrirGemini) {
        setTimeout(() => window.open('https://gemini.google.com/app', '_blank'), 300);
    }
}

async function executarPromptDiretoNaAPI(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;

    const doc = obterDocAtivo();
    const outBox = doc.getElementById(`ai-direct-output-${id}`);
    if (!outBox) return;

    const promptCompleto = compilarPromptIA(item, false, id);
    outBox.style.display = 'block';
    outBox.innerHTML = `⏳ <em>Processando na API do Gemini...</em>`;

    try {
        const resposta = await chamarMotorGeminiAPI(promptCompleto, false);
        await copiarTextoUniversal(resposta);
        outBox.innerHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><strong style="color:var(--neon-green);">✓ RESULTADO GERADO PELA GEM (JÁ COPIADO PRO SEU CTRL+V):</strong> <button class="btn-reset-mini" style="padding:1px 6px; font-size:9px;" onclick="this.parentElement.parentElement.style.display='none'">Fechar</button></div>${resposta.replace(/</g, '&lt;')}`;
        mostrarToast("🤖 Prompt executado na Gem e resultado copiado!");
    } catch (err) {
        outBox.innerHTML = `<span style="color:#f87171;">⚠️ ${err.message} (Clique em "IA Gem" no topo da aba Respostas Rápidas para colar sua API Key!)</span>`;
    }
}


// ==============================================================
// MODAL EXCLUSIVO DE ARQUITETURA DE PROMPTS IA
// ==============================================================
function abrirModalPromptIA() {
    document.getElementById('ai-prompt-id').value = '';
    document.getElementById('ai-prompt-titulo').value = '';
    document.getElementById('ai-prompt-especialidade').value = 'Extração & Dados';
    document.getElementById('ai-prompt-atalho').value = '/ia-';
    document.getElementById('ai-prompt-texto').value = '';
    document.getElementById('modal-prompt-ia').style.display = 'flex';
    document.getElementById('ai-prompt-titulo').focus();
}

function editarPromptIA(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;
    document.getElementById('ai-prompt-id').value = item.id;
    document.getElementById('ai-prompt-titulo').value = item.titulo;
    document.getElementById('ai-prompt-especialidade').value = item.especialidade || 'Extração & Dados';
    document.getElementById('ai-prompt-atalho').value = item.atalho || '/ia';
    document.getElementById('ai-prompt-texto').value = item.texto;
    document.getElementById('modal-prompt-ia').style.display = 'flex';
}

function fecharModalPromptIA() {
    document.getElementById('modal-prompt-ia').style.display = 'none';
}

function inserirBlocoPrompt(bloco) {
    const area = document.getElementById('ai-prompt-texto');
    const ini = area.selectionStart;
    const fim = area.selectionEnd;
    const atual = area.value;
    area.value = atual.substring(0, ini) + bloco + atual.substring(fim);
    area.focus();
    area.selectionEnd = ini + bloco.length;
}

function salvarPromptIA() {
    const idExistente = document.getElementById('ai-prompt-id').value;
    const titulo = document.getElementById('ai-prompt-titulo').value.trim();
    const especialidade = document.getElementById('ai-prompt-especialidade').value;
    const atalho = document.getElementById('ai-prompt-atalho').value.trim();
    const texto = document.getElementById('ai-prompt-texto').value.trim();

    if (!titulo || !texto) return mostrarToast("Preencha o Nome e a Estrutura do Prompt!");

    let salvo;
    if (idExistente) {
        salvo = listaScripts.find(s => s.id == idExistente);
        if (salvo) {
            salvo.titulo = titulo;
            salvo.especialidade = especialidade;
            salvo.atalho = atalho;
            salvo.texto = texto;
        }
    } else {
        salvo = {
            id: Date.now(),
            categoria: 'Prompts IA',
            especialidade,
            atalho,
            titulo,
            texto,
            favorito: true,
            usos: 1
        };
        listaScripts.unshift(salvo);
    }

    salvarNoCacheESupabase(salvo);
    fecharModalPromptIA();
    renderizarPrompts();
    mostrarToast("🤖 Motor de Prompt IA salvo com sucesso!");
}

// ==============================================================
// 7. CÓPIA COM 1 CLIQUE + NAVEGAÇÃO POR TECLADO
// ==============================================================
function copiarScriptPorId(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;

    const boxTweak = document.getElementById(`box-tweak-${id}`);
    const textareaTweak = document.getElementById(`textarea-tweak-${id}`);
    let textoPronto = "";

    if (boxTweak && boxTweak.style.display !== 'none' && textareaTweak.value.trim() !== '') {
        textoPronto = textareaTweak.value;
        boxTweak.style.display = 'none';
        document.getElementById(`body-preview-${id}`).style.display = '';
        document.getElementById(`btn-inline-${id}`)?.classList.remove('inline-active');
    } else {
        textoPronto = item.categoria === 'Prompts IA' ? item.texto : processarTexto(item.texto, false);
    }

    navigator.clipboard.writeText(textoPronto);

    item.usos = (item.usos || 0) + 1;
    salvarNoCacheESupabase(item);

    const cardEl = document.getElementById(`card-resp-${id}`);
    if (cardEl) {
        cardEl.classList.add('copiado-flash');
        setTimeout(() => cardEl.classList.remove('copiado-flash'), 400);
    }

    mostrarToast(`✓ Copiado: "${item.titulo}"`);
}

function navegarBuscaTeclado(e) {
    if (idsVisiveisNoMomento.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        indiceFocadoTeclado = (indiceFocadoTeclado + 1) % idsVisiveisNoMomento.length;
        renderizarCards();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        indiceFocadoTeclado = (indiceFocadoTeclado - 1 + idsVisiveisNoMomento.length) % idsVisiveisNoMomento.length;
        renderizarCards();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        copiarScriptPorId(idsVisiveisNoMomento[indiceFocadoTeclado] || idsVisiveisNoMomento[0]);
        document.getElementById('busca-rapida').select();
    } else if (e.key === 'Escape') {
        limparBuscaRapida();
    }
}

// ==============================================================
// 8. CRUD + SUPABASE (OTIMIZADO: 1 CHAVE + DEBOUNCE EM CONTADOR)
// ==============================================================
let _timerSaveCacheLocal = null;

function salvarNoCacheESupabase(itemModificado = null, apenasContador = false) {
    const persistirLocal = () => {
        try {
            localStorage.setItem('sc_cockpit_scripts_v5', JSON.stringify(listaScripts));
        } catch (e) {}
    };

    if (apenasContador) {
        clearTimeout(_timerSaveCacheLocal);
        _timerSaveCacheLocal = setTimeout(persistirLocal, 600);
    } else {
        clearTimeout(_timerSaveCacheLocal);
        persistirLocal();
    }

    if (supabaseClient && itemModificado) {
        supabaseClient.from('sc_respostas_rapidas').upsert({
            id: itemModificado.id,
            categoria: itemModificado.categoria,
            atalho: itemModificado.atalho || '',
            titulo: itemModificado.titulo,
            texto: itemModificado.texto,
            favorito: !!itemModificado.favorito,
            usos: itemModificado.usos || 0
        }).then(() => {});
    }
}

async function sincronizarComNuvem() {
    if (!supabaseClient) return mostrarToast("Supabase offline.");
    mostrarToast("Sincronizando com o Supabase...");

    try {
        const payload = listaScripts.map(s => ({
            id: s.id,
            categoria: s.categoria,
            atalho: s.atalho || '',
            titulo: s.titulo,
            texto: s.texto,
            favorito: !!s.favorito,
            usos: s.usos || 0
        }));

        const { error: errUp } = await supabaseClient.from('sc_respostas_rapidas').upsert(payload);
        if (errUp) throw errUp;

        const { data, error: errDown } = await supabaseClient.from('sc_respostas_rapidas').select('*');
        if (errDown) throw errDown;

        if (data && data.length > 0) {
            listaScripts = data;
            localStorage.setItem('sc_cockpit_scripts_v4', JSON.stringify(listaScripts));
            renderizarPillsCategorias();
            renderizarCards();
        }
        const qtdCardsAtendimento = listaScripts.filter(s => s.categoria !== 'Prompts IA').length;
        mostrarToast(`Sincronizado! ${qtdCardsAtendimento} cards na nuvem.`);
    } catch (err) {
        mostrarToast("Salvo no PC!");
    }
}

function toggleFavorito(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;
    item.favorito = !item.favorito;
    salvarNoCacheESupabase(item);
    renderizarPillsCategorias();
    renderizarCards();
}

function toggleMenuCategoriasModal(e) {
    e.stopPropagation();
    const menu = document.getElementById('custom-cat-dropdown');
    const aberto = menu.style.display === 'flex';
    menu.style.display = aberto ? 'none' : 'flex';
    if (!aberto) {
        renderizarOpcoesCategoriaModal();
        document.getElementById('input-nova-cat-inline').focus();
    }
}

document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('wrapper-custom-cat');
    const menu = document.getElementById('custom-cat-dropdown');
    if (menu && wrapper && !wrapper.contains(e.target)) {
        menu.style.display = 'none';
    }
});

function selecionarCategoriaModal(idCat) {
    const catObj = CATEGORIAS_OFICIAIS.find(c => c.id === idCat) || { id: idCat, label: idCat };
    document.getElementById('script-categoria').value = catObj.id;
    document.getElementById('cat-selecionada-label').innerText = catObj.label;
    document.getElementById('custom-cat-dropdown').style.display = 'none';
}

function renderizarOpcoesCategoriaModal() {
    const container = document.getElementById('lista-opcoes-cat');
    if (!container) return;
    const catAtual = document.getElementById('script-categoria').value;
    container.innerHTML = '';

    CATEGORIAS_OFICIAIS.filter(c => !c.fixa).forEach(cat => {
        const row = document.createElement('div');
        row.className = `cat-option-row ${cat.id === catAtual ? 'selecionada' : ''}`;
        row.onclick = () => selecionarCategoriaModal(cat.id);

        row.innerHTML = `
            <span id="label-cat-item-${cat.id}" style="flex:1;">${cat.label}</span>
            ${cat.id !== 'Prompts IA' ? `
                <div class="cat-row-actions" onclick="event.stopPropagation()">
                    <button type="button" class="cat-mini-btn" title="Editar nome da categoria" onclick="editarNomeCategoriaInline('${cat.id}')">
                        <span class="material-icons-round" style="font-size:13px;">edit</span>
                    </button>
                    <button type="button" class="cat-mini-btn del" title="Excluir categoria" onclick="excluirCategoriaInline('${cat.id}')">
                        <span class="material-icons-round" style="font-size:13px;">delete</span>
                    </button>
                </div>
            ` : ''}
        `;
        container.appendChild(row);
    });
}

function criarCategoriaInline() {
    const input = document.getElementById('input-nova-cat-inline');
    const nome = input.value.trim();
    if (!nome) return mostrarToast("Digite o nome da nova categoria!");

    // Usa o próprio nome como ID limpo
    const novoId = nome.replace(/^[^\wÀ-ú]+/, '').trim() || nome;
    if (CATEGORIAS_OFICIAIS.some(c => c.id.toLowerCase() === novoId.toLowerCase())) {
        return mostrarToast("Essa categoria já existe!");
    }

    // Insere antes do Prompts IA para aparecer na barra da tela inicial
    const idxPrompts = CATEGORIAS_OFICIAIS.findIndex(c => c.id === 'Prompts IA');
    const novaCat = { id: novoId, label: nome };
    if (idxPrompts !== -1) CATEGORIAS_OFICIAIS.splice(idxPrompts, 0, novaCat);
    else CATEGORIAS_OFICIAIS.push(novaCat);

    input.value = '';
    salvarCategoriasCustom();
    selecionarCategoriaModal(novoId);
    mostrarToast(`Categoria "${nome}" criada e adicionada na tela inicial!`);
}

function editarNomeCategoriaInline(idCat) {
    const cat = CATEGORIAS_OFICIAIS.find(c => c.id === idCat);
    if (!cat) return;

    const spanEl = document.getElementById(`label-cat-item-${idCat}`);
    if (!spanEl) return;

    // Transforma o próprio item na lista em um input editável (sem prompt feio do navegador!)
    spanEl.innerHTML = `<input type="text" id="edit-cat-input-${idCat}" value="${cat.label}" style="background:#020308; color:#fef08a; border:1px dashed var(--neon-blue); padding:3px 6px; border-radius:5px; font-size:11.5px; width:90%; outline:none;" onclick="event.stopPropagation()">`;
    const inputEdit = document.getElementById(`edit-cat-input-${idCat}`);
    inputEdit.focus();
    inputEdit.select();

    const confirmarEdicao = () => {
        const novoLabel = inputEdit.value.trim();
        if (novoLabel) {
            const idAntigo = cat.id;
            const novoId = novoLabel.replace(/^[^\wÀ-ú]+/, '').trim() || novoLabel;
            cat.label = novoLabel;
            cat.id = novoId;

            // Atualiza automaticamente todos os cards que pertenciam a essa categoria!
            listaScripts.forEach(s => {
                if (s.categoria === idAntigo) s.categoria = novoId;
            });
            if (categoriaAtiva === idAntigo) categoriaAtiva = novoId;
            salvarNoCacheESupabase();
            salvarCategoriasCustom();
            selecionarCategoriaModal(novoId);
            mostrarToast("Categoria atualizada em todo o sistema!");
        } else {
            renderizarOpcoesCategoriaModal();
        }
    };

    inputEdit.onkeydown = (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); confirmarEdicao(); }
        if (ev.key === 'Escape') { renderizarOpcoesCategoriaModal(); }
    };
    inputEdit.onblur = confirmarEdicao;
}

function excluirCategoriaInline(idCat) {
    const restantes = CATEGORIAS_OFICIAIS.filter(c => !c.fixa && c.id !== 'Prompts IA');
    if (restantes.length <= 1) return mostrarToast("Mantenha ao menos 1 categoria ativa!");

    CATEGORIAS_OFICIAIS = CATEGORIAS_OFICIAIS.filter(c => c.id !== idCat);
    const primeiraValida = CATEGORIAS_OFICIAIS.find(c => !c.fixa)?.id || 'Saudação';

    // Move os cards da categoria excluída para a primeira disponível para não perder nada
    listaScripts.forEach(s => {
        if (s.categoria === idCat) s.categoria = primeiraValida;
    });
    if (categoriaAtiva === idCat) categoriaAtiva = 'todas';

    salvarNoCacheESupabase();
    salvarCategoriasCustom();
    selecionarCategoriaModal(primeiraValida);
    mostrarToast("Categoria removida!");
}

function abrirModalScript(catPadrao = 'Cadastros') {
    document.getElementById('script-id').value = '';
    document.getElementById('script-titulo').value = '';
    document.getElementById('script-atalho').value = '';
    document.getElementById('script-texto').value = '';
    selecionarCategoriaModal(catPadrao);
    document.getElementById('modal-script').style.display = 'flex';
    document.getElementById('script-titulo').focus();
}

function editarScript(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;
    document.getElementById('script-id').value = item.id;
    document.getElementById('script-titulo').value = item.titulo;
    document.getElementById('script-atalho').value = item.atalho || '';
    selecionarCategoriaModal(item.categoria);
    document.getElementById('script-texto').value = item.texto;
    document.getElementById('modal-script').style.display = 'flex';
}

function fecharModalScript() {
    document.getElementById('modal-script').style.display = 'none';
}

function inserirTagNoEditor(tag) {
    const textarea = document.getElementById('script-texto');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textoAtual = textarea.value;
    textarea.value = textoAtual.substring(0, start) + tag + textoAtual.substring(end);
    textarea.focus();
    textarea.selectionEnd = start + tag.length;
}

function salvarScript() {
    const idExistente = document.getElementById('script-id').value;
    const titulo = document.getElementById('script-titulo').value.trim();
    const atalho = document.getElementById('script-atalho').value.trim();
    const categoria = document.getElementById('script-categoria').value;
    const texto = document.getElementById('script-texto').value.trim();

    if (!titulo || !texto) return mostrarToast("Preencha título e texto!");

    let itemSalvo;
    if (idExistente) {
        itemSalvo = listaScripts.find(s => s.id == idExistente);
        if (itemSalvo) {
            itemSalvo.titulo = titulo;
            itemSalvo.atalho = atalho;
            itemSalvo.categoria = categoria;
            itemSalvo.texto = texto;
        }
    } else {
        itemSalvo = {
            id: Date.now(),
            categoria,
            atalho,
            titulo,
            texto,
            favorito: false,
            usos: 0
        };
        listaScripts.unshift(itemSalvo);
    }

    salvarNoCacheESupabase(itemSalvo);
    fecharModalScript();
    renderizarPillsCategorias();
    renderizarCards();
    mostrarToast("Resposta salva!");
}

function excluirScript(id) {
    listaScripts = listaScripts.filter(s => s.id !== id);
    localStorage.setItem('sc_cockpit_scripts_v4', JSON.stringify(listaScripts));
    if (supabaseClient) {
        supabaseClient.from('sc_respostas_rapidas').delete().eq('id', id).then(() => {});
    }
    renderizarPillsCategorias();
    renderizarCards();
    mostrarToast("Resposta removida.");
}

// ==============================================================
// 9. MODO COMPACTO, BACKUP E JANELA FLUTUANTE
// ==============================================================
function alternarModoVisualizacao() {
    modoCompacto = !modoCompacto;
    localStorage.setItem('sc_modo_compacto', modoCompacto ? 'true' : 'false');

    // Atualiza o botão e a grade tanto na tela principal quanto na flutuante!
    [document, (janelaPiPAtual && !janelaPiPAtual.closed) ? janelaPiPAtual.document : null].forEach(d => {
        if (!d) return;
        const lbl = d.getElementById('txt-view-mode');
        if (lbl) lbl.innerText = modoCompacto ? "Expandir" : "Compactar";
        const g = d.getElementById('grid-respostas');
        if (g) g.className = `cards-grid ${modoCompacto ? 'modo-compacto' : ''}`;
    });

    renderizarCards();
    mostrarToast(modoCompacto ? "📦 Cards compactados!" : "📖 Cards expandidos!");
}

// ==============================================================
// EXPORTADOR E IMPORTADOR EM .CSV (100% COMPATÍVEL COM O SUPABASE!)
// ==============================================================
function exportarBackupCSV() {
    const cabecalho = ['id', 'categoria', 'atalho', 'titulo', 'texto', 'favorito', 'usos'];
    
    const linhas = listaScripts.map(item => {
        const escaparCSV = (val) => {
            const str = String(val ?? '');
            // Duplica aspas internas e envolve o campo entre aspas duplas (Padrão RFC 4180 do Supabase)
            return `"${str.replace(/"/g, '""')}"`;
        };

        return [
            item.id,
            escaparCSV(item.categoria),
            escaparCSV(item.atalho || ''),
            escaparCSV(item.titulo),
            escaparCSV(item.texto),
            item.favorito ? 'true' : 'false',
            item.usos || 0
        ].join(',');
    });

    const conteudoCSV = [cabecalho.join(','), ...linhas].join('\n');
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `sc_respostas_rapidas_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    mostrarToast("Backup .CSV gerado! Pronto para o Supabase.");
}

// Lê tanto .CSV quanto .JSON caso você queira restaurar direto no site
function importarBackupArquivo(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
        const conteudo = e.target.result;
        try {
            if (file.name.endsWith('.json')) {
                const dados = JSON.parse(conteudo);
                if (Array.isArray(dados)) {
                    listaScripts = dados;
                }
            } else {
                // Parser inteligente de CSV com quebras de linha dentro das aspas
                const linhas = [];
                let linhaAtual = [];
                let campoAtual = '';
                let dentroDeAspas = false;

                for (let i = 0; i < conteudo.length; i++) {
                    const char = conteudo[i];
                    const prox = conteudo[i + 1];

                    if (char === '"' && dentroDeAspas && prox === '"') {
                        campoAtual += '"';
                        i++;
                    } else if (char === '"') {
                        dentroDeAspas = !dentroDeAspas;
                    } else if (char === ',' && !dentroDeAspas) {
                        linhaAtual.push(campoAtual);
                        campoAtual = '';
                    } else if ((char === '\n' || (char === '\r' && prox === '\n')) && !dentroDeAspas) {
                        if (char === '\r') i++;
                        linhaAtual.push(campoAtual);
                        linhas.push(linhaAtual);
                        linhaAtual = [];
                        campoAtual = '';
                    } else {
                        campoAtual += char;
                    }
                }
                if (campoAtual || linhaAtual.length > 0) {
                    linhaAtual.push(campoAtual);
                    linhas.push(linhaAtual);
                }

                // Remove o cabeçalho (linha 0) e monta os objetos
                const restaurados = [];
                for (let r = 1; r < linhas.length; r++) {
                    const col = linhas[r];
                    if (col.length >= 5 && col[3]) {
                        restaurados.push({
                            id: Number(col[0]) || (Date.now() + r),
                            categoria: col[1] || 'Saudação',
                            atalho: col[2] || '',
                            titulo: col[3],
                            texto: col[4],
                            favorito: col[5] === 'true',
                            usos: Number(col[6]) || 0
                        });
                    }
                }
                if (restaurados.length > 0) listaScripts = restaurados;
            }

            ['sc_cockpit_scripts_v3', 'sc_cockpit_scripts_v4', 'sc_cockpit_scripts_v5'].forEach(k => {
                localStorage.setItem(k, JSON.stringify(listaScripts));
            });

            renderizarPillsCategorias();
            renderizarCards();
            mostrarToast(`✓ ${listaScripts.length} respostas restauradas com sucesso!`);
        } catch (err) {
            mostrarToast("Erro ao ler o arquivo de backup.");
        }
    };

    reader.readAsText(file);
    event.target.value = '';
}


// ==============================================================
// SUPER JANELA FLUTUANTE (100% FUNCIONAL) + IA GEM COMPACTA + CÉREBRO CARDS
// ==============================================================
let janelaPiPAtual = null;
let vigiaFechamentoPiP = null;
let tomAtivoGem = 'amigavel'; // amigavel, padrao, sindico, passos, curto
let ultimaRespostaGeradaGem = '';

const ACOES_RAPIDAS_PADRAO = [
    {
        id: 'qa_saudar',
        icone: 'waving_hand',
        cor: '#6ee7b7',
        titulo: 'Saudar',
        texto: 'Olá, {saudacao} {nome}! Tudo bem? Em que posso ajudar?'
    },
    {
        id: 'qa_cond',
        icone: 'apartment',
        cor: '#fef08a',
        titulo: 'Pedir Cond.',
        texto: 'Para que eu possa localizar o cadastro e verificar no sistema, consegue me informar o nome do condomínio, por gentileza?'
    },
    {
        id: 'qa_email_print',
        icone: 'alternate_email',
        cor: '#f472b6',
        titulo: 'Pedir E-mail/Print',
        texto: 'Me informa o e-mail cadastrado e a unidade, por gentileza. Caso esteja aparecendo algum erro na tela, mande um print também para eu verificar!'
    },
    {
        id: 'qa_cnpj',
        icone: 'badge',
        cor: '#38bdf8',
        titulo: 'Pedir CNPJ/CPF',
        texto: 'Olá, {saudacao} {nome}! Consegue me informar o CNPJ do condomínio (ou CPF do titular) para que eu possa localizar o cadastro no sistema, por gentileza?'
    },
    {
        id: 'qa_comercial',
        icone: 'storefront',
        cor: '#c084fc',
        titulo: 'Transf. Comercial',
        texto: 'Olá, {saudacao} {nome}! Como essa solicitação envolve condições comerciais/contratuais, vou transferir o seu atendimento para o nosso Setor Comercial dar andamento com você, combinado? Só um instante!'
    }
];

let acoesSalvasCache = JSON.parse(localStorage.getItem('sc_acoes_rapidas_v1'));
let listaAcoesRapidas = (Array.isArray(acoesSalvasCache) && acoesSalvasCache.length > 0) ? acoesSalvasCache : ACOES_RAPIDAS_PADRAO;

let configGeminiGem = JSON.parse(localStorage.getItem('sc_gemini_gem_config')) || {
    apiKey: '',
    modelo: 'gemini-3.5-flash',
    instrucaoGem: ''
};

const INSTRUCAO_PROFISSIONAL_RICARDO = `Você É o próprio Ricardo Lima, especialista de suporte técnico da plataforma Seu Condomínio, conversando diretamente com o cliente no chat.
REGRAS INEGOCIÁVEIS DE IDENTIDADE E POSTURA:
1. NUNCA diga que é "assistente do Ricardo", "IA", "Gem" ou "robô". Escreva SEMPRE em 1ª pessoa ("Vou verificar", "Identifiquei aqui", "Me confirma por gentileza"), como se o próprio Ricardo estivesse digitando.
2. VÁ DIRETO PARA A RESPOSTA OU SOLUÇÃO. Zero apresentações ("Olá, aqui é o Ricardo..."), zero enrolação e zero frases robóticas.
3. Consulte sempre os Cards Oficiais do SC Smart Cockpit e as imagens/documentos anexados.
4. NÃO use asteriscos duplos (**) nas respostas porque o chat de atendimento não formata Markdown.
5. Dica técnica de cadastro/convite: Quando o convite do app chega com o nome do antigo proprietário, oriente a clicar em "Editar perfil", criar uma nova senha e depois acessar "Editar perfil" novamente para alterar os dados. Lembre à administração que ao trocar de morador/proprietário o correto é EXCLUIR o cadastro antigo e adicionar um novo.
6. Se faltar informação essencial para investigar (condomínio, unidade, e-mail ou print), peça de forma direta e gentil.`;

// Limpa automaticamente a instrução antiga do cache caso ainda fale "Gem especialista" ou "assistente"
if (!configGeminiGem.instrucaoGem || /Gem especialista|assistente do Ricardo/i.test(configGeminiGem.instrucaoGem)) {
    configGeminiGem.instrucaoGem = INSTRUCAO_PROFISSIONAL_RICARDO;
    localStorage.setItem('sc_gemini_gem_config', JSON.stringify(configGeminiGem));
}

function obterJanelaAtiva() {
    return (janelaPiPAtual && !janelaPiPAtual.closed) ? janelaPiPAtual : window;
}

function obterDocAtivo() {
    return (janelaPiPAtual && !janelaPiPAtual.closed) ? janelaPiPAtual.document : document;
}

// Espelha todas as funções do sistema na janela flutuante para que 100% dos botões funcionem lá dentro!
function sincronizarFuncoesParaJanelaPiP(pipWin) {
    if (!pipWin) return;
    const funcoesEssenciais = [
        'trocarPensamentoEspirita', 'ativarEdicaoFraseTopo', 'aoDigitarBusca',
        'navegarBuscaTeclado', 'limparBuscaRapida', 'alternarModoVisualizacao',
        'abrirModalScript', 'colarRapido', 'limparVariaveis', 'renderizarCards',
        'renderizarPillsCategorias', 'copiarScriptPorId', 'toggleAjusteInline',
        'salvarEdicaoInlinePermanente', 'toggleFavorito', 'editarScript',
        'excluirScript', 'toggleGavetaHUD', 'higienizarDadoCopiado',
        'toggleConfiguracaoAPIKeyHUD', 'salvarConfigGemHUD', 'selecionarTomGem',
        'salvarTextoRascunhoGem', 'executarGemNoHUD', 'colarDoClipboardNoInputGem',
        'limparCaixaGemHUD', 'copiarTextoUniversal', 'transformarRespostaGemEmCard',
        'salvarRespostaGemNoDiario', 'atualizarCampoAcaoRapida', 'removerAcaoRapida',
        'adicionarNovaAcaoRapida', 'restaurarAcoesRapidasPadrao', 'salvarRascunhoHUD',
        'copiarRascunhoHUD', 'dispararAcaoRapidaPorIndice', 'restaurarTelaPrincipalDoPiP',
        'mostrarToast', 'aoDigitarVariavelPersonalizacao', 'detectarDadosClienteNoTexto',
        'alternarModoVelocidadeGem', 'selecionarHistoricoGem', 'continuarAssuntoGem',
        'refinarRespostaGem', 'selecionarAbaChecklist', 'copiarPerguntaChecklist',
        'renderizarChecklistN1N2', 'renderizarHistoricoGemHUD', 'reagirAnjo'
    ];

    funcoesEssenciais.forEach(fnName => {
        if (typeof window[fnName] === 'function') {
            pipWin[fnName] = window[fnName];
        }
    });

    // Copia também qualquer outra função global declarada no window
    Object.keys(window).forEach(k => {
        try {
            if (typeof window[k] === 'function' && !pipWin[k]) {
                pipWin[k] = window[k];
            }
        } catch (e) {}
    });
}

// Garante que o botão Compactar/Expandir funcione tanto na tela normal quanto na flutuante e salve no F5!
alternarModoVisualizacao = function() {
    modoCompacto = !modoCompacto;
    localStorage.setItem('sc_modo_compacto', modoCompacto ? 'true' : 'false');
    const doc = obterDocAtivo();
    const lbl1 = doc.getElementById('txt-view-mode');
    const lbl2 = document.getElementById('txt-view-mode');
    if (lbl1) lbl1.innerText = modoCompacto ? "Expandir" : "Compactar";
    if (lbl2) lbl2.innerText = modoCompacto ? "Expandir" : "Compactar";
    renderizarCards();
};

async function copiarTextoUniversal(texto) {
    const win = obterJanelaAtiva();
    const doc = obterDocAtivo();

    try {
        if (win.navigator && win.navigator.clipboard) {
            await win.navigator.clipboard.writeText(texto);
            return true;
        }
    } catch (e) {}

    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch (e) {}

    const tempArea = doc.createElement('textarea');
    tempArea.value = texto;
    tempArea.style.cssText = 'position:fixed; top:-9999px; left:-9999px; opacity:0;';
    doc.body.appendChild(tempArea);
    tempArea.focus();
    tempArea.select();
    doc.execCommand('copy');
    tempArea.remove();
    return true;
}

async function lerTextoUniversalClipboard() {
    const win = obterJanelaAtiva();
    try {
        if (win.navigator && win.navigator.clipboard) {
            return await win.navigator.clipboard.readText();
        }
    } catch (e) {}
    try {
        return await navigator.clipboard.readText();
    } catch (e) {
        return "";
    }
}

copiarScriptPorId = function(id) {
    const item = listaScripts.find(s => s.id === id);
    if (!item) return;

    const doc = obterDocAtivo();
    const boxTweak = doc.getElementById(`box-tweak-${id}`);
    const textareaTweak = doc.getElementById(`textarea-tweak-${id}`);
    let textoPronto = "";

    if (boxTweak && boxTweak.style.display !== 'none' && textareaTweak.value.trim() !== '') {
        textoPronto = textareaTweak.value;
        boxTweak.style.display = 'none';
        doc.getElementById(`body-preview-${id}`).style.display = '';
        doc.getElementById(`btn-inline-${id}`)?.classList.remove('inline-active');
    } else {
        textoPronto = item.categoria === 'Prompts IA' ? item.texto : processarTexto(item.texto, false);
    }

    copiarTextoUniversal(textoPronto);

    item.usos = (item.usos || 0) + 1;
    salvarNoCacheESupabase(item, true);

    const cardEl = doc.getElementById(`card-resp-${id}`);
    if (cardEl) {
        cardEl.classList.add('copiado-flash');
        setTimeout(() => cardEl.classList.remove('copiado-flash'), 400);
    }

    if (typeof reagirAnjo === 'function') reagirAnjo('spark', 650);
    mostrarToast(`✓ Copiado: "${item.titulo}"`);
};

colarRapido = async function(inputId) {
    const txt = await lerTextoUniversalClipboard();
    if (txt) {
        const doc = obterDocAtivo();
        const el = doc.getElementById(inputId);
        if (el) {
            el.value = txt.trim();
            renderizarCards();
        }
    }
};

function salvarAcoesRapidas() {
    localStorage.setItem('sc_acoes_rapidas_v1', JSON.stringify(listaAcoesRapidas));
    renderizarBotoesAcoesRapidas();
}

function inicializarBarraCopilotHUD() {
    const doc = obterDocAtivo();
    let hud = doc.getElementById('copilot-hud-bar');
    const topCommandBar = doc.querySelector('.top-command-bar');
    if (!topCommandBar) return;

    if (!hud) {
        hud = doc.createElement('div');
        hud.id = 'copilot-hud-bar';
        hud.className = 'copilot-hud-bar';
        topCommandBar.insertBefore(hud, topCommandBar.firstChild);
    }

    const qtdCardsConhecimento = listaScripts.filter(s => s.categoria !== 'Prompts IA').length;
    const alturaSalva = localStorage.getItem('sc_gem_box_size') || '92px';

    hud.innerHTML = `
        <div class="copilot-top-row" style="justify-content: space-between; gap: 5px;">
            <div id="container-chips-acoes-rapidas" class="quick-actions-scroll"></div>

            <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                <button type="button" class="btn-hud-action btn-hud-ai-gem" onclick="toggleGavetaHUD('hud-gemini-drawer')" data-tip="Abrir ou Fechar sua IA Gem conectada aos seus ${qtdCardsConhecimento} Cards">
                    <span class="material-icons-round" style="font-size:13px;">auto_awesome</span> IA Gem
                </button>
                <button type="button" class="btn-hud-action" onclick="toggleGavetaHUD('hud-checklist-drawer')" data-tip="Checklist rápido de triagem N1/N2 (App, Boleto, OFX, Portaria)">
                    <span class="material-icons-round" style="font-size:13px; color:#38bdf8;">fact_check</span> Triagem N1/N2
                </button>
                <button type="button" class="btn-hud-action" onclick="higienizarDadoCopiado()" data-tip="Limpa pontos e traços de CPF, CNPJ ou Boleto do seu Ctrl+C">
                    <span class="material-icons-round" style="font-size:13px; color:#10b981;">cleaning_services</span> Limpar Nº
                </button>
                <button type="button" class="btn-hud-action" onclick="toggleGavetaHUD('hud-notes-drawer')" data-tip="Bloco de rascunho rápido">
                    <span class="material-icons-round" style="font-size:13px; color:#fbbf24;">sticky_note_2</span> Notas
                </button>
                <button type="button" class="btn-hud-action" onclick="toggleGavetaHUD('hud-qa-editor-drawer')" data-tip="Personalizar textos ou adicionar novos botões de Ação Rápida">
                    <span class="material-icons-round" style="font-size:13px; color:#38bdf8;">tune</span> Editar Ações
                </button>
            </div>
        </div>

        <!-- GAVETA 1: ESTÚDIO IA GEM SEM BORDINHA BUGADA + FILTRO ANTI-CLIENTE CHATO -->
        <div id="hud-gemini-drawer" class="hud-manager-drawer">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:5px;">
                <div style="display:flex; align-items:center; gap:7px; flex-wrap:wrap;">
                    <span style="font-size:10.5px; font-weight:900; color:#f5d0fe; display:flex; align-items:center; gap:4px;">
                        <span class="material-icons-round" style="font-size:14px; color:var(--neon-purple);">psychology</span>
                        IA GEM
                    </span>
                    <span class="gem-brain-badge">
                        🧠 Cérebro Ativo: ${qtdCardsConhecimento} Cards Conectados
                    </span>
                    <button type="button" id="btn-gem-speed-mode" class="btn-reset-mini" style="padding:2px 7px; font-size:9px; color:#6ee7b7; border-color:rgba(16,185,129,0.4);" onclick="alternarModoVelocidadeGem()" data-tip="Alternar entre Modo Ultra-Rápido (Streaming sem atraso) e Modo Analítico">
                        ${(localStorage.getItem('sc_gem_speed_mode') || 'veloz') === 'veloz' ? '⚡ Modo Ultra-Rápido' : '🧠 Modo Analítico'}
                    </button>
                </div>
                <div style="display:flex; gap:4px; align-items:center;">
                    <button type="button" class="btn-reset-mini" style="padding:2px 6px; font-size:9px; color:#fde68a;" onclick="mudarAlturaCaixaGem()" data-tip="Alternar tamanho da caixa (Compacta / Média / Grande) — Salva após o F5!">
                        📐 Tamanho Caixa
                    </button>
                    <button type="button" class="btn-reset-mini" style="padding:2px 7px; font-size:9.5px; color:#7dd3fc;" onclick="toggleConfiguracaoAPIKeyHUD()">
                        🔑 ${configGeminiGem.apiKey ? 'Configurar ✓' : 'API Key'}
                    </button>
                    <button type="button" class="btn-reset-mini" style="padding:2px 6px; font-size:9.5px;" onclick="toggleGavetaHUD('hud-gemini-drawer')">✕</button>
                </div>
            </div>

            <!-- HISTÓRICO DAS ÚLTIMAS 5 RESPOSTAS DA IA GEM (CLICÁVEL!) -->
            <div id="gem-hud-history-bar" class="gem-history-bar" style="display:none;"></div>

            <!-- Sub-caixa de Configuração da API Key -->
            <div id="box-config-apikey-hud" style="display:${configGeminiGem.apiKey ? 'none' : 'flex'}; flex-direction:column; gap:6px; background:rgba(15,23,42,0.95); padding:8px; border-radius:8px; border:1px dashed var(--neon-blue);">
                <label style="font-size:9.5px; font-weight:800; color:#38bdf8;">1. CHAVE DE API DO GEMINI (API KEY):</label>
                <input type="password" id="input-gemini-api-key" value="${configGeminiGem.apiKey || ''}" placeholder="Cole aqui sua chave AIzaSy..." style="background:#020308; border:1px solid rgba(56,189,248,0.4); color:white; padding:6px 8px; border-radius:6px; font-size:11px;">
                <label style="font-size:9.5px; font-weight:800; color:#f5d0fe;">2. INSTRUÇÕES DA SUA GEM:</label>
                <textarea id="input-gemini-persona" rows="3" style="background:#020308; border:1px solid rgba(192,132,252,0.4); color:#e2e8f0; padding:6px 8px; border-radius:6px; font-size:10.5px;">${configGeminiGem.instrucaoGem}</textarea>
                <button type="button" class="btn-copy-tweak" onclick="salvarConfigGemHUD()">💾 SALVAR CONFIGURAÇÃO DA GEM</button>
            </div>

            <!-- Barra de Tom da Resposta (COM CURTO DIRETO E ESCUDO P/ CLIENTE DIFÍCIL!) -->
            <div class="gem-tone-bar">
                <span style="font-size:9px; font-weight:800; color:var(--text-muted);">🎯 TOM:</span>
                <button type="button" class="gem-tone-chip ${tomAtivoGem === 'curto' ? 'active' : ''}" onclick="selecionarTomGem('curto', this)">💬 Curto</button>
                <button type="button" class="gem-tone-chip ${tomAtivoGem === 'padrao' ? 'active' : ''}" onclick="selecionarTomGem('padrao', this)">⚡ Padrão</button>
                <button type="button" class="gem-tone-chip ${tomAtivoGem === 'firme' ? 'active' : ''}" onclick="selecionarTomGem('firme', this)">🛡️ Cliente Difícil</button>
                <button type="button" class="gem-tone-chip ${tomAtivoGem === 'amigavel' ? 'active' : ''}" onclick="selecionarTomGem('amigavel', this)">😊 Amigável</button>
                <button type="button" class="gem-tone-chip ${tomAtivoGem === 'passos' ? 'active' : ''}" onclick="selecionarTomGem('passos', this)">🔢 Passo a Passo</button>
            </div>

            <!-- Caixa onde você cola a fala do cliente ou digita seu desabafo -->
            <div class="gemini-live-box" style="display:flex; flex-direction:column; gap:6px;">
               <textarea id="gemini-hud-input" style="height:${alturaSalva};" placeholder="Cole aqui a conversa inteira (Texto + Imagens + Áudio + PDF) ou dê Ctrl+V em até 10 prints..." oninput="salvarTextoRascunhoGem(this.value)"></textarea>
                
                <!-- GALERIA AUTOMÁTICA DE ATÉ 10 MÍDIAS COLADAS NA TELA -->
                <div id="gem-hud-attachments-bar" style="display:none; gap:8px; flex-wrap:wrap; align-items:center; padding:8px 10px; background:rgba(2, 6, 18, 0.92); border:1px dashed #38bdf8; border-radius:9px;"></div>
                <input type="file" id="gem-hud-file-input" multiple accept="image/*,application/pdf,audio/*,video/*,.csv,.txt,.ofx" style="display:none;" onchange="aoEscolherArquivosGemNativo(event)">

                <div style="display:flex; gap:5px; flex-wrap:wrap; align-items:stretch; width:100%;">
                    <button type="button" class="btn-hud-action btn-hud-ai-gem" style="flex:1 1 95px; justify-content:center; padding:7px 6px; font-size:10px; font-weight:800;" onclick="executarGemNoHUD('responder')" data-tip="Consulta seus cards + sua Gem + Pesquisa Ampla!">
                        <span class="material-icons-round" style="font-size:12px;">bolt</span> ⚡ Responder
                    </button>
                    <button type="button" class="btn-hud-action" style="flex:1 1 95px; justify-content:center; padding:7px 6px; font-size:10px; font-weight:800; border-color:var(--neon-blue); color:#ffffff; background:linear-gradient(135deg, rgba(56,189,248,0.28), rgba(14,165,233,0.14));" onclick="executarGemNoHUD('lapidar')" data-tip="Transforma seu rascunho rápido em uma resposta perfeita!">
                        <span class="material-icons-round" style="font-size:12px; color:#38bdf8;">auto_fix_high</span> ✨ Lapidar
                    </button>
                    <button type="button" class="btn-hud-action" style="flex:1 1 95px; justify-content:center; padding:7px 6px; font-size:10px; font-weight:800; border-color:var(--neon-yellow); color:#fde68a;" onclick="executarGemNoHUD('triagem')" data-tip="Pede e-mail, condomínio/unidade ou print">
                        🔍 Triagem
                    </button>
                    <button type="button" class="btn-hud-action" style="flex:1 1 95px; justify-content:center; padding:7px 6px; font-size:10px; font-weight:800; border-color:#f43f5e; color:#fda4af; background:rgba(244,63,94,0.14);" onclick="executarGemNoHUD('desabafo')" data-tip="Firme, didático e profissional: reexplica desenhado sem ser bonzinho demais!">
                        😤 Desabafo
                    </button>
                    <button type="button" class="btn-hud-action" style="flex:1 1 95px; justify-content:center; padding:7px 6px; font-size:10px; font-weight:800; border-color:var(--neon-green); color:#6ee7b7;" onclick="colarDoClipboardNoInputGem()" data-tip="Cola do seu Ctrl+C e já gera a resposta na hora!">
                        📋 Colar & Responder
                    </button>
					<button type="button" class="btn-gem-media-utility" onclick="document.getElementById('gem-hud-file-input').click()" data-tip="Anexar até 10 Prints, PDFs ou Áudios">
                        <span class="material-icons-round" style="font-size:13px; color:#38bdf8;">attach_file</span> Mídia/PDF
                    </button>
                    <button type="button" class="btn-gem-media-utility scan-mode" onclick="executarGemNoHUD('raiox')" data-tip="Lê o print/PDF/áudio na tela e monta a resposta!">
                        <span class="material-icons-round" style="font-size:13px; color:#e879f9;">center_focus_strong</span> Ler Print
                    </button>
                    <button type="button" class="btn-reset-mini" style="flex:0 0 auto; padding:6px 8px;" onclick="limparCaixaGemHUD()" data-tip="Limpar caixa">
                        <span class="material-icons-round" style="font-size:13px;">delete_outline</span>
                    </button>
                </div>

                <!-- Resultado da Gem enxuto e sem desperdício de layout -->
                <div id="gemini-hud-resultado" style="display:none;"></div>
            </div>
        </div>

        <!-- GAVETA 2: GERENCIADOR PERSONALIZÁVEL DE AÇÕES RÁPIDAS -->
        <div id="hud-qa-editor-drawer" class="hud-manager-drawer">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:10px; font-weight:800; color:#38bdf8;">⚙️ PERSONALIZAR OU ADICIONAR BOTÕES DE AÇÃO RÁPIDA:</span>
                <button type="button" class="btn-reset-mini" style="padding:2px 6px; font-size:9px;" onclick="toggleGavetaHUD('hud-qa-editor-drawer')">✕</button>
            </div>
            <div id="lista-editor-acoes-rapidas" style="display:flex; flex-direction:column; gap:5px; max-height:170px; overflow-y:auto;"></div>
            <div style="display:flex; gap:6px; margin-top:4px;">
                <button type="button" class="btn-hud-action" style="border-color:var(--neon-green); color:#6ee7b7;" onclick="adicionarNovaAcaoRapida()">
                    <span class="material-icons-round" style="font-size:13px;">add</span> + Adicionar Botão Rápido
                </button>
                <button type="button" class="btn-reset-mini" style="margin-left:auto; font-size:9.5px; padding:3px 8px;" onclick="restaurarAcoesRapidasPadrao()">
                    Restaurar Padrão
                </button>
            </div>
        </div>

        <!-- GAVETA 3: RASCUNHO FLASH -->
        <div id="hud-notes-drawer" class="hud-manager-drawer">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:9.5px; font-weight:800; color:var(--neon-yellow);">📝 RASCUNHO RÁPIDO DO ATENDIMENTO (AUTO-SAVE):</span>
                <div style="display:flex; gap:5px;">
                    <button class="btn-reset-mini" style="padding:2px 6px; font-size:9px;" onclick="copiarRascunhoHUD()">Copiar Nota</button>
                    <button class="btn-reset-mini" style="padding:2px 6px; font-size:9px;" onclick="toggleGavetaHUD('hud-notes-drawer')">✕</button>
                </div>
            </div>
            <textarea id="hud-notes-textarea" rows="3" style="width:100%; resize:none; background:#040711; border:1px solid rgba(251,191,36,0.35); color:#fef08a; padding:6px 8px; border-radius:6px; font-size:11.5px; outline:none;" placeholder="Anote aqui e-mail do morador, unidade, protocolo ou observação..." oninput="salvarRascunhoHUD(this.value)"></textarea>
        </div>

        <!-- GAVETA 4: CHECKLIST INTERATIVO N1/N2 (NO CLIQUE) -->
        <div id="hud-checklist-drawer" class="hud-manager-drawer">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                <span style="font-size:9.5px; font-weight:800; color:#7dd3fc;">🛡️ CHECKLIST RÁPIDO N1/N2 (SEU CONDOMÍNIO):</span>
                <button type="button" class="btn-reset-mini" style="padding:2px 6px; font-size:9px;" onclick="toggleGavetaHUD('hud-checklist-drawer')">✕</button>
            </div>
            <div id="checklist-tabs-container" class="checklist-tabs-row"></div>
            <div id="checklist-steps-container" class="checklist-items-list"></div>
        </div>
    `;

    const notaSalva = localStorage.getItem('sc_hud_quick_notes') || '';
    const txtNote = doc.getElementById('hud-notes-textarea');
    if (txtNote) txtNote.value = notaSalva;

    const rascunhoGemSalvo = localStorage.getItem('sc_gem_rascunho_input') || '';
    const txtGemInput = doc.getElementById('gemini-hud-input');
    if (txtGemInput) txtGemInput.value = rascunhoGemSalvo;

    const txtViewBtn = doc.getElementById('txt-view-mode');
    if (txtViewBtn) txtViewBtn.innerText = modoCompacto ? "Expandir" : "Compactar";

    if (janelaPiPAtual && !janelaPiPAtual.closed) {
        janelaPiPAtual.mudarAlturaCaixaGem = mudarAlturaCaixaGem;
    }

    renderizarBotoesAcoesRapidas();
    renderizarEditorAcoesRapidas();
    if (typeof renderizarChecklistN1N2 === 'function') renderizarChecklistN1N2();
    if (typeof renderizarHistoricoGemHUD === 'function') renderizarHistoricoGemHUD();

    if (localStorage.getItem('sc_gem_aberta_estado') === 'true') {
        const gemDrawer = doc.getElementById('hud-gemini-drawer');
        if (gemDrawer) gemDrawer.style.display = 'flex';
    }

	conectarColagemTotalGemHUD();
}

// ==============================================================
// MOTOR NATIVO DE COLAGEM TOTAL NA IA GEM (SEM DUPLICAR + CONVERSÃO CANVAS P/ IA)
// ==============================================================
window.filaMidiasGemHUD = window.filaMidiasGemHUD || [];
const MAX_MIDIAS_GEM = 10;

// Trava Anti-Duplicação: compara URL e assinatura Base64 para nunca repetir a mesma imagem!
function jaExisteMidiaNaFila(previewUrl, base64Data) {
    return window.filaMidiasGemHUD.some(m => {
        if (previewUrl && m.previewUrl && m.previewUrl === previewUrl) return true;
        if (base64Data && m.base64Data && m.base64Data.slice(0, 120) === base64Data.slice(0, 120) && m.base64Data.length === base64Data.length) return true;
        return false;
    });
}

function renderizarGaleriaGemNativa() {
    const doc = obterDocAtivo();
    const bar = doc.getElementById('gem-hud-attachments-bar');
    if (!bar) return;

    if (window.filaMidiasGemHUD.length === 0) {
        bar.style.display = 'none';
        bar.innerHTML = '';
        return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = `<span style="font-size:9.5px; font-weight:900; color:#38bdf8; width:100%; margin-bottom:1px;">📸 MÍDIAS COLADAS (${window.filaMidiasGemHUD.length}/${MAX_MIDIAS_GEM}):</span>`;

    window.filaMidiasGemHUD.forEach((m, idx) => {
        const card = doc.createElement('div');
        card.style.cssText = 'position:relative; display:inline-flex; align-items:center; gap:5px; background:#090d1a; border:1px solid #38bdf8; border-radius:6px; padding:3px 6px 3px 3px; box-shadow:0 0 8px rgba(56,189,248,0.15);';

        let midiaVisual = '';
        if (m.tipoCurto === 'imagem') {
            midiaVisual = `<img src="${m.previewUrl}" style="width:32px; height:32px; object-fit:cover; border-radius:4px; cursor:zoom-in; background:#000;" onclick="abrirLightboxChat('${m.previewUrl}')">`;
        } else if (m.tipoCurto === 'audio') {
            midiaVisual = `<span class="material-icons-round" style="font-size:18px; color:#34d399; padding:2px;">graphic_eq</span>`;
        } else if (m.tipoCurto === 'pdf') {
            midiaVisual = `<span class="material-icons-round" style="font-size:18px; color:#f87171; padding:2px;">picture_as_pdf</span>`;
        } else {
            midiaVisual = `<span class="material-icons-round" style="font-size:18px; color:#60a5fa; padding:2px;">description</span>`;
        }

        const nomeCurto = (m.nome || 'Mídia').slice(0, 15);
        card.innerHTML = `
            ${midiaVisual}
            <div style="display:flex; flex-direction:column; gap:0px;">
                <span style="font-size:9px; font-weight:700; color:#f8fafc;">${nomeCurto}</span>
                <span style="font-size:7.5px; color:#6ee7b7;">${m.base64Data ? '✓ Pronta' : '👁️ Tela'}</span>
            </div>
            <button type="button" onclick="removerMidiaGemNativa(${idx})" style="background:#ef4444; color:#fff; border:none; border-radius:50%; width:14px; height:14px; font-size:9px; font-weight:900; cursor:pointer; margin-left:2px; display:flex; align-items:center; justify-content:center;">✕</button>
        `;
        bar.appendChild(card);
    });
}

window.removerMidiaGemNativa = function(idx) {
    window.filaMidiasGemHUD.splice(idx, 1);
    renderizarGaleriaGemNativa();
};

async function adicionarArquivoFisicoGem(file, urlOriginal = '') {
    if (window.filaMidiasGemHUD.length >= MAX_MIDIAS_GEM) return false;
    const mime = file.type || '';
    const nome = file.name || `Print_${window.filaMidiasGemHUD.length + 1}.jpg`;

    if (mime.startsWith('image/')) {
        const dataUrl = await comprimirImagemParaBase64(file, 1400, 0.85);
        const b64 = dataUrl.split(',')[1];
        if (jaExisteMidiaNaFila(urlOriginal || dataUrl, b64)) return false;

        window.filaMidiasGemHUD.push({
            mimeType: 'image/jpeg',
            base64Data: b64,
            previewUrl: dataUrl,
            urlOrigem: urlOriginal,
            nome,
            tipoCurto: 'imagem'
        });
    } else if (mime.startsWith('text/') || /\.(csv|txt|json|ofx)$/i.test(nome)) {
        const txt = await file.text();
        window.filaMidiasGemHUD.push({
            mimeType: 'text/plain',
            base64Data: null,
            previewUrl: '',
            nome,
            tipoCurto: 'texto',
            textoExtraido: txt.slice(0, 30000)
        });
    } else {
        const dataUrl = await new Promise(res => {
            const r = new FileReader();
            r.onload = e => res(e.target.result);
            r.readAsDataURL(file);
        });
        const b64 = dataUrl.split(',')[1];
        if (jaExisteMidiaNaFila(urlOriginal, b64)) return false;

        window.filaMidiasGemHUD.push({
            mimeType: mime || 'application/octet-stream',
            base64Data: b64,
            previewUrl: '',
            urlOrigem: urlOriginal,
            nome,
            tipoCurto: mime.includes('pdf') ? 'pdf' : (mime.startsWith('audio/') ? 'audio' : 'arquivo')
        });
    }
    renderizarGaleriaGemNativa();
    return true;
}

window.aoEscolherArquivosGemNativo = async function(ev) {
    for (const f of Array.from(ev.target.files || [])) {
        await adicionarArquivoFisicoGem(f);
    }
    ev.target.value = '';
};

// Tenta extrair Base64 via elemento Image + Canvas para a IA conseguir ler imagens mesmo de URLs externas
function tentarExtrairBase64ViaCanvas(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                let w = img.naturalWidth || img.width || 800;
                let h = img.naturalHeight || img.height || 600;
                const maxD = 1400;
                if (w > maxD || h > maxD) {
                    if (w > h) { h = Math.round(h * (maxD / w)); w = maxD; }
                    else { w = Math.round(w * (maxD / h)); h = maxD; }
                }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve(dataUrl.split(',')[1]);
            } catch (e) {
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

async function capturarUrlMidiaDaConversa(url, tipo, nome) {
    if (window.filaMidiasGemHUD.length >= MAX_MIDIAS_GEM) return false;
    if (!url || url.startsWith('javascript:') || /emoji|twemoji|avatar|favicon|icon/i.test(url)) return false;
    if (jaExisteMidiaNaFila(url, null) || window.filaMidiasGemHUD.some(m => m.urlOrigem === url)) return false;

    if (url.startsWith('data:')) {
        const [hdr, b64] = url.split(',');
        const mime = hdr.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
        if (jaExisteMidiaNaFila(url, b64)) return false;
        window.filaMidiasGemHUD.push({
            mimeType: mime,
            base64Data: b64,
            previewUrl: url,
            urlOrigem: url,
            nome: nome || `Print_${window.filaMidiasGemHUD.length + 1}.jpg`,
            tipoCurto: tipo
        });
        renderizarGaleriaGemNativa();
        return true;
    }

    try {
        const resp = await fetch(url, { credentials: 'include' }).catch(() => fetch(url));
        if (resp && resp.ok) {
            const blob = await resp.blob();
            if (blob.size > 1200) {
                const file = new File([blob], nome || `Midia_${window.filaMidiasGemHUD.length + 1}`, { type: blob.type || 'image/jpeg' });
                return await adicionarArquivoFisicoGem(file, url);
            }
        }
    } catch (e) {}

    if (tipo === 'imagem') {
        const b64Canvas = await tentarExtrairBase64ViaCanvas(url);
        if (jaExisteMidiaNaFila(url, b64Canvas)) return false;
        window.filaMidiasGemHUD.push({
            mimeType: 'image/jpeg',
            base64Data: b64Canvas,
            previewUrl: url,
            urlOrigem: url,
            nome: nome || `Print_${window.filaMidiasGemHUD.length + 1}.jpg`,
            tipoCurto: 'imagem'
        });
        renderizarGaleriaGemNativa();
        return true;
    }
    return false;
}

function conectarColagemTotalGemHUD() {
    const doc = obterDocAtivo();
    const inputGem = doc.getElementById('gemini-hud-input');
    if (!inputGem || inputGem.dataset.colagemTotalAtiva === 'true') return;
    inputGem.dataset.colagemTotalAtiva = 'true';

    inputGem.addEventListener('paste', async (e) => {
        const cb = e.clipboardData;
        if (!cb) return;
        let colouMidia = 0;

        // 1. Captura arquivos diretos no Ctrl+V (apenas de cb.files para não duplicar com cb.items!)
        const arquivosDiretos = (cb.files && cb.files.length > 0)
            ? Array.from(cb.files)
            : Array.from(cb.items || []).filter(i => i.kind === 'file').map(i => i.getAsFile()).filter(Boolean);

        for (const f of arquivosDiretos) {
            const ok = await adicionarArquivoFisicoGem(f);
            if (ok) colouMidia++;
        }

        // 2. Se NÃO era apenas um Print Screen isolado, ou se veio HTML de conversa inteira:
        const html = cb.getData('text/html');
        if (html && arquivosDiretos.length === 0) {
            const parser = new DOMParser();
            const docHtml = parser.parseFromString(html, 'text/html');
            const urlsProcessadasNestePaste = new Set();

            // Imagens
            for (const img of Array.from(docHtml.querySelectorAll('img'))) {
                const src = (img.getAttribute('src') || img.getAttribute('data-src') || '').trim();
                const w = parseInt(img.getAttribute('width') || '500', 10);
                if (src && w >= 32 && !urlsProcessadasNestePaste.has(src)) {
                    urlsProcessadasNestePaste.add(src);
                    const ok = await capturarUrlMidiaDaConversa(src, 'imagem', img.getAttribute('alt') || 'Print_Conversa.jpg');
                    if (ok) colouMidia++;
                }
            }

            // Áudios e vídeos
            for (const au of Array.from(docHtml.querySelectorAll('audio, video, source'))) {
                const src = (au.getAttribute('src') || '').trim();
                if (src && !urlsProcessadasNestePaste.has(src)) {
                    urlsProcessadasNestePaste.add(src);
                    const ok = await capturarUrlMidiaDaConversa(src, 'audio', 'Audio_Conversa.ogg');
                    if (ok) colouMidia++;
                }
            }

            // Links de PDFs/Arquivos (Ignora links que já apontam para a mesma imagem acima!)
            for (const a of Array.from(docHtml.querySelectorAll('a[href]'))) {
                const href = (a.getAttribute('href') || '').trim();
                if (href && !urlsProcessadasNestePaste.has(href) && /\.(pdf|mp3|ogg|wav|csv|ofx)(\?.*)?$/i.test(href)) {
                    urlsProcessadasNestePaste.add(href);
                    const tipo = href.toLowerCase().includes('.pdf') ? 'pdf' : 'arquivo';
                    const ok = await capturarUrlMidiaDaConversa(href, tipo, a.innerText.trim() || 'Anexo_Chat');
                    if (ok) colouMidia++;
                }
            }
        }

        if (colouMidia > 0) {
            mostrarToast(`📸 +${colouMidia} mídia(s) única(s) colada(s) na tela!`);
        }
    });
}

// Alterna a altura da caixa da Gem (Compacta -> Média -> Grande) sem precisar daquela alça branca que bugava a borda!
function mudarAlturaCaixaGem() {
    const doc = obterDocAtivo();
    const input = doc.getElementById('gemini-hud-input');
    if (!input) return;

    const tamanhos = ['78px', '135px', '215px'];
    const atual = input.style.height || '92px';
    const proxIdx = (tamanhos.indexOf(atual) + 1) % tamanhos.length;
    const novoTam = tamanhos[proxIdx];

    input.style.height = novoTam;
    localStorage.setItem('sc_gem_box_size', novoTam);
    const nomes = ['Compacta', 'Média', 'Grande'];
    mostrarToast(`📐 Caixa da Gem: ${nomes[proxIdx]} (salvo)!`);
}
window.mudarAlturaCaixaGem = mudarAlturaCaixaGem;

function salvarTextoRascunhoGem(val) {
    localStorage.setItem('sc_gem_rascunho_input', val);
}

function limparCaixaGemHUD() {
    const doc = obterDocAtivo();
    const input = doc.getElementById('gemini-hud-input');
    const out = doc.getElementById('gemini-hud-resultado');
    if (input) input.value = '';
    if (out) out.style.display = 'none';
    localStorage.removeItem('sc_gem_rascunho_input');
    input?.focus();
}

function selecionarTomGem(tom, btnEl) {
    tomAtivoGem = tom;
    const doc = obterDocAtivo();
    doc.querySelectorAll('.gem-tone-chip').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
}

function renderizarBotoesAcoesRapidas() {
    const doc = obterDocAtivo();
    const container = doc.getElementById('container-chips-acoes-rapidas');
    if (!container) return;

    container.innerHTML = '';
    listaAcoesRapidas.forEach((acao, index) => {
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-hud-action';
        btn.setAttribute('data-tip', processarTexto(acao.texto, false));
        btn.innerHTML = `
            <span class="material-icons-round" style="font-size:12.5px; color:${acao.cor || '#38bdf8'};">${acao.icone || 'bolt'}</span>
            <span>${acao.titulo}</span>
        `;
        btn.onclick = () => dispararAcaoRapidaPorIndice(index);
        container.appendChild(btn);
    });
}

function renderizarEditorAcoesRapidas() {
    const doc = obterDocAtivo();
    const container = doc.getElementById('lista-editor-acoes-rapidas');
    if (!container) return;

    container.innerHTML = '';
    listaAcoesRapidas.forEach((acao, idx) => {
        const row = doc.createElement('div');
        row.className = 'qa-edit-row';
        row.innerHTML = `
            <input type="text" value="${acao.titulo.replace(/"/g, '&quot;')}" placeholder="Nome botão" oninput="atualizarCampoAcaoRapida(${idx}, 'titulo', this.value)">
            <input type="text" value="${acao.texto.replace(/"/g, '&quot;')}" placeholder="Texto que será copiado..." oninput="atualizarCampoAcaoRapida(${idx}, 'texto', this.value)">
            <button type="button" class="btn-reset-mini" style="color:#f87171; padding:4px;" onclick="removerAcaoRapida(${idx})" title="Excluir botão">
                <span class="material-icons-round" style="font-size:13px;">delete</span>
            </button>
        `;
        container.appendChild(row);
    });
}


function atualizarCampoAcaoRapida(idx, campo, valor) {
    if (!listaAcoesRapidas[idx]) return;
    listaAcoesRapidas[idx][campo] = valor;
    localStorage.setItem('sc_acoes_rapidas_v1', JSON.stringify(listaAcoesRapidas));
    renderizarBotoesAcoesRapidas();
}

function adicionarNovaAcaoRapida() {
    const cores = ['#6ee7b7', '#38bdf8', '#fef08a', '#f472b6', '#c084fc'];
    listaAcoesRapidas.push({
        id: 'qa_' + Date.now(),
        icone: 'bolt',
        cor: cores[listaAcoesRapidas.length % cores.length],
        titulo: 'Nova Ação',
        texto: 'Olá, {saudacao} {nome}! '
    });
    salvarAcoesRapidas();
    renderizarEditorAcoesRapidas();
    mostrarToast("✨ Novo botão rápido adicionado!");
}

function removerAcaoRapida(idx) {
    if (listaAcoesRapidas.length <= 1) return mostrarToast("Mantenha ao menos 1 botão rápido!");
    listaAcoesRapidas.splice(idx, 1);
    salvarAcoesRapidas();
    renderizarEditorAcoesRapidas();
}

function restaurarAcoesRapidasPadrao() {
    listaAcoesRapidas = JSON.parse(JSON.stringify(ACOES_RAPIDAS_PADRAO));
    salvarAcoesRapidas();
    renderizarEditorAcoesRapidas();
    mostrarToast("✓ Ações rápidas padrão restauradas!");
}

async function dispararAcaoRapidaPorIndice(idx) {
    const acao = listaAcoesRapidas[idx];
    if (!acao) return;

    const textoFinal = processarTexto(acao.texto, false);
    await copiarTextoUniversal(textoFinal);
    mostrarToast(`✓ Copiado: "${acao.titulo}"!`);
}

function toggleGavetaHUD(idGaveta) {
    const doc = obterDocAtivo();
    ['hud-gemini-drawer', 'hud-qa-editor-drawer', 'hud-notes-drawer', 'hud-checklist-drawer'].forEach(id => {
        const el = doc.getElementById(id);
        if (!el) return;
        if (id === idGaveta) {
            const vaiAbrir = el.style.display !== 'flex';
            el.style.display = vaiAbrir ? 'flex' : 'none';
            if (id === 'hud-gemini-drawer') {
                localStorage.setItem('sc_gem_aberta_estado', vaiAbrir ? 'true' : 'false');
            }
        } else {
            el.style.display = 'none';
        }
    });
}

function toggleConfiguracaoAPIKeyHUD() {
    const doc = obterDocAtivo();
    const box = doc.getElementById('box-config-apikey-hud');
    if (box) box.style.display = box.style.display === 'none' ? 'flex' : 'none';
}

function salvarConfigGemHUD() {
    const doc = obterDocAtivo();
    const key = doc.getElementById('input-gemini-api-key')?.value.trim() || '';
    const persona = doc.getElementById('input-gemini-persona')?.value.trim() || configGeminiGem.instrucaoGem;

    configGeminiGem.apiKey = key;
    configGeminiGem.instrucaoGem = persona;
    localStorage.setItem('sc_gemini_gem_config', JSON.stringify(configGeminiGem));

    const box = doc.getElementById('box-config-apikey-hud');
    if (box && key) box.style.display = 'none';
    inicializarBarraCopilotHUD();
    const drawer = doc.getElementById('hud-gemini-drawer');
    if (drawer) drawer.style.display = 'flex';
    mostrarToast("🤖 Sua Gem foi salva e conectada aos seus Cards!");
}

function compilarCerebroCompletoCockpit() {
    const cardsAtendimento = listaScripts.filter(s => s.categoria !== 'Prompts IA');
    const todosCardsTexto = cardsAtendimento
        .map((s, idx) => `${idx + 1}. [${s.categoria} | ${s.atalho || ''} | ${s.titulo}]: ${processarTexto(s.texto, false)}`)
        .join('\n\n');

    let notasFixadasDiario = "";
    if (typeof listaChatPessoal !== 'undefined' && Array.isArray(listaChatPessoal)) {
        const fixadas = listaChatPessoal.filter(m => m.fixado && m.texto);
        if (fixadas.length > 0) {
            notasFixadasDiario = `\n\n=== ANOTAÇÕES FIXADAS NO DIÁRIO DO RICARDO ===\n` +
                fixadas.map(f => {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = f.texto;
                    return `• ${tmp.innerText || tmp.textContent}`;
                }).join('\n');
        }
    }

    return `\n\n=== MODO HÍBRIDO INTELIGENTE: CARDS + SUA GEM + PESQUISA AMPLA ===
1. PRIORIDADE 1 (BASE DO COCKPIT): Verifique primeiro se a dúvida do cliente está coberta nos ${cardsAtendimento.length} Cards Oficiais ou nas Anotações Fixadas abaixo. Se estiver, use exatamente o procedimento e caminho de menu deles.
2. PRIORIDADE 2 (INTELIGÊNCIA AMPLA & BUSCA): Se a pergunta for sobre algo novo, erro técnico externo, regras bancárias (FEBRABAN, PIX, boletos, OFX), legislação condominial, informática ou qualquer assunto que NÃO esteja nos cards, NÃO se limite! Use todo o seu conhecimento amplo de IA e faça buscas para entregar a solução mais inteligente, lógica e completa possível!

=== BASE DE CONHECIMENTO DO SC SMART COCKPIT (${cardsAtendimento.length} CARDS) ===
${todosCardsTexto}${notasFixadasDiario}`;
}

async function chamarMotorGeminiAPI(promptUsuario, usarContextoScripts = true) {
    if (!configGeminiGem.apiKey) {
        toggleGavetaHUD('hud-gemini-drawer');
        const doc = obterDocAtivo();
        const box = doc.getElementById('box-config-apikey-hud');
        if (box) box.style.display = 'flex';
        throw new Error("Configure sua Chave de API do Gemini primeiro!");
    }

    const doc = obterDocAtivo();
    const nomeCliente = doc.getElementById('var-nome')?.value.trim() || '';
    const nomeCond = doc.getElementById('var-condominio')?.value.trim() || '';
    const saudacao = obterSaudacaoHorario();

    const cerebroTotal = usarContextoScripts ? compilarCerebroCompletoCockpit() : "";
    const contextoVariaveis = `\n\n=== CONTEXTO ATUAL ===\nSaudação: "${saudacao}" | Cliente: "${nomeCliente || 'Não informado'}" | Condomínio: "${nomeCond || 'Não informado'}"`;

    const modeloUsado = 'gemini-3.8-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloUsado}:generateContent?key=${encodeURIComponent(configGeminiGem.apiKey)}`;

    const basePayload = {
        systemInstruction: {
            parts: [{ text: configGeminiGem.instrucaoGem + contextoVariaveis + cerebroTotal }]
        },
        contents: [
            {
                role: "user",
                parts: [{ text: promptUsuario }]
            }
        ],
        generationConfig: {
            temperature: 0.4
        }
    };

    // Tenta primeiro com Pesquisa Google em tempo real ativada (Google Search Grounding)
    let resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...basePayload,
            tools: [{ google_search: {} }]
        })
    });

    // Se a chave/endpoint não suportar o parâmetro tools, refaz no modo amplo instantaneamente sem dar erro!
    if (!resp.ok) {
        resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(basePayload)
        });
    }

    const data = await resp.json();
    if (!resp.ok) {
        throw new Error(data.error?.message || "Erro na chamada da API do Gemini.");
    }

    return data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('')?.trim() || "Sem resposta gerada.";
}

async function colarDoClipboardNoInputGem() {
    const txt = await lerTextoUniversalClipboard();
    const doc = obterDocAtivo();
    const input = doc.getElementById('gemini-hud-input');
    if (input && txt) {
        input.value = txt.trim();
        salvarTextoRascunhoGem(input.value);
        executarGemNoHUD('responder');
    } else {
        mostrarToast("Copie a mensagem do cliente primeiro!");
    }
}

async function executarGemNoHUD(modo) {
    const doc = obterDocAtivo();
    const input = doc.getElementById('gemini-hud-input');
    const outBox = doc.getElementById('gemini-hud-resultado');
    const texto = input?.value.trim() || "";

    if (!texto) return mostrarToast("Digite ou cole a fala do cliente / desabafo primeiro!");

    const qtdCards = listaScripts.filter(s => s.categoria !== 'Prompts IA').length;
    outBox.style.display = 'block';
    outBox.innerHTML = `<div class="gem-ans-body">⏳ <em>Consultando seus ${qtdCards} cards e gerando resposta...</em></div>`;

    const instrucoesTom = {
        padrao: "Use o tom padrão e equilibrado das respostas rápidas do suporte: profissional, prestativo e claro.",
        curto: "SEJA ULTRA-DIRETO E CURTO (2 a 6 linhas no máximo). Sem floreios.",
        firme: "Postura de especialista sênior: firme, didática, definitiva, sem bajulação mas explicada passo a passo.",
        amigavel: "Seja super amigável, caloroso, humano, leve e prestativo.",
        passos: "Estruture a explicação em um passo a passo numerado (1., 2., 3.) curto e direto."
    };

    try {
        const diretrizTom = instrucoesTom[tomAtivoGem] || instrucoesTom.curto;
        let comando = "";

       if (modo === 'desabafo') {
            comando = `O atendente Ricardo digitou este desabafo sobre um cliente difícil/teimoso:\n"${texto}"\n\nTransforme isso em uma resposta CURTA, DIRETA, SECA E FIRME (máximo de 1 a 2 frases curtas) para enviar no chat. Zero rodeios, sem pedir desculpas, sem "compreendo sua frustração" e sem textão: dê o recado técnico na lata, estabelecendo o limite com firmeza profissional. Entregue APENAS a frase pronta para colar, sem asteriscos (**):`;
        } else if (modo === 'lapidar') {
            comando = `O atendente Ricardo digitou este desabafo/contexto sobre um cliente resistente ou que não entendeu a explicação anterior:\n"${texto}"\n\nTransforme isso em uma resposta com POSTURA DE ESPECIALISTA SÊNIOR: firme, séria, didática e definitiva.\nRegras obrigatórias:\n1. NÃO seja ríspido ("se vire"), mas NÃO seja submisso ou bonzinho demais (zero "peço mil desculpas", zero "compreendo sua frustração", zero diminutivos).\n2. Reexplique a lógica do sistema e o passo a passo de forma tão clara, direta e mastigada que o cliente entenda o motivo técnico e saiba exatamente o que fazer (ou o que compete à administração/síndico fazer) sem ter como retrucar.\n3. Consulte os Cards se precisar citar o caminho exato da tela.\n4. Entregue APENAS a mensagem pronta para dar Ctrl+C e Ctrl+V no chat, sem asteriscos (**):`;
        } else if (modo === 'triagem') {
            comando = `O cliente enviou isto no chat:\n"${texto}"\n\nFaça uma pergunta de triagem de 1 linha, super direta (estilo chat rápido), pedindo apenas o que falta para olhar no sistema (e-mail, condomínio/unidade ou print do erro). Entregue APENAS a frase pronta para colar:`;
        } else {
            comando = `Mensagem/dúvida recebida:\n"${texto}"\n\nComo agir:\n1. Consulte primeiro os Cards do SC Smart Cockpit e as instruções da minha Gem.\n2. Se for algo que não está nos cards ou que você precise pesquisar/deduzir (regras de condomínio, erros técnicos, bancos, internet ou qualquer dúvida geral), faça uma busca ampla no seu conhecimento e na web para me dar a resposta mais precisa e resolutiva.\n3. Siga o tom (${diretrizTom}) e entregue APENAS a resposta final pronta para colar no chat, sem asteriscos duplos (**):`;
        }

        const respostaBruta = await chamarMotorGeminiAPI(comando, true);

        const respostaLimpaParaColar = respostaBruta.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
        ultimaRespostaGeradaGem = respostaLimpaParaColar;
        await copiarTextoUniversal(respostaLimpaParaColar);

        const htmlVisual = respostaBruta
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        outBox.innerHTML = `<div class="gem-ans-header"><strong style="color:var(--neon-green); font-size:10px;">✓ COPIADO PRO SEU CTRL+V!</strong><div style="display:flex; gap:4px;"><button type="button" class="btn-hud-action" style="padding:2px 6px; border-color:var(--neon-blue); color:#7dd3fc;" onclick="copiarTextoUniversal(ultimaRespostaGeradaGem); mostrarToast('✓ Copiado!')">Copiar</button><button type="button" class="btn-hud-action" style="padding:2px 6px; border-color:var(--neon-green); color:#6ee7b7;" onclick="transformarRespostaGemEmCard()">+ Virar Card</button><button type="button" class="btn-hud-action" style="padding:2px 6px; border-color:#f472b6; color:#f9a8d4;" onclick="salvarRespostaGemNoDiario()">Salvar Diário</button></div></div><div class="gem-ans-body">${htmlVisual}</div>`;
        mostrarToast("🤖 Resposta pronta e já copiada para o seu Ctrl+V!");
    } catch (err) {
        outBox.innerHTML = `<div class="gem-ans-body" style="color:#f87171;">⚠️ ${err.message}</div>`;
    }
}

function transformarRespostaGemEmCard() {
    if (!ultimaRespostaGeradaGem) return;
    if (janelaPiPAtual && !janelaPiPAtual.closed) {
        restaurarTelaPrincipalDoPiP();
    }
    abrirModalScript('Cadastros');
    document.getElementById('script-texto').value = ultimaRespostaGeradaGem;
    document.getElementById('script-titulo').focus();
    mostrarToast("✨ Resposta carregada! Dê um título e salve seu novo Card.");
}

function salvarRespostaGemNoDiario() {
    if (!ultimaRespostaGeradaGem) return;
    const novaMsg = {
        id: Date.now(),
        texto: `🤖 <strong>Resposta Gerada pela IA Gem:</strong><br>${ultimaRespostaGeradaGem.replace(/\n/g, '<br>')}`,
        midia_tipo: "",
        midia_url: "",
        midia_nome: "",
        cor_balao: "verde",
        fixado: false,
        criado_em: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    listaChatPessoal.push(novaMsg);
    salvarChatLocal();
    renderizarMensagensChat(true);
    mostrarToast("📌 Resposta salva no seu Diário Pessoal!");
}

async function higienizarDadoCopiado() {
    const txt = await lerTextoUniversalClipboard();
    if (!txt) return mostrarToast("Nenhum texto no Ctrl+C!");
    const apenasNumeros = txt.replace(/\D/g, '');
    if (!apenasNumeros) return mostrarToast("Não há números no texto copiado!");

    await copiarTextoUniversal(apenasNumeros);
    mostrarToast(`🧹 Limpo: "${apenasNumeros}" copiado para o seu Ctrl+V!`);
}

function salvarRascunhoHUD(val) {
    localStorage.setItem('sc_hud_quick_notes', val);
}

async function copiarRascunhoHUD() {
    const doc = obterDocAtivo();
    const val = doc.getElementById('hud-notes-textarea')?.value || '';
    if (!val) return mostrarToast("O rascunho está vazio!");
    await copiarTextoUniversal(val);
    mostrarToast("📝 Rascunho copiado!");
}

setTimeout(inicializarBarraCopilotHUD, 200);

// ==============================================================
// JANELA FLUTUANTE COM ESPELHAMENTO DE FUNÇÕES E SCROLL LISO
// ==============================================================
const origGetByIdGlobal = document.getElementById.bind(document);
const origQueryAllGlobal = document.querySelectorAll.bind(document);
const origQueryGlobal = document.querySelector.bind(document);

function restaurarTelaPrincipalDoPiP() {
    if (vigiaFechamentoPiP) {
        clearInterval(vigiaFechamentoPiP);
        vigiaFechamentoPiP = null;
    }

    document.getElementById = origGetByIdGlobal;
    document.querySelectorAll = origQueryAllGlobal;
    document.querySelector = origQueryGlobal;

    const appContainer = origQueryGlobal('.app-container');
    const container = origGetByIdGlobal('area-flutuante-container') || (janelaPiPAtual && janelaPiPAtual.document?.getElementById('area-flutuante-container'));
    const toastBox = origGetByIdGlobal('toast-container') || (janelaPiPAtual && janelaPiPAtual.document?.getElementById('toast-container'));
    const placeholder = origGetByIdGlobal('pip-active-placeholder');

    if (placeholder) placeholder.remove();

    if (container && appContainer && !appContainer.contains(container)) {
        appContainer.appendChild(container);
    }
    if (toastBox && !document.body.contains(toastBox)) {
        document.body.appendChild(toastBox);
    }

    if (janelaPiPAtual && !janelaPiPAtual.closed) {
        try { janelaPiPAtual.close(); } catch (e) {}
    }
    janelaPiPAtual = null;

    const moduloSalvo = localStorage.getItem('sc_modulo_ativo') || 'atendimento';
    trocarModulo(moduloSalvo);
    inicializarBarraCopilotHUD();
    renderizarCards();
}

async function ativarModoFlutuante() {
    if (janelaPiPAtual && !janelaPiPAtual.closed) {
        restaurarTelaPrincipalDoPiP();
        mostrarToast("✨ Tela restaurada para o painel principal!");
        return;
    }

    if ('documentPictureInPicture' in window) {
        try {
            const pipWindow = await window.documentPictureInPicture.requestWindow({
                width: 440,
                height: 740
            });
            janelaPiPAtual = pipWindow;

            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    pipWindow.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSheet.href;
                    pipWindow.document.head.appendChild(link);
                }
            });

            pipWindow.document.documentElement.classList.add('pip-active-window');
            pipWindow.document.body.classList.add('pip-active-window');

            const container = origGetByIdGlobal('area-flutuante-container');
            const toastBox = origGetByIdGlobal('toast-container');
            const appContainer = origQueryGlobal('.app-container');

            const placeholder = document.createElement('div');
            placeholder.id = 'pip-active-placeholder';
            placeholder.className = 'pip-placeholder-banner';
            placeholder.innerHTML = `
                <span class="material-icons-round" style="font-size:42px; color:var(--neon-blue);">picture_in_picture_alt</span>
                <h3 style="color:white; font-size:15px;">Modo Flutuante Ativo</h3>
                <p style="font-size:12px; color:var(--text-muted);">O seu Cockpit está aberto na janela destacada. Ao fechá-la no "X" (ou clicando abaixo), tudo volta para cá instantaneamente!</p>
                <button type="button" class="btn-pip" onclick="restaurarTelaPrincipalDoPiP()">
                    <span class="material-icons-round">keyboard_return</span> TRAZER TELA DE VOLTA AQUI
                </button>
            `;
            appContainer.appendChild(placeholder);

            pipWindow.document.body.appendChild(container);
            if (toastBox) pipWindow.document.body.appendChild(toastBox);

            document.getElementById = (id) => origGetByIdGlobal(id) || pipWindow.document.getElementById(id);
            document.querySelectorAll = (sel) => {
                const a = [...origQueryAllGlobal(sel)];
                const b = [...pipWindow.document.querySelectorAll(sel)];
                return [...new Set([...a, ...b])];
            };
            document.querySelector = (sel) => origQueryGlobal(sel) || pipWindow.document.querySelector(sel);

            // Espelha todas as funções do sistema dentro do pipWindow para que TODOS os botões funcionem lá dentro!
            sincronizarFuncoesParaJanelaPiP(pipWindow);
            inicializarBarraCopilotHUD();
            renderizarPillsCategorias();
            renderizarCards();

            pipWindow.addEventListener("pagehide", restaurarTelaPrincipalDoPiP);
            pipWindow.addEventListener("unload", restaurarTelaPrincipalDoPiP);
            vigiaFechamentoPiP = setInterval(() => {
                if (!janelaPiPAtual || janelaPiPAtual.closed) {
                    restaurarTelaPrincipalDoPiP();
                }
            }, 300);

            return;
        } catch (err) {
            console.error(err);
        }
    }
    window.open(window.location.href, 'SCCockpitFloat', 'width=440,height=740');
}

function trocarModulo(mod) {
    document.querySelectorAll('.module-view').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    
    const alvo = document.getElementById(`modulo-${mod}`);
    if (alvo) {
        alvo.style.display = 'flex';
    }
    document.getElementById(`nav-${mod}`)?.classList.add('active');

    // Renderização sob demanda: só atualiza a aba que realmente está aberta!
    if (mod === 'prompts' && typeof renderizarPrompts === 'function') {
        renderizarPrompts();
    } else if (mod === 'chat' && typeof renderizarMensagensChat === 'function') {
        renderizarMensagensChat(false);
    }

    // Salva a página atual para permanecer nela ao dar F5!
    localStorage.setItem('sc_modulo_ativo', mod);
}

function mostrarToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="material-icons-round" style="color: var(--neon-green); font-size: 16px;">auto_awesome</span> <span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => t.remove(), 2200);
}

// ==============================================================
// MOTOR DE SOBREPOSIÇÃO ESTRELADA (GPU TRANSLATE3D • ZERO REFLOW!)
// ==============================================================
(function inicializarTooltipEstrelado() {
    let tipBox = document.getElementById('starry-tooltip');
    if (!tipBox) {
        tipBox = document.createElement('div');
        tipBox.id = 'starry-tooltip';
        document.body.appendChild(tipBox);
    }

    let tipAtivo = false;
    let tipWidth = 180;
    let ultimoElTip = null;

    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('[title], [data-tip]');
        if (!el) {
            if (tipAtivo) {
                tipBox.classList.remove('visivel');
                tipAtivo = false;
                ultimoElTip = null;
            }
            return;
        }

        if (el.hasAttribute('title')) {
            const txt = el.getAttribute('title');
            if (txt) el.setAttribute('data-tip', txt);
            el.removeAttribute('title');
        }

        if (el === ultimoElTip && tipAtivo) return;
        const msg = el.getAttribute('data-tip');
        if (!msg) return;

        ultimoElTip = el;
        tipBox.innerHTML = `<span class="tip-star">✦</span> <span>${msg}</span>`;
        tipBox.classList.add('visivel');
        tipAtivo = true;
        tipWidth = tipBox.offsetWidth || 180;
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        if (!tipAtivo) return;
        let x = e.clientX + 12;
        let y = e.clientY - 36;

        if (x + tipWidth > window.innerWidth - 10) {
            x = window.innerWidth - tipWidth - 10;
        }
        if (y < 10) y = e.clientY + 20;

        tipBox.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (!tipAtivo) return;
        const rel = e.relatedTarget;
        if (!rel || !rel.closest || !rel.closest('[data-tip]')) {
            tipBox.classList.remove('visivel');
            tipAtivo = false;
            ultimoElTip = null;
        }
    }, { passive: true });
})();

// ==============================================================
// INICIALIZAÇÃO SEGURA DO COCKPIT & COPILOT HUD
// ==============================================================
window.onload = () => {
    const salvo = JSON.parse(localStorage.getItem('sc_pensamentos_espirita'));
    const primeiro = (salvo && salvo[0]) ? salvo[0] : PENSAMENTOS_PADRAO[0];
    if (primeiro) {
        const elMantra = document.getElementById('mantra-palavras');
        const elFrase = document.getElementById('frase-espirita');
        const elAutor = document.getElementById('autor-espirita');
        if (elMantra) elMantra.innerText = primeiro.mantra;
        if (elFrase) elFrase.innerText = primeiro.frase;
        if (elAutor) elAutor.innerText = primeiro.autor ? `— ${primeiro.autor}` : '';
    }
    atualizarAuraHorarioHorizonte();
    iniciarCosmosInfinito();
    atualizarBadgeSaudacao();
    document.getElementById('txt-view-mode').innerText = modoCompacto ? "Expandir" : "Compactar";
    renderizarPillsCategorias();
    renderizarCards();

    if (typeof inicializarPortalAnjoHolografico === 'function') {
        inicializarPortalAnjoHolografico();
    }

    // Pré-aquece lista de modelos da API Key em segundo plano para a 1ª resposta sair instantânea!
    if (configGeminiGem?.apiKey && typeof obterModelosReaisDaChave === 'function') {
        obterModelosReaisDaChave(configGeminiGem.apiKey).catch(() => {});
    }

    // Restaura a aba exata em que você estava antes de apertar F5!
    const moduloSalvo = localStorage.getItem('sc_modulo_ativo') || 'atendimento';
    trocarModulo(moduloSalvo);
};


// ==============================================================
// MÓDULO 3: MOTOR EXTRATOR UNIVERSAL DE PDF ➔ 11 COLUNAS SEU CONDOMÍNIO
// (AUTO-DETECÇÃO DE COLUNAS X/Y + TABELAS + BLOCOS + SELECT CÓSMICO)
// ==============================================================
let registrosBrutosExtraidos = [];
let linhasProntasParaSistema = [];

if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// 1. CONVERSOR UNIVERSAL DE <SELECT> PARA DROPDOWN CÓSMICO DARK GLASS
function inicializarSelectsCosmicos() {
    document.querySelectorAll('select:not(.cosmic-converted)').forEach(sel => {
        if (sel.id === 'script-categoria') return; // Já possui dropdown próprio
        sel.classList.add('cosmic-converted');
        sel.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'cosmic-select-wrapper';
        sel.parentNode.insertBefore(wrapper, sel);
        wrapper.appendChild(sel);

        const trigger = document.createElement('div');
        trigger.className = 'cosmic-select-trigger';
        const optInicial = sel.options[sel.selectedIndex] || sel.options[0];
        trigger.innerHTML = `
            <span class="trig-text">${optInicial ? optInicial.text : ''}</span>
            <span class="material-icons-round trig-arrow">expand_more</span>
        `;
        wrapper.appendChild(trigger);

        const menu = document.createElement('div');
        menu.className = 'cosmic-select-options';
        wrapper.appendChild(menu);

        const atualizarOpcoes = () => {
            menu.innerHTML = '';
            Array.from(sel.options).forEach((opt, idx) => {
                const item = document.createElement('div');
                item.className = `cosmic-option-item ${idx === sel.selectedIndex ? 'selected' : ''}`;
                item.innerHTML = `<span>✦</span> <span>${opt.text}</span>`;
                item.onclick = (e) => {
                    e.stopPropagation();
                    sel.selectedIndex = idx;
                    trigger.querySelector('.trig-text').innerText = opt.text;
                    wrapper.classList.remove('open');
                    atualizarOpcoes();
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                };
                menu.appendChild(item);
            });
        };

        atualizarOpcoes();

        trigger.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.cosmic-select-wrapper.open').forEach(w => {
                if (w !== wrapper) w.classList.remove('open');
            });
            atualizarOpcoes();
            wrapper.classList.toggle('open');
        };
    });
}

document.addEventListener('click', () => {
    document.querySelectorAll('.cosmic-select-wrapper.open').forEach(w => w.classList.remove('open'));
});

window.addEventListener('DOMContentLoaded', () => {
    if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    setTimeout(inicializarSelectsCosmicos, 150);
});

// Garante que os selects dentro dos cards de IA também fiquem customizados
const _oldRenderizarPrompts = typeof renderizarPrompts === 'function' ? renderizarPrompts : null;
if (_oldRenderizarPrompts) {
    renderizarPrompts = function() {
        _oldRenderizarPrompts();
        inicializarSelectsCosmicos();
    };
}

// 2. LEITURA ESPACIAL X/Y DE TODAS AS PÁGINAS DO PDF
async function processarArquivoPDFCondominio(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('label-nome-pdf').innerText = `📄 ${file.name}`;
    document.getElementById('status-leitura-pdf').innerText = "Analisando geometria de colunas e extraindo páginas...";

    try {
        if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let todasLinhasVisuais = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            const mapaLinhasY = [];
            textContent.items.forEach(item => {
                const str = item.str ? item.str.trim() : "";
                if (!str) return;
                const x = Math.round(item.transform[4] * 10) / 10;
                const y = Math.round(item.transform[5] * 10) / 10;

                let linhaExistente = mapaLinhasY.find(l => Math.abs(l.y - y) <= 4.2);
                if (!linhaExistente) {
                    linhaExistente = { y, page: pageNum, itens: [] };
                    mapaLinhasY.push(linhaExistente);
                }
                linhaExistente.itens.push({ x, str });
            });

            mapaLinhasY.sort((a, b) => b.y - a.y);
            mapaLinhasY.forEach(l => {
                l.itens.sort((a, b) => a.x - b.x);
                todasLinhasVisuais.push(l);
            });
        }

        interpretarPDFUniversal(todasLinhasVisuais);
        document.getElementById('status-leitura-pdf').innerText = `✓ ${pdf.numPages} páginas processadas (${linhasProntasParaSistema.length} contatos extraídos)!`;
        mostrarToast(`🎉 PDF processado! ${linhasProntasParaSistema.length} registros extraídos.`);
    } catch (err) {
        console.error("Erro no Extrator PDF:", err);
        document.getElementById('status-leitura-pdf').innerText = "Erro ao ler o PDF.";
        mostrarToast("Erro ao processar o PDF.");
    }
    event.target.value = '';
}

// 3. INTELIGÊNCIA UNIVERSAL: DETECTA TABELAS POR COLUNAS (ALPHAVILLE/INNOVARE/SUPERLÓGICA) OU BLOCOS (ARAGUAIA/INTEGRO)
function interpretarPDFUniversal(linhasVisuais) {
    registrosBrutosExtraidos = [];

    // Verifica se o PDF possui cabeçalho tabular com colunas (Ex: Unidade | Nome/Telefone | Tipo | Endereço | CPF/CNPJ | E-mail)
    let layoutColunas = null;
    for (let i = 0; i < Math.min(linhasVisuais.length, 30); i++) {
        const textosLinha = linhasVisuais[i].itens.map(it => it.str.toUpperCase());
        const temUnid = textosLinha.some(t => t.includes('UNID'));
        const temNomeOuCpf = textosLinha.some(t => t.includes('NOME') || t.includes('CPF') || t.includes('E-MAIL') || t.includes('TIPO'));
        if (temUnid && temNomeOuCpf && linhasVisuais[i].itens.length >= 3) {
            layoutColunas = {};
            linhasVisuais[i].itens.forEach(it => {
                const u = it.str.toUpperCase();
                if (u.includes('UNID')) layoutColunas.xUnid = it.x;
                else if (u.includes('NOME') || u.includes('TELEFONE') || u.includes('CLIENTE') || u.includes('CONDÔMINO')) layoutColunas.xNome = it.x;
                else if (u.includes('TIPO') || u.includes('PERFIL') || u.includes('VÍNCULO')) layoutColunas.xTipo = it.x;
                else if (u.includes('ENDERE')) layoutColunas.xEnd = it.x;
                else if (u.includes('CPF') || u.includes('CNPJ') || u.includes('DOC')) layoutColunas.xDoc = it.x;
                else if (u.includes('MAIL')) layoutColunas.xEmail = it.x;
            });
            break;
        }
    }

    // Se detectou tabela estruturada por colunas (como Alphaville Manaus 4 / Group Innovare)
    if (layoutColunas && layoutColunas.xNome !== undefined) {
        extrairModoTabularPorCoordenadas(linhasVisuais, layoutColunas);
    } else {
        // Modo Híbrido/Fluxo Contínuo (Araguaia / Integro / Assiscon / Listagens gerais)
        extrairModoFluxoContinuo(linhasVisuais.map(l => l.itens.map(i => i.str).join(' ')));
    }

    reprocessarParametrizacaoAoVivo();
}

// 4. MODO TABULAR POR COORDENADAS X (ALPHAVILLE MANAUS 4 E SIMILARES)
function extrairModoTabularPorCoordenadas(linhasVisuais, cols) {
    const xNomeMin = (cols.xNome || 85) - 18;
    const xTipoMin = (cols.xTipo || 245) - 20;
    const xEndMin  = (cols.xEnd  || 355) - 20;
    const xDocMin  = (cols.xDoc  || 555) - 25;
    const xMailMin = (cols.xEmail || 640) - 25;

    let unidAcumulada = [];
    let contatoAtual = null;
    let ultimaUnidadeValida = "S/U";

    const finalizarContato = () => {
        if (!contatoAtual) return;
        const nomeTexto = contatoAtual.colNome.join(' ').trim();
        if (!nomeTexto) return;

        let unidBrutaCompleta = contatoAtual.unidParts.join(' ').replace(/\s+/g, ' ').trim();
        if (!unidBrutaCompleta) unidBrutaCompleta = ultimaUnidadeValida;
        else ultimaUnidadeValida = unidBrutaCompleta;

        const { bloco, unid } = separarBlocoEUnidadeInteligente(unidBrutaCompleta);

        registrosBrutosExtraidos.push({
            modo: 'tabular',
            unidOriginal: unidBrutaCompleta,
            bloco,
            unidadeBruta: unid,
            colNome: contatoAtual.colNome,
            tipoBruto: contatoAtual.tipo,
            colDoc: contatoAtual.colDoc,
            colEmail: contatoAtual.colEmail
        });
        contatoAtual = null;
    };

    linhasVisuais.forEach(linha => {
        const textoLinhaInteira = linha.itens.map(i => i.str).join(' ').toUpperCase().trim();

        // Ignora cabeçalhos, rodapés e paginação ("1 de 33", "GROUP INNOVARE", "Total de Contatos:")
        if (!textoLinhaInteira ||
            textoLinhaInteira.includes('CONTATOS DAS UNIDADES') ||
            textoLinhaInteira.includes('W045A ') ||
            textoLinhaInteira.includes('GROUP INNOVARE') ||
            textoLinhaInteira.includes('RUA JOSÉ FERRO') ||
            textoLinhaInteira.includes('WWW.GROUPINNOVARE') ||
            textoLinhaInteira.includes('TOTAL DE CONTATOS:') ||
            /^\d+\s+DE\s+\d+$/.test(textoLinhaInteira) ||
            (textoLinhaInteira.includes('UNIDADE') && textoLinhaInteira.includes('CPF/CNPJ'))) {
            return;
        }

        const cUnid = [], cNome = [], cTipo = [], cEnd = [], cDoc = [], cMail = [];

        linha.itens.forEach(it => {
            if (it.str === '°' || it.str === 'NNOVARE') return;
            if (it.x < xNomeMin) cUnid.push(it.str);
            else if (it.x < xTipoMin) cNome.push(it.str);
            else if (it.x < xEndMin) cTipo.push(it.str);
            else if (it.x < xDocMin) cEnd.push(it.str);
            else if (it.x < xMailMin) cDoc.push(it.str);
            else cMail.push(it.str);
        });

        // Verifica se a palavra de Tipo ("Proprietário", "Residente", "Procurador", "Dependente") veio colada no fim do nome
        let tipoDetectado = cTipo.join(' ').trim();
        if (!tipoDetectado && cNome.length > 0) {
            const ultimoNome = cNome[cNome.length - 1];
            const matchTipoColado = ultimoNome.match(/\b(Proprietário|Proprietaria|Residente|Morador|Locatário|Inquilino|Procurador|Dependente|Responsável)$/i);
            if (matchTipoColado) {
                tipoDetectado = matchTipoColado[1];
                cNome[cNome.length - 1] = ultimoNome.replace(matchTipoColado[0], '').trim();
            }
        }

        const unidStr = cUnid.join(' ').trim();
        const iniciouNovaUnidadePrincipal = /^(L\d+|AP(?:TO)?\s*\d+|BL(?:OCO)?\s*[A-Z0-9]+|Q[A-Z0-9]+|\d{1,4}\s+[A-Z0-9]{1,4})\b/i.test(unidStr);

        // Quando surge um novo Tipo (ex: novo Proprietário ou Residente na mesma unidade) ou uma nova Unidade principal
        if (tipoDetectado || iniciouNovaUnidadePrincipal) {
            if (contatoAtual && (tipoDetectado || iniciouNovaUnidadePrincipal)) {
                finalizarContato();
            }
            contatoAtual = {
                unidParts: unidStr ? [unidStr] : [],
                colNome: [...cNome],
                tipo: tipoDetectado || 'Proprietário',
                colDoc: [...cDoc],
                colEmail: [...cMail]
            };
        } else if (contatoAtual) {
            // Linha de continuação (2ª linha do nome, telefone, continuação de unidade como "CONSTRUTORA" ou 2º e-mail)
            if (unidStr) contatoAtual.unidParts.push(unidStr);
            if (cNome.length) contatoAtual.colNome.push(...cNome);
            if (cDoc.length) contatoAtual.colDoc.push(...cDoc);
            if (cMail.length) contatoAtual.colEmail.push(...cMail);
        }
    });

    finalizarContato();
}

// 5. SEPARADOR INTELIGENTE DE BLOCO/QUADRA E UNIDADE/LOTE
function separarBlocoEUnidadeInteligente(unidCompleta) {
    const limpo = unidCompleta.replace(/\s+/g, ' ').trim();

    // Caso 1: Loteamento padrão Alphaville ("L01 A4", "L02 A4 CONSTRUTORA", "L06 A4-ACORDO JURIDICO")
    const matchLoteQuadra = limpo.match(/^L?(\d{1,4})\s+([A-Z0-9]{1,4})(?:\b|[-_\s]+)(.*)$/i);
    if (matchLoteQuadra) {
        const loteNum = matchLoteQuadra[1];
        const quadra = matchLoteQuadra[2];
        const sufixo = matchLoteQuadra[3] ? matchLoteQuadra[3].replace(/^[-_\s]+/, '').trim() : '';
        return {
            bloco: sufixo ? `${quadra} (${sufixo})` : quadra,
            unid: loteNum
        };
    }

    // Caso 2: "BLOCO A - 101" ou "A - 02"
    const matchBlocoTraco = limpo.match(/^(?:BLOCO\s*)?([A-Z0-9]{1,4})\s*[-/]\s*(\d{1,4})$/i);
    if (matchBlocoTraco) {
        return { bloco: matchBlocoTraco[1], unid: matchBlocoTraco[2] };
    }

    return { bloco: "A", unid: limpo };
}

// 6. MODO FLUXO CONTÍNUO (ARAGUAIA / INTEGRO / ASSISCON)
function extrairModoFluxoContinuo(linhas) {
    let blocoAtual = "A";
    let registroCorrente = null;

    const linhasHigienizadas = [];
    for (let i = 0; i < linhas.length; i++) {
        let atual = linhas[i];
        let prox = linhas[i + 1] ? linhas[i + 1].trim() : "";

        if ((atual.match(/@[A-Z0-9._-]+$/i) && prox.match(/^(COM|COM\.BR|BR|NET|ORG)\b/i)) ||
            (atual.endsWith('@GMAI') && prox.startsWith('LCOM')) ||
            (atual.endsWith('@HOTMAI') && prox.startsWith('LCOM'))) {
            if (prox === 'COM' && !atual.endsWith('.')) atual += '.COM';
            else if (prox === 'LCOM') atual += 'L.COM';
            else atual += prox;
            i++;
        }
        linhasHigienizadas.push(atual);
    }

    linhasHigienizadas.forEach(linha => {
        const lUpper = linha.toUpperCase().trim();
        if (lUpper.includes('RELAÇÃO DE CLIENTES DO IMÓVEL') ||
            lUpper.includes('INTEGRO GESTÃO EM COBRANÇA') ||
            lUpper.includes('TOTAL DE UNIDADES:') ||
            lUpper.includes('UNID.') ||
            lUpper.includes('PÁGINA:')) {
            return;
        }

        const matchBloco = lUpper.match(/^(?:BLOCO|TORRE|QUADRA)\s+([A-Z0-9]+)$/i);
        if (matchBloco) {
            blocoAtual = matchBloco[1].trim();
            return;
        }

        const matchUnid = lUpper.match(/^(\d{1,4})\s+(?:0\s+\d{4,6}|\d{4,6}\s+0)\b/);
        const matchSemUnid = !matchUnid && lUpper.match(/^(?:0\s+(\d{4,6})|(\d{4,6})\s+0)\s+(PROP|LOC|USU)/);

        if (matchUnid) {
            if (registroCorrente) registrosBrutosExtraidos.push(registroCorrente);
            registroCorrente = {
                modo: 'fluxo',
                unidOriginal: `${blocoAtual} - ${matchUnid[1]}`,
                bloco: blocoAtual,
                unidadeBruta: matchUnid[1],
                linhasBrutas: [linha]
            };
        } else if (matchSemUnid) {
            if (registroCorrente) registrosBrutosExtraidos.push(registroCorrente);
            const jaNoBloco = registrosBrutosExtraidos.filter(r => r.bloco === blocoAtual).length;
            const unidDeduzida = jaNoBloco === 0 ? "001" : "004";
            registroCorrente = {
                modo: 'fluxo',
                unidOriginal: `${blocoAtual} - ${unidDeduzida}`,
                bloco: blocoAtual,
                unidadeBruta: unidDeduzida,
                linhasBrutas: [linha]
            };
        } else if (registroCorrente) {
            registroCorrente.linhasBrutas.push(linha);
        }
    });

    if (registroCorrente) registrosBrutosExtraidos.push(registroCorrente);
}

// 7. FORMATADOR DE UNIDADE PARAMETRIZÁVEL
function formatarUnidadeParametrizada(reg) {
    const bloco = reg.bloco || "A";
    const unidBruta = reg.unidadeBruta || "";
    const regraEstrutura = document.getElementById('etl-regra-unidade')?.value || 'bloco_traco_unid';
    const regraZeros = document.getElementById('etl-regra-zeros')?.value || 'padrao_araguaia';
    const mascaraCustom = document.getElementById('etl-mascara-custom')?.value || '{BLOCO} - {UNID}';

    const boxCustom = document.getElementById('box-mascara-livre');
    if (boxCustom) boxCustom.style.display = regraEstrutura === 'mascara_livre' ? 'flex' : 'none';

    if (regraEstrutura === 'apenas_unid_intacta' && reg.unidOriginal) {
        return reg.unidOriginal;
    }

    let numInt = parseInt(String(unidBruta).replace(/\D/g, ''), 10);
    let unidFormatada = String(unidBruta).trim();

    if (!isNaN(numInt)) {
        if (regraZeros === 'padrao_araguaia') {
            unidFormatada = numInt < 100 ? String(numInt).padStart(2, '0') : String(numInt);
        } else if (regraZeros === 'sem_zero') {
            unidFormatada = String(numInt);
        } else if (regraZeros === 'tres_digitos') {
            unidFormatada = String(numInt).padStart(3, '0');
        }
    }

    if (regraEstrutura === 'bloco_traco_unid') {
        return `${bloco} - ${unidFormatada}`;
    } else if (regraEstrutura === 'bloco_num_2dig') {
        const bNum = isNaN(parseInt(bloco)) ? bloco : String(parseInt(bloco)).padStart(2, '0');
        return `${bNum} - ${unidFormatada}`;
    } else if (regraEstrutura === 'apenas_unid_sem_zero') {
        return String(numInt || unidBruta);
    } else if (regraEstrutura === 'mascara_livre') {
        return mascaraCustom.replace(/\{BLOCO\}/gi, bloco).replace(/\{UNID\}/gi, unidFormatada);
    }
    return `${bloco} - ${unidFormatada}`;
}

// 8. HIGIENIZADOR DE CONTATOS TABULARES (NOME, TELEFONES, CPF/CNPJ PURO E E-MAILS QUEBRADOS)
function extrairDadosRegistroTabular(reg) {
    const rawNomeTel = reg.colNome.join(' ').replace(/\s+/g, ' ').trim();

    // Extrai todos os telefones da coluna Nome/Telefone (com ou sem DDD, +55, parênteses ou fixo de 8 dígitos)
    const regexTelefones = /(?:\+55\s*)?(?:\(?\d{2,3}\)?\s*)?(?:9\s*)?\d{4,5}[-\s]?\d{4}\b/g;
    const telsEncontrados = [];
    let nomeLimpo = rawNomeTel.replace(regexTelefones, (match) => {
        const soDigitos = match.replace(/\D/g, '');
        if (soDigitos.length >= 8 && soDigitos.length <= 13) {
            telsEncontrados.push(match.replace(/^[+:;\s()-]+|[+:;\s()-]+$/g, '').trim());
            return ' ';
        }
        return match;
    });

    nomeLimpo = nomeLimpo
        .replace(/\b(Proprietário|Proprietaria|Residente|Morador|Locatário|Procurador|Dependente)\b/gi, ' ')
        .replace(/[();:+]/g, ' ')
        .replace(/\s+\/\s+/g, ' / ')
        .replace(/\s+/g, ' ')
        .replace(/^[\/\s-]+|[\/\s-]+$/g, '')
        .trim()
        .toUpperCase();

    // CPF/CNPJ (aceita formatado ou 11/14 dígitos seguidos como no Alphaville)
    const docBruto = reg.colDoc.join('').replace(/[^\d./-]/g, '').trim();
    let cpfCnpj = "";
    const matchDoc = docBruto.match(/\d{2,3}\.?\d{3}\.?\d{3}[\/-]?\d{4}-?\d{2}|\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\b\d{11,14}\b/);
    if (matchDoc) cpfCnpj = matchDoc[0];

    // Reconstrói e-mails que quebraram linha no meio (ex: "rafaela.\nbarros430@gmail.com" ou "@gmail.\ncom")
    let emailJoined = reg.colEmail.join('')
        .replace(/\s*;\s*/g, '; ')
        .replace(/\s+/g, '')
        .replace(/;/g, '; ')
        .replace(/\.corn\b/gi, '.com')
        .trim()
        .toLowerCase();

    // Classificação das colunas do Seu Condomínio segundo as regras oficiais do usuário
    const tUpper = (reg.tipoBruto || 'Proprietário').toUpperCase();
    const ehProprietario = tUpper.includes('PROP');
    const ehResidenteOuLoc = tUpper.includes('RESID') || tUpper.includes('LOC') || tUpper.includes('MORAD') || tUpper.includes('INQUIL') || tUpper.includes('DEPEND');
    const ehResponsavel = tUpper.includes('RESP') || tUpper.includes('PROCURADOR');

    return {
        unidadeTipo: ehProprietario ? "Proprietário" : "Morador",
        principal: ehProprietario ? "Sim" : "",
        moraUnidade: "Sim",
        responsavel: ehResponsavel ? "Sim" : "",
        locatario: ehResidenteOuLoc ? "Sim" : "",
        nome: nomeLimpo,
        cpfCnpj,
        email: emailJoined,
        telefones: [...new Set(telsEncontrados)].join(', ')
    };
}

function extrairPessoasDaUnidade(blocoTextoUnidade) {
    const textoUnido = blocoTextoUnidade.join(' \n ');

    let cpfCnpj = "";
    const matchCpf = textoUnido.match(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/);
    const matchCnpj = textoUnido.replace(/\s+/g, '').match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/);
    if (matchCpf) cpfCnpj = matchCpf[0];
    else if (matchCnpj) cpfCnpj = matchCnpj[0];

    const textoSemEspacoEmail = textoUnido
        .replace(/([A-Z0-9._-]+)\s+@([A-Z0-9._-]+)/gi, '$1@$2')
        .replace(/@HOTMAIL\s+COM/gi, '@HOTMAIL.COM')
        .replace(/@GMAIL\s+COM/gi, '@GMAIL.COM')
        .replace(/@OUTLOOK\s+COM/gi, '@OUTLOOK.COM');

    const matchesEmail = textoSemEspacoEmail.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
    const emailsUnicos = [...new Set(matchesEmail.map(e => e.toUpperCase()))];

    const textoLimpoDeCodigos = textoUnido
        .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, ' ')
        .replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\s*\d{2}/g, ' ')
        .replace(/^\d{1,4}\s+(?:0\s+\d{4,6}|\d{4,6}\s+0)/, ' ');

    const regexTel = /(?:\+55\s?)?(?:\(?\d{2,3}\)?\s?)?\d{4,5}-\s*\d{4}\b|\b55\d{10,11}\b|\b\d{2}\s+9?\s*\d{4}-?\d{4}\b/g;
    const matchesTel = textoLimpoDeCodigos.match(regexTel) || [];
    const telefonesUnicos = [...new Set(matchesTel.map(t => t.replace(/-\s+/g, '-').replace(/\s+/g, ' ').trim()))];

    const limparNome = (str) => {
        if (!str) return "";
        return str
            .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '')
            .replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, '')
            .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '')
            .replace(/(?:\+55\s?)?(?:\(?\d{2,3}\)?\s?)?\d{4,5}-\s*\d{4}/g, '')
            .replace(/\b55\d{10,11}\b/g, '')
            .replace(/[^A-ZÀ-Ú\s]/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toUpperCase();
    };

    const matchProp = textoUnido.match(/PROP[.,]?\s*([\s\S]*?)(?=\bLOC[.,]?\b|\bUSU[.,]?\b|$)/i);
    const matchLoc = textoUnido.match(/LOC[.,]?\s*([\s\S]*?)(?=\bUSU[.,]?\b|$)/i);
    const matchUsu = textoUnido.match(/USU[.,]?\s*([\s\S]*?)$/i);

    return {
        nomeProp: limparNome(matchProp ? matchProp[1] : ""),
        nomeLoc: limparNome(matchLoc ? matchLoc[1] : ""),
        nomeUsu: limparNome(matchUsu ? matchUsu[1] : ""),
        cpfCnpj,
        emailProp: emailsUnicos[0] || "",
        emailExtra: emailsUnicos[1] || "",
        telefones: telefonesUnicos.join(', '),
        temResponsavel: textoUnido.toUpperCase().includes('RESPONSÁVEL') || textoUnido.toUpperCase().includes('RESPONSAVEL')
    };
}

function reprocessarParametrizacaoAoVivo() {
    if (registrosBrutosExtraidos.length === 0) return;

    const usarApostrofo = document.getElementById('etl-regra-apostrofo')?.value === 'com_apostrofo';
    const protegerZero = (str) => {
        if (!str) return "";
        const limpo = String(str).trim();
        if (usarApostrofo && limpo.startsWith('0') && !limpo.startsWith("'")) {
            return `'${limpo}`;
        }
        return limpo;
    };

    linhasProntasParaSistema = [];

    registrosBrutosExtraidos.forEach(reg => {
        const unidFinal = formatarUnidadeParametrizada(reg);

        if (reg.modo === 'tabular') {
            const d = extrairDadosRegistroTabular(reg);
            if (d.nome) {
                linhasProntasParaSistema.push({
                    unidade: unidFinal,
                    limparUnidade: "",
                    unidadeTipo: d.unidadeTipo,
                    principal: d.principal,
                    moraUnidade: d.moraUnidade,
                    responsavel: d.responsavel,
                    locatario: d.locatario,
                    nome: d.nome,
                    cpfCnpj: protegerZero(d.cpfCnpj),
                    email: d.email,
                    telefones: protegerZero(d.telefones)
                });
            }
        } else {
            const dados = extrairPessoasDaUnidade(reg.linhasBrutas);
            if (dados.nomeProp) {
                linhasProntasParaSistema.push({
                    unidade: unidFinal,
                    limparUnidade: "",
                    unidadeTipo: "Proprietário",
                    principal: "Sim",
                    moraUnidade: "Sim",
                    responsavel: dados.temResponsavel ? "Sim" : "",
                    locatario: "",
                    nome: dados.nomeProp,
                    cpfCnpj: protegerZero(dados.cpfCnpj),
                    email: dados.emailProp,
                    telefones: protegerZero(dados.telefones)
                });
            }

            const moradorDiferente = (dados.nomeLoc && dados.nomeLoc !== dados.nomeProp && !dados.nomeProp.includes(dados.nomeLoc))
                ? dados.nomeLoc
                : ((dados.nomeUsu && dados.nomeUsu !== dados.nomeProp && !dados.nomeProp.includes(dados.nomeUsu)) ? dados.nomeUsu : "");

            if (moradorDiferente) {
                linhasProntasParaSistema.push({
                    unidade: unidFinal,
                    limparUnidade: "",
                    unidadeTipo: "Morador",
                    principal: "",
                    moraUnidade: "Sim",
                    responsavel: "",
                    locatario: "Sim",
                    nome: moradorDiferente,
                    cpfCnpj: "",
                    email: dados.emailExtra || "",
                    telefones: ""
                });
            }
        }
    });

    renderizarTabelaExtraida();
}

function renderizarTabelaExtraida() {
    const tbody = document.getElementById('tbody-extrator-unidades');
    if (!tbody) return;

    const termo = (document.getElementById('etl-busca-tabela')?.value || "").toLowerCase().trim();
    const visiveis = linhasProntasParaSistema.filter(l => {
        if (!termo) return true;
        return l.unidade.toLowerCase().includes(termo) ||
               l.nome.toLowerCase().includes(termo) ||
               l.cpfCnpj.toLowerCase().includes(termo) ||
               l.email.toLowerCase().includes(termo);
    });

    document.getElementById('etl-stat-total').innerText = linhasProntasParaSistema.length;
    document.getElementById('etl-stat-prop').innerText = linhasProntasParaSistema.filter(l => l.unidadeTipo === 'Proprietário').length;
    document.getElementById('etl-stat-mor').innerText = linhasProntasParaSistema.filter(l => l.unidadeTipo === 'Morador').length;

    if (visiveis.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding: 30px; color: var(--text-muted);">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    // Validação visual: detecta unidades vazias/duplicadas, CPF/CNPJ com dígitos inválidos e e-mail malformado
    const contagemUnid = new Map();
    linhasProntasParaSistema.forEach(l => {
        const key = `${(l.unidade || '').trim().toUpperCase()}|${l.unidadeTipo}`;
        contagemUnid.set(key, (contagemUnid.get(key) || 0) + 1);
    });

    const frag = document.createDocumentFragment();
    visiveis.forEach((linha, idx) => {
        const tr = document.createElement('tr');
        const badgeClass = linha.unidadeTipo === 'Proprietário' ? 'badge-tipo-prop' : 'badge-tipo-mor';

        const unidLimpa = (linha.unidade || '').trim();
        const unidDuplicada = unidLimpa && (contagemUnid.get(`${unidLimpa.toUpperCase()}|${linha.unidadeTipo}`) > 1);
        const clsUnid = (!unidLimpa || unidDuplicada) ? 'etl-cell-warn' : '';

        const cpfDigitos = (linha.cpfCnpj || '').replace(/\D/g, '');
        const clsCpf = (cpfDigitos && cpfDigitos.length !== 11 && cpfDigitos.length !== 14) ? 'etl-cell-warn' : '';

        const emailVal = (linha.email || '').trim();
        const clsEmail = (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) ? 'etl-cell-err' : '';

        tr.innerHTML = `
            <td><span class="unid-pill ${clsUnid}" contenteditable="true" onblur="atualizarCelulaETL(${idx}, 'unidade', this.innerText)" ${unidDuplicada ? 'data-tip="Atenção: mesma unidade + tipo duplicada"' : ''}>${linha.unidade}</span></td>
            <td></td>
            <td><span class="${badgeClass}">${linha.unidadeTipo}</span></td>
            <td>${linha.principal}</td>
            <td>${linha.moraUnidade}</td>
            <td>${linha.responsavel}</td>
            <td>${linha.locatario}</td>
            <td contenteditable="true" style="font-weight: 700; color: white;" onblur="atualizarCelulaETL(${idx}, 'nome', this.innerText)">${linha.nome}</td>
            <td class="${clsCpf}" contenteditable="true" style="font-family: monospace;" onblur="atualizarCelulaETL(${idx}, 'cpfCnpj', this.innerText)" ${clsCpf ? 'data-tip="CPF/CNPJ com quantidade de dígitos incomum"' : ''}>${linha.cpfCnpj}</td>
            <td class="${clsEmail}" contenteditable="true" style="color: #93c5fd;" onblur="atualizarCelulaETL(${idx}, 'email', this.innerText)" ${clsEmail ? 'data-tip="E-mail parece incompleto ou inválido"' : ''}>${linha.email}</td>
            <td contenteditable="true" onblur="atualizarCelulaETL(${idx}, 'telefones', this.innerText)">${linha.telefones}</td>
            <td>
                <button class="icon-btn" onclick="removerLinhaETL(${idx})" data-tip="Remover esta linha">
                    <span class="material-icons-round" style="font-size: 14px;">close</span>
                </button>
            </td>
        `;
        frag.appendChild(tr);
    });
    tbody.innerHTML = '';
    tbody.appendChild(frag);
}

function atualizarCelulaETL(idx, campo, valor) {
    if (linhasProntasParaSistema[idx]) {
        linhasProntasParaSistema[idx][campo] = valor.trim();
    }
}

function removerLinhaETL(idx) {
    linhasProntasParaSistema.splice(idx, 1);
    renderizarTabelaExtraida();
}

function limparExtrator() {
    registrosBrutosExtraidos = [];
    linhasProntasParaSistema = [];
    document.getElementById('label-nome-pdf').innerText = "Clique para carregar o PDF de Unidades (Ex: Alphaville / Araguaia)";
    document.getElementById('status-leitura-pdf').innerText = "Extração instantânea de todas as páginas";
    renderizarTabelaExtraida();
}

function copiarTabelaParaSeuCondominio(incluirCabecalho = false) {
    if (linhasProntasParaSistema.length === 0) return mostrarToast("Carregue um PDF primeiro!");

    const linhasTSV = [];
    if (incluirCabecalho) {
        linhasTSV.push([
            "Unidade", "Limpar Unidade", "Unidade Tipo", "Principal",
            "Mora Unidade", "Responsável", "Locatário", "Nome",
            "CPF/CNPJ", "E-mail", "Telefones"
        ].join('\t'));
    }

    linhasProntasParaSistema.forEach(l => {
        linhasTSV.push([
            l.unidade,
            l.limparUnidade,
            l.unidadeTipo,
            l.principal,
            l.moraUnidade,
            l.responsavel,
            l.locatario,
            l.nome,
            l.cpfCnpj,
            l.email,
            l.telefones
        ].join('\t'));
    });

    navigator.clipboard.writeText(linhasTSV.join('\n'));
    mostrarToast(`✓ ${linhasProntasParaSistema.length} linhas copiadas! Só dar Ctrl+V no Seu Condomínio ou Excel.`);
}

function baixarPlanilhaExcelPronta() {
    if (linhasProntasParaSistema.length === 0) return mostrarToast("Carregue um PDF primeiro!");
    if (!window.XLSX) return mostrarToast("Biblioteca Excel carregando...");

    const matriz = linhasProntasParaSistema.map(l => [
        l.unidade,
        l.limparUnidade,
        l.unidadeTipo,
        l.principal,
        l.moraUnidade,
        l.responsavel,
        l.locatario,
        l.nome,
        l.cpfCnpj,
        l.email,
        l.telefones
    ]);

    const ws = window.XLSX.utils.aoa_to_sheet(matriz);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Formatação de Dados de Unidades");
    window.XLSX.writeFile(wb, `Unidades_Prontas_SeuCondominio_${new Date().toISOString().slice(0,10)}.xlsx`);

    mostrarToast("📊 Planilha .XLSX baixada no formato exato do Seu Condomínio!");
}

// ==============================================================
// MÓDULO 4: MOTOR DO DIÁRIO CÓSMICO PRO (CTRL+Z TOTAL, 7 LINHAS FIXAS E NUMERAÇÃO SELECIONÁVEL)
// ==============================================================
let listaChatPessoal = JSON.parse(localStorage.getItem('sc_chat_pessoal_v1')) || [];

let filtroChatAtual = 'todos';
let listaAnexosStaging = [];
let corBalaoSelecionada = 'roxo';
let indiceFixadoBanner = 0;
let paginaAtualIcones = 0;
let rangeSelecaoSalva = null;
let bloqueioBarraFlutuante = false; // Impede a barra de reabrir sozinha após colorir!

// PILHA DE HISTÓRICO (TIME-MACHINE) PARA O CTRL+Z E CTRL+Y FUNCIONAREM EM 100% DAS AÇÕES!
let historicoUndoRico = [];
let indiceHistoricoUndo = -1;
let aplicandoUndoRedo = false;

const PAGINAS_ICONES_CHAT = [
    {
        titulo: "1/3 • SUPORTE & GESTÃO",
        icones: ['⚠️', '✅', '🚨', '📌', '🛠️', '📞', '💬', '👤', '🏢', '🔑', '🔒', '🔓', '📎', '📋', '🔍', '💡', '⏳', '🎯']
    },
    {
        titulo: "2/3 • FINANCEIRO & DOCS",
        icones: ['💰', '💳', '🏦', '📄', '📊', '📈', '📉', '🧾', '💲', '🪙', '📅', '📆', '📁', '🗂️', '✉️', '📨', '🖨️', '🧮']
    },
    {
        titulo: "3/3 • COSMOS & DESTAQUES",
        icones: ['✨', '🚀', '🌌', '⭐', '🌟', '⚡', '🔥', '💎', '👑', '🛡️', '🎉', '❤️', '🟢', '🟡', '🔴', '🔵', '➡️', '☑️']
    }
];

function obterEditorRico() {
    return document.getElementById('chat-composer-input');
}

// 1. MOTOR TIME-MACHINE DE CTRL+Z / CTRL+Y (DESFAZ QUALQUER AÇÃO PASSO A PASSO!)
function registrarEstadoUndo(forcar = false) {
    if (aplicandoUndoRedo) return;
    const editor = obterEditorRico();
    if (!editor) return;

    const htmlAtual = editor.innerHTML;
    if (!forcar && indiceHistoricoUndo >= 0 && historicoUndoRico[indiceHistoricoUndo] === htmlAtual) {
        return;
    }

    // Remove futuros caso tenha feito Undo e digitado algo novo
    historicoUndoRico = historicoUndoRico.slice(0, indiceHistoricoUndo + 1);
    historicoUndoRico.push(htmlAtual);

    if (historicoUndoRico.length > 80) {
        historicoUndoRico.shift();
    } else {
        indiceHistoricoUndo++;
    }
}

function acionarUndoRico() {
    const editor = obterEditorRico();
    if (!editor || indiceHistoricoUndo <= 0) return;

    aplicandoUndoRedo = true;
    indiceHistoricoUndo--;
    editor.innerHTML = historicoUndoRico[indiceHistoricoUndo];
    posicionarCursorNoFimDoEditor(editor);
    esconderBarraFlutuanteEDesmarcar(false);
    aplicandoUndoRedo = false;
}

function acionarRedoRico() {
    const editor = obterEditorRico();
    if (!editor || indiceHistoricoUndo >= historicoUndoRico.length - 1) return;

    aplicandoUndoRedo = true;
    indiceHistoricoUndo++;
    editor.innerHTML = historicoUndoRico[indiceHistoricoUndo];
    posicionarCursorNoFimDoEditor(editor);
    esconderBarraFlutuanteEDesmarcar(false);
    aplicandoUndoRedo = false;
}

function posicionarCursorNoFimDoEditor(editor) {
    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function salvarSelecaoEditorRico() {
    const sel = window.getSelection();
    const editor = obterEditorRico();
    if (sel && sel.rangeCount > 0 && editor && editor.contains(sel.anchorNode)) {
        rangeSelecaoSalva = sel.getRangeAt(0).cloneRange();
    }
}

function restaurarSelecaoEditorRico() {
    const editor = obterEditorRico();
    if (!editor) return;
    editor.focus();
    if (rangeSelecaoSalva) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(rangeSelecaoSalva);
    }
}

// Fecha a barra flutuante e tira o azul da seleção na hora para não atrapalhar!
function esconderBarraFlutuanteEDesmarcar(desmarcarTexto = true) {
    bloqueioBarraFlutuante = true;
    const bar = document.getElementById('rich-floating-toolbar');
    if (bar) bar.style.display = 'none';

    if (desmarcarTexto) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
            sel.collapseToEnd();
        }
        rangeSelecaoSalva = null;
    }

    setTimeout(() => { bloqueioBarraFlutuante = false; }, 250);
}

function salvarChatLocal() {
    try {
        localStorage.setItem('sc_chat_pessoal_v1', JSON.stringify(listaChatPessoal));
    } catch (e) {
        console.warn("Armazenamento local cheio; sincronizando com Supabase.");
    }
    atualizarContadorChatSidebar();
}

function atualizarContadorChatSidebar() {
    const el = document.getElementById('contador-chat-sidebar');
    if (el) el.innerText = listaChatPessoal.length;
}

// 2. PAGINADOR DE ÍCONES (1/3, 2/3, 3/3)
function renderizarPaginaIcones() {
    const container = document.getElementById('emoji-buttons-container');
    const titleEl = document.getElementById('emoji-page-title');
    if (!container || !titleEl) return;

    const pag = PAGINAS_ICONES_CHAT[paginaAtualIcones];
    titleEl.innerText = pag.titulo;
    container.innerHTML = '';

    pag.icones.forEach(ic => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = ic;
        btn.onmousedown = (e) => e.preventDefault();
        btn.onclick = () => inserirIconeChat(ic + ' ');
        container.appendChild(btn);
    });
}

function mudarPaginaIcones(direcao) {
    paginaAtualIcones = (paginaAtualIcones + direcao + PAGINAS_ICONES_CHAT.length) % PAGINAS_ICONES_CHAT.length;
    renderizarPaginaIcones();
}

// 3. PERSONALIZADOR DE FUNDO DO CHAT
function toggleMenuFundoChat(e) {
    e.stopPropagation();
    const menu = document.getElementById('chat-bg-dropdown');
    if (!menu) return;
    const abrir = menu.style.display === 'none';
    fecharTodosPopoversChat();
    menu.style.display = abrir ? 'flex' : 'none';
}

function mudarFundoChat(classeTema, customDataUrl = null) {
    const shell = document.getElementById('cosmic-chat-shell');
    if (!shell) return;

    shell.classList.remove(
        'bg-theme-cosmos', 'bg-theme-orion', 'bg-theme-biolum',
        'bg-theme-supernova', 'bg-theme-synthwave', 'bg-theme-matrix',
        'bg-theme-aurora', 'bg-theme-gold', 'bg-theme-abyss'
    );

    if (customDataUrl) {
        shell.style.backgroundImage = `linear-gradient(rgba(4, 6, 14, 0.76), rgba(4, 6, 14, 0.84)), url('${customDataUrl}')`;
        localStorage.setItem('sc_chat_bg_custom', customDataUrl);
        localStorage.removeItem('sc_chat_bg_theme');
    } else {
        shell.style.backgroundImage = '';
        shell.classList.add(classeTema);
        localStorage.setItem('sc_chat_bg_theme', classeTema);
        localStorage.removeItem('sc_chat_bg_custom');
    }
    fecharTodosPopoversChat();
}

async function subirImagemFundoChat(event) {
    const file = event.target.files[0];
    if (!file) return;
    const base64 = await comprimirImagemParaBase64(file, 1600, 0.85);
    mudarFundoChat(null, base64);
    event.target.value = '';
}

function restaurarFundoSalvoChat() {
    const custom = localStorage.getItem('sc_chat_bg_custom');
    const tema = localStorage.getItem('sc_chat_bg_theme') || 'bg-theme-cosmos';
    if (custom) mudarFundoChat(null, custom);
    else mudarFundoChat(tema);
}

// 4. MULTI-SELEÇÃO, LISTAS SELECIONÁVEIS (1. 2. 3.) E CORES COM AUTO-OCULTAÇÃO
function togglePopoverChat(idPopover, e) {
    e.stopPropagation();
    salvarSelecaoEditorRico();
    const el = document.getElementById(idPopover);
    if (!el) return;
    const abrir = el.style.display === 'none';
    fecharTodosPopoversChat();
    if (idPopover === 'popover-emojis') renderizarPaginaIcones();
    el.style.display = abrir ? 'flex' : 'none';
}

function fecharTodosPopoversChat() {
    ['popover-emojis', 'popover-text-color', 'popover-tags-chat', 'chat-bg-dropdown'].forEach(id => {
        const p = document.getElementById(id);
        if (p) p.style.display = 'none';
    });
}
document.addEventListener('click', fecharTodosPopoversChat);

function limparMarcacoesMultiSelecao() {
    const editor = obterEditorRico();
    if (!editor) return;
    editor.querySelectorAll('.multi-sel-chunk').forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
    });
}

function aplicarEmMultiplasSelecoes(callbackEstilo) {
    const editor = obterEditorRico();
    if (!editor) return false;
    const chunks = editor.querySelectorAll('.multi-sel-chunk');
    if (chunks.length === 0) return false;

    chunks.forEach(chunk => {
        const range = document.createRange();
        range.selectNodeContents(chunk);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        callbackEstilo();
    });

    limparMarcacoesMultiSelecao();
    return true;
}

// Insere numeração "1. ", "2. ", "3. " ou tópico "• " como TEXTO REAL SELECIONÁVEL para você poder selecionar e pintar o número!
// Converte a seleção em Lista Numerada (1. 2. 3.), Tópico (•) ou Checklist ([ ]) PRESERVANDO 100% DO NEGRITO E CORES!
function inserirListaTextoSelecionavel(tipo) {
    const editor = obterEditorRico();
    if (!editor) return;
    registrarEstadoUndo();
    restaurarSelecaoEditorRico();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);

    // CASO 1: O usuário selecionou uma ou várias frases/linhas (Preserva Negrito, Itálico e Cores!)
    if (!sel.isCollapsed) {
        const containerTemp = document.createElement('div');
        containerTemp.appendChild(range.cloneContents());

        // Transforma quebras de bloco (<div>, <p>, <li>) em <br> para separar linha por linha mantendo o HTML rico!
        containerTemp.querySelectorAll('div, p, li').forEach(bloco => {
            bloco.insertAdjacentHTML('beforebegin', '<br>');
            while (bloco.firstChild) bloco.parentNode.insertBefore(bloco.firstChild, bloco);
            bloco.remove();
        });

        let partesHTML = containerTemp.innerHTML
            .replace(/^(\s*<br\s*\/?>)+/i, '')
            .split(/<br\s*\/?>/i);

        // Calcula o número inicial caso seja apenas 1 linha selecionada no meio do texto
        const rangeAntes = range.cloneRange();
        rangeAntes.selectNodeContents(editor);
        rangeAntes.setEnd(range.startContainer, range.startOffset);
        const matchesAntes = [...rangeAntes.toString().matchAll(/(?:^|\n)\s*(\d+)\.\s/g)];
        let contadorNum = matchesAntes.length > 0 ? parseInt(matchesAntes[matchesAntes.length - 1][1], 10) + 1 : 1;

        const linhasFormatadas = partesHTML.map((htmlLinha) => {
            const tempCheck = document.createElement('div');
            tempCheck.innerHTML = htmlLinha;
            if (!tempCheck.innerText.trim() && partesHTML.length > 1) return '';

            // Remove numeração ou marcador antigo se já tiver no início, sem perder as tags <strong>/<span>
            const htmlSemMarcadorAntigo = htmlLinha.replace(/^(\s*(?:<[^>]+>)*\s*)(?:\d+\.|•|[[ xX]])(?:\s|&nbsp;)*/i, '$1');

            if (tipo === 'numerada') return `${contadorNum++}.&nbsp;${htmlSemMarcadorAntigo}`;
            if (tipo === 'checklist') return `[ ]&nbsp;${htmlSemMarcadorAntigo}`;
            return `•&nbsp;${htmlSemMarcadorAntigo}`;
        }).filter(Boolean).join('<br>');

        document.execCommand('insertHTML', false, linhasFormatadas);
        salvarSelecaoEditorRico();
        registrarEstadoUndo();
        esconderBarraFlutuanteEDesmarcar(true);
        return;
    }

    // CASO 2: Nenhum texto selecionado (Apenas clicou no botão para começar a digitar o item)
    const rangeAteCursor = range.cloneRange();
    rangeAteCursor.selectNodeContents(editor);
    rangeAteCursor.setEnd(range.startContainer, range.startOffset);
    const textoAntes = rangeAteCursor.toString();
    const precisaQuebra = textoAntes.length > 0 && !textoAntes.endsWith('\n');

    if (tipo === 'numerada') {
        const matches = [...textoAntes.matchAll(/(?:^|\n)\s*(\d+)\.\s/g)];
        const proxNum = matches.length > 0 ? parseInt(matches[matches.length - 1][1], 10) + 1 : 1;
        document.execCommand('insertHTML', false, `${precisaQuebra ? '<br>' : ''}${proxNum}.&nbsp;`);
    } else if (tipo === 'checklist') {
        document.execCommand('insertHTML', false, `${precisaQuebra ? '<br>' : ''}[ ]&nbsp;`);
    } else {
        document.execCommand('insertHTML', false, `${precisaQuebra ? '<br>' : ''}•&nbsp;`);
    }

    salvarSelecaoEditorRico();
    registrarEstadoUndo();
    esconderBarraFlutuanteEDesmarcar(false);
}

function executarComandoRico(comando, valor = null) {
    registrarEstadoUndo();

    if (comando === 'insertOrderedList') {
        inserirListaTextoSelecionavel('numerada');
        return;
    }
    if (comando === 'insertUnorderedList') {
        inserirListaTextoSelecionavel('topico');
        return;
    }

    const aplicouMulti = aplicarEmMultiplasSelecoes(() => {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand(comando, false, valor);
    });

    if (!aplicouMulti) {
        restaurarSelecaoEditorRico();
        document.execCommand('styleWithCSS', false, true);
        document.execCommand(comando, false, valor);
    }

    registrarEstadoUndo();
    esconderBarraFlutuanteEDesmarcar(true);
}

function colorirSelecaoRica(hexCor) {
    registrarEstadoUndo();

    const pintarComMarcador = () => {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, hexCor);

        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
            const liPai = sel.anchorNode.nodeType === 1 ? sel.anchorNode.closest('li') : sel.anchorNode.parentElement?.closest('li');
            if (liPai) liPai.style.color = hexCor;
        }
    };

    const aplicouMulti = aplicarEmMultiplasSelecoes(pintarComMarcador);
    if (!aplicouMulti) {
        restaurarSelecaoEditorRico();
        pintarComMarcador();
    }

    const iconeCor = document.getElementById('icone-cor-texto-ativa');
    if (iconeCor) iconeCor.style.color = hexCor;

    registrarEstadoUndo();
    fecharTodosPopoversChat();
    esconderBarraFlutuanteEDesmarcar(true);
}

function destacarFundoRico(rgbaCor) {
    registrarEstadoUndo();

    const aplicouMulti = aplicarEmMultiplasSelecoes(() => {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('hiliteColor', false, rgbaCor);
    });

    if (!aplicouMulti) {
        restaurarSelecaoEditorRico();
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('hiliteColor', false, rgbaCor);
    }

    registrarEstadoUndo();
    fecharTodosPopoversChat();
    esconderBarraFlutuanteEDesmarcar(true);
}

function inserirElementoDOMNoCursor(elementoDOM) {
    registrarEstadoUndo();
    restaurarSelecaoEditorRico();
    const editor = obterEditorRico();
    if (!editor) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
        editor.appendChild(elementoDOM);
        registrarEstadoUndo();
        return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const espacoDepois = document.createTextNode('\u00A0');
    range.insertNode(espacoDepois);
    range.insertNode(elementoDOM);

    range.setStartAfter(espacoDepois);
    range.setEndAfter(espacoDepois);
    sel.removeAllRanges();
    sel.addRange(range);

    salvarSelecaoEditorRico();
    registrarEstadoUndo();
    esconderBarraFlutuanteEDesmarcar(false);
}

function inserirCodigoRico() {
    restaurarSelecaoEditorRico();
    const sel = window.getSelection();
    const textoSelecionado = sel && sel.toString().trim() ? sel.toString() : 'código';

    const codeEl = document.createElement('code');
    codeEl.textContent = textoSelecionado;
    inserirElementoDOMNoCursor(codeEl);
}

function inserirChecklistRico() {
    inserirListaTextoSelecionavel('checklist');
}

function inserirTagRica(nomeTag, corHex) {
    const spanTag = document.createElement('span');
    spanTag.className = 'chat-tag-pill';
    spanTag.contentEditable = 'false';
    spanTag.style.cssText = `background:rgba(255,255,255,0.08); border:1px solid ${corHex}; color:${corHex}; padding:1px 8px; border-radius:6px; font-size:11px; font-weight:800; display:inline-block; margin:0 2px;`;
    spanTag.textContent = nomeTag;

    inserirElementoDOMNoCursor(spanTag);
    fecharTodosPopoversChat();
}

function inserirIconeChat(icone) {
    registrarEstadoUndo();
    restaurarSelecaoEditorRico();
    document.execCommand('insertText', false, icone);
    salvarSelecaoEditorRico();
    registrarEstadoUndo();
    fecharTodosPopoversChat();
}

function selecionarCorBalao(cor, btnEl) {
    corBalaoSelecionada = cor;
    document.querySelectorAll('.b-color-dot').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
}

// Expande ou recolhe das 7 linhas travadas (só quando você clica no botão Expandir!)
function alternarAlturaEditorChat() {
    const area = obterEditorRico();
    const lbl = document.getElementById('label-btn-expandir');
    if (area) {
        const expandido = area.classList.toggle('super-expanded');
        if (lbl) lbl.innerText = expandido ? 'Recolher (7 Linhas)' : 'Expandir';
        area.focus();
    }
}

function verificarBarraFlutuanteSelecao() {
    if (bloqueioBarraFlutuante) return;
    const modChat = document.getElementById('modulo-chat');
    if (!modChat || modChat.style.display === 'none') return;
    const bar = document.getElementById('rich-floating-toolbar');
    const editor = obterEditorRico();
    if (!bar || !editor) return;

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed && editor.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width > 0) {
            salvarSelecaoEditorRico();
            bar.style.display = 'flex';

            let leftPos = rect.left + (rect.width / 2);
            let topPos = rect.top - 6;

            leftPos = Math.max(130, Math.min(window.innerWidth - 130, leftPos));
            if (topPos < 50) topPos = rect.bottom + 42;

            bar.style.left = `${leftPos}px`;
            bar.style.top = `${topPos}px`;
            return;
        }
    }
    bar.style.display = 'none';
}

document.addEventListener('selectionchange', verificarBarraFlutuanteSelecao);

// 5. SINCRONIZAÇÃO COM SUPABASE
async function sincronizarChatComSupabase(mostrarAviso = false) {
    const badge = document.getElementById('chat-cloud-badge');
    if (!supabaseClient || !SUPABASE_URL) {
        if (badge) {
            badge.innerText = "💾 Salvo no PC";
            badge.style.color = "#fde68a";
        }
        if (mostrarAviso) mostrarToast("Adicione sua SUPABASE_URL na linha 4 do app.js para sincronizar na nuvem!");
        return;
    }

    try {
        if (badge) badge.innerText = "🔄 Sincronizando...";
        const { data, error } = await supabaseClient
            .from('sc_chat_pessoal')
            .select('*')
            .order('id', { ascending: true });

        if (!error && Array.isArray(data)) {
            const mapaUnico = new Map();
            listaChatPessoal.forEach(item => mapaUnico.set(Number(item.id), item));
            data.forEach(itemNuvem => mapaUnico.set(Number(itemNuvem.id), itemNuvem));

            listaChatPessoal = Array.from(mapaUnico.values()).sort((a, b) => Number(a.id) - Number(b.id));
            salvarChatLocal();
            renderizarMensagensChat();

            const idsNuvem = new Set(data.map(d => Number(d.id)));
            const faltantes = listaChatPessoal.filter(i => !idsNuvem.has(Number(i.id)));
            if (faltantes.length > 0) {
                await supabaseClient.from('sc_chat_pessoal').upsert(faltantes.map(serializarMsgParaSupabase));
            }
        }
        if (badge) {
            badge.innerText = "☁️ Sincronizado no Supabase";
            badge.style.color = "#6ee7b7";
        }
        if (mostrarAviso) mostrarToast("☁️ Diário sincronizado com sucesso!");
    } catch (err) {
        if (badge) badge.innerText = "💾 Salvo Localmente";
    }
}

function serializarMsgParaSupabase(msg) {
    return {
        id: msg.id,
        texto: msg.texto,
        midia_tipo: msg.midia_tipo || '',
        midia_url: msg.midia_url || '',
        midia_nome: msg.midia_nome || '',
        fixado: !!msg.fixado,
        criado_em: `${msg.criado_em || ''}|cor:${msg.cor_balao || 'roxo'}`
    };
}

// 6. RENDERIZADOR DO BALÃO
function limparMarkdownParaBanner(texto) {
    if (!texto) return "";
    const temp = document.createElement('div');
    temp.innerHTML = texto;
    const puro = temp.textContent || temp.innerText || "";
    return puro
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\[(?:amarelo\vert{}verde\vert{}azul\vert{}rosa\vert{}vermelho)\](.*?)\[\/(?:amarelo\vert{}verde\vert{}azul\vert{}rosa\vert{}vermelho)\]/gi, '$1')
        .replace(/[[ xX]]\s*/g, '☑️ ')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatarConteudoBalaoChat(conteudo, msgId) {
    if (!conteudo) return "";
    let html = conteudo;

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    ['amarelo', 'verde', 'azul', 'rosa', 'vermelho'].forEach(cor => {
        const reg = new RegExp(`\\[${cor}\\]([\\s\\S]*?)\\[\\/${cor}\\]`, 'gi');
        html = html.replace(reg, `<span class="txt-cor-${cor}">$1</span>`);
    });

    const mapaTagsAuto = {
        '#importante': '#fef08a',
        '#senha': '#38bdf8',
        '#financeiro': '#6ee7b7',
        '#bug': '#fca5a5',
        '#condomínio': '#e9d5ff',
        '#condominio': '#e9d5ff'
    };
    html = html.replace(/(^|\s|>)(#(Importante|Senha|Financeiro|Bug|Condomínio|Condominio))\b/gi, (full, pre, tagTxt) => {
        const cor = mapaTagsAuto[tagTxt.toLowerCase()] || '#38bdf8';
        return `${pre}<span class="chat-tag-pill" style="background:rgba(255,255,255,0.08); border:1px solid ${cor}; color:${cor};">${tagTxt}</span>`;
    });

    let checkIndex = 0;
    html = html.replace(/\[([ xX])\]\s*([^<\n]+)/g, (match, estado, itemTexto) => {
        const marcado = estado.toLowerCase() === 'x';
        const idxAtual = checkIndex++;
        return `<label class="chat-check-item ${marcado ? 'concluido' : ''}" onclick="event.stopPropagation()">
            <input type="checkbox" ${marcado ? 'checked' : ''} onchange="alternarCheckNaMensagem(${msgId}, ${idxAtual}, this.checked)">
            <span>${itemTexto}</span>
        </label>`;
    });

    return html;
}

function alternarCheckNaMensagem(msgId, checkIdx, marcado) {
    const item = listaChatPessoal.find(m => m.id === msgId);
    if (!item || !item.texto) return;

    let contador = 0;
    item.texto = item.texto.replace(/\[([ xX])\](\s*[^<\n]+)/g, (full, est, pos) => {
        if (contador++ === checkIdx) {
            return `[${marcado ? 'x' : ' '}]${pos}`;
        }
        return full;
    });

    salvarChatLocal();
    renderizarMensagensChat(false);
    if (supabaseClient && SUPABASE_URL) {
        supabaseClient.from('sc_chat_pessoal').upsert(serializarMsgParaSupabase(item)).then(() => {});
    }
}

// ==============================================================
// COMPRESSOR OTIMIZADO DE MÍDIAS PARA EVITAR ESTOURO DE PAYLOAD
// ==============================================================
function comprimirImagemParaBase64(file, maxDim = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                    if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                    else { w = Math.round(w * (maxDim / h)); h = maxDim; }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                // Retorna em JPEG compactado para não estourar o limite da API
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

async function adicionarArquivosNaFilaStaging(filesList) {
    const arquivos = Array.from(filesList);
    for (const file of arquivos) {
        if (listaAnexosStaging.length >= 10) {
            mostrarToast("⚠️ Limite máximo de 10 mídias por mensagem atingido!");
            break;
        }

        const tipo = file.type.startsWith('image/') ? 'imagem' : (file.type.startsWith('video/') ? 'video' : 'arquivo');
        const nome = file.name && file.name !== 'image.png'
            ? file.name
            : `Print_${listaAnexosStaging.length + 1}_${new Date().toLocaleTimeString('pt-BR').replace(/:/g, '-')}.jpg`;

        if (tipo === 'imagem') {
            const dataUrl = await comprimirImagemParaBase64(file);
            listaAnexosStaging.push({ tipo: 'imagem', url: dataUrl, nome });
        } else {
            const dataUrl = await new Promise((res) => {
                if (file.size <= 8 * 1024 * 1024) {
                    const r = new FileReader();
                    r.onload = (ev) => res(ev.target.result);
                    r.readAsDataURL(file);
                } else {
                    res(URL.createObjectURL(file));
                }
            });
            listaAnexosStaging.push({ tipo, url: dataUrl, nome });
        }
    }
    renderizarCarrosselStaging();
}

function renderizarCarrosselStaging() {
    const area = document.getElementById('chat-staging-area');
    const track = document.getElementById('staging-thumbnails-track');
    const badge = document.getElementById('staging-counter-badge');
    if (!area || !track) return;

    if (listaAnexosStaging.length === 0) {
        area.style.display = 'none';
        track.innerHTML = '';
        return;
    }

    area.style.display = 'flex';
    badge.innerText = `📸 ${listaAnexosStaging.length} / 10 mídias prontas`;
    track.innerHTML = '';

    listaAnexosStaging.forEach((anexo, idx) => {
        const card = document.createElement('div');
        card.className = 'staging-thumb-card';
        if (anexo.tipo === 'imagem') {
            card.innerHTML = `<img src="${anexo.url}" alt="${anexo.nome}">`;
        } else if (anexo.tipo === 'video') {
            card.innerHTML = `<video src="${anexo.url}" muted></video>`;
        } else {
            card.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--neon-blue);"><span class="material-icons-round">description</span></div>`;
        }
        card.innerHTML += `<button type="button" class="staging-thumb-remove" onclick="removerItemStaging(${idx})" data-tip="Remover esta mídia">✕</button>`;
        track.appendChild(card);
    });
}

function removerItemStaging(idx) {
    listaAnexosStaging.splice(idx, 1);
    renderizarCarrosselStaging();
}

function cancelarAnexoChat() {
    listaAnexosStaging = [];
    renderizarCarrosselStaging();
}

function aoSelecionarArquivoChat(event) {
    if (event.target.files && event.target.files.length > 0) {
        adicionarArquivosNaFilaStaging(event.target.files);
    }
    event.target.value = '';
}

// 8. ENVIAR MENSAGEM
async function enviarMensagemChatPessoal() {
    limparMarcacoesMultiSelecao();
    const editor = obterEditorRico();
    const textoPuro = editor ? editor.innerText.trim() : "";
    const htmlRico = editor ? editor.innerHTML.trim() : "";

    if (!textoPuro && listaAnexosStaging.length === 0) {
        return mostrarToast("Digite uma anotação ou cole até 10 prints (Ctrl+V)!");
    }

    let midiaTipo = "";
    let midiaUrl = "";
    let midiaNome = "";

    if (listaAnexosStaging.length === 1) {
        midiaTipo = listaAnexosStaging[0].tipo;
        midiaUrl = listaAnexosStaging[0].url;
        midiaNome = listaAnexosStaging[0].nome;
    } else if (listaAnexosStaging.length > 1) {
        midiaTipo = 'galeria_multi';
        midiaUrl = JSON.stringify(listaAnexosStaging);
        midiaNome = `${listaAnexosStaging.length} mídias anexadas`;
    }

    const novaMsg = {
        id: Date.now(),
        texto: htmlRico,
        midia_tipo: midiaTipo,
        midia_url: midiaUrl,
        midia_nome: midiaNome,
        cor_balao: corBalaoSelecionada,
        fixado: false,
        criado_em: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    listaChatPessoal.push(novaMsg);
    if (editor) {
        editor.innerHTML = '';
        rangeSelecaoSalva = null;
        historicoUndoRico = [''];
        indiceHistoricoUndo = 0;
    }
    cancelarAnexoChat();
    esconderBarraFlutuanteEDesmarcar(false);

    salvarChatLocal();
    renderizarMensagensChat(true);

    if (supabaseClient && SUPABASE_URL) {
        try {
            await supabaseClient.from('sc_chat_pessoal').upsert(serializarMsgParaSupabase(novaMsg));
        } catch (e) {}
    }
}

function filtrarChatPessoal(filtro, btnEl) {
    filtroChatAtual = filtro;
    document.querySelectorAll('.chat-filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderizarMensagensChat();
}

function extrairCorEData(msg) {
    let rawData = msg.criado_em || '';
    let cor = msg.cor_balao || 'roxo';
    if (rawData.includes('|cor:')) {
        const partes = rawData.split('|cor:');
        rawData = partes[0];
        cor = partes[1] || 'roxo';
    }
    return { dataLimpa: rawData, cor };
}

function obterListaMidiasDaMensagem(msg) {
    if (!msg.midia_url) return [];
    if (msg.midia_tipo === 'galeria_multi' || msg.midia_url.startsWith('[')) {
        try {
            return JSON.parse(msg.midia_url);
        } catch (e) { return []; }
    }
    return [{ tipo: msg.midia_tipo || 'imagem', url: msg.midia_url, nome: msg.midia_nome }];
}

function renderizarMensagensChat(rolarParaFim = false) {
    const stream = document.getElementById('chat-messages-stream');
    const pinnedBanner = document.getElementById('chat-pinned-banner');
    if (!stream) return;

    atualizarContadorChatSidebar();

    const fixadas = listaChatPessoal.filter(m => m.fixado);
    if (pinnedBanner) {
        if (fixadas.length > 0) {
            if (indiceFixadoBanner >= fixadas.length) indiceFixadoBanner = 0;
            const fixadaAtual = fixadas[indiceFixadoBanner];
            const textoLimpo = limparMarkdownParaBanner(fixadaAtual.texto) || fixadaAtual.midia_nome || 'Mídia fixada';

            pinnedBanner.style.display = 'flex';
            pinnedBanner.onclick = () => rolarParaMensagemChat(fixadaAtual.id);
            pinnedBanner.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; flex:1;">
                    <span class="material-icons-round" style="font-size:15px; color:var(--neon-yellow);">push_pin</span>
                    <strong style="color:white;">Fixado (${indiceFixadoBanner + 1}/${fixadas.length}):</strong>
                    <span style="overflow:hidden; text-overflow:ellipsis;">${textoLimpo}</span>
                </div>
                ${fixadas.length > 1 ? `
                    <button type="button" class="btn-reset-mini" style="padding:2px 7px; font-size:10px;" onclick="event.stopPropagation(); proximoFixadoBanner()">
                        Próximo ▶
                    </button>
                ` : '<span style="font-size:10px; opacity:0.75;">Clique para ir até a nota</span>'}
            `;
        } else {
            pinnedBanner.style.display = 'none';
        }
    }

    const busca = (document.getElementById('chat-input-busca')?.value || "").toLowerCase().trim();

    const visiveis = listaChatPessoal.filter(m => {
        if (filtroChatAtual === 'fixados' && !m.fixado) return false;
        if (filtroChatAtual === 'midia' && !m.midia_url) return false;
        if (!busca) return true;
        return (m.texto && m.texto.toLowerCase().includes(busca)) ||
               (m.midia_nome && m.midia_nome.toLowerCase().includes(busca)) ||
               (m.criado_em && m.criado_em.toLowerCase().includes(busca));
    });

    stream.innerHTML = '';

    if (visiveis.length === 0) {
        stream.innerHTML = `
            <div style="margin: auto; text-align: center; color: var(--text-muted); padding: 40px;">
                <span class="material-icons-round" style="font-size: 42px; opacity: 0.3; display: block; margin-bottom: 8px;">auto_stories</span>
                Nenhuma anotação encontrada neste filtro.
            </div>
        `;
        return;
    }

    const fragChat = document.createDocumentFragment();
    visiveis.forEach(msg => {
        const { dataLimpa, cor } = extrairCorEData(msg);
        const midias = obterListaMidiasDaMensagem(msg);

        const row = document.createElement('div');
        row.className = 'chat-bubble-row';
        row.id = `chat-msg-row-${msg.id}`;

        let galeriaHtml = '';
        if (midias.length > 0) {
            const singleClass = midias.length === 1 ? 'single-item' : '';
            const itensHtml = midias.map(m => {
                if (m.tipo === 'imagem') {
                    return `<div class="chat-media-item"><img src="${m.url}" alt="${m.nome || 'Print'}" loading="lazy" decoding="async" onclick="abrirLightboxChat('${m.url}')" data-tip="Clique para ampliar em tela cheia"></div>`;
                } else if (m.tipo === 'video') {
                    return `<div class="chat-media-item"><video src="${m.url}" controls preload="metadata"></video></div>`;
                } else {
                    return `<a class="chat-file-attachment" href="${m.url}" download="${m.nome || 'arquivo'}"><span class="material-icons-round">download</span> <span>${m.nome || 'Baixar Arquivo'}</span></a>`;
                }
            }).join('');
            galeriaHtml = `<div class="chat-media-gallery ${singleClass}">${itensHtml}</div>`;
        }

        row.innerHTML = `
            <div class="chat-bubble cor-${cor} ${msg.fixado ? 'pinned-msg' : ''}">
                <div class="chat-bubble-top">
                    <span class="chat-time-tag">
                        <span class="material-icons-round" style="font-size:12px; color:#f472b6;">schedule</span>
                        ${dataLimpa}
                    </span>
                    <div class="chat-bubble-actions">
                        <button class="icon-btn" onclick="copiarTextoMsgChat(${msg.id})" data-tip="Copiar texto limpo">
                            <span class="material-icons-round">content_copy</span>
                        </button>
                        <button class="icon-btn ${msg.fixado ? 'pin-active' : ''}" onclick="toggleFixarMsgChat(${msg.id})" data-tip="Fixar no topo">
                            <span class="material-icons-round">push_pin</span>
                        </button>
                        <button class="icon-btn" onclick="editarMsgChat(${msg.id})" data-tip="Editar anotação ou mídias">
                            <span class="material-icons-round">edit</span>
                        </button>
                        <button class="icon-btn" onclick="excluirMsgChat(${msg.id})" data-tip="Excluir">
                            <span class="material-icons-round">delete</span>
                        </button>
                    </div>
                </div>
                ${galeriaHtml}
                ${msg.texto ? `<div class="chat-text-content" style="white-space: normal;">${formatarConteudoBalaoChat(msg.texto, msg.id)}</div>` : ''}
            </div>
        `;
        fragChat.appendChild(row);
    });
    stream.appendChild(fragChat);

    if (rolarParaFim) {
        stream.scrollTop = stream.scrollHeight;
    }
}

function proximoFixadoBanner() {
    indiceFixadoBanner++;
    renderizarMensagensChat(false);
}

function rolarParaMensagemChat(id) {
    const el = document.getElementById(`chat-msg-row-${id}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const bubble = el.querySelector('.chat-bubble');
        if (bubble) {
            bubble.style.outline = '2px solid var(--neon-yellow)';
            setTimeout(() => bubble.style.outline = 'none', 1200);
        }
    }
}

function abrirLightboxChat(url) {
    const box = document.getElementById('chat-lightbox');
    const img = document.getElementById('chat-lightbox-img');
    if (box && img) {
        img.src = url;
        box.style.display = 'flex';
    }
}

function copiarTextoMsgChat(id) {
    const item = listaChatPessoal.find(m => m.id === id);
    if (!item) return;
    const temp = document.createElement('div');
    temp.innerHTML = item.texto || '';
    navigator.clipboard.writeText(temp.innerText || '');
    mostrarToast("✓ Anotação copiada!");
}

async function toggleFixarMsgChat(id) {
    const item = listaChatPessoal.find(m => m.id === id);
    if (!item) return;
    item.fixado = !item.fixado;
    salvarChatLocal();
    renderizarMensagensChat();
    if (supabaseClient && SUPABASE_URL) {
        supabaseClient.from('sc_chat_pessoal').upsert(serializarMsgParaSupabase(item)).then(() => {});
    }
}

function editarMsgChat(id) {
    const item = listaChatPessoal.find(m => m.id === id);
    if (!item) return;
    const editor = obterEditorRico();
    if (!editor) return;

    editor.innerHTML = item.texto || '';
    registrarEstadoUndo(true);
    listaAnexosStaging = obterListaMidiasDaMensagem(item);
    renderizarCarrosselStaging();

    const { cor } = extrairCorEData(item);
    const btnCor = document.querySelector(`.b-color-dot[data-cor="${cor}"]`);
    selecionarCorBalao(cor, btnCor);

    excluirMsgChat(id, false);
    editor.focus();
}

async function excluirMsgChat(id, avisar = true) {
    listaChatPessoal = listaChatPessoal.filter(m => m.id !== id);
    salvarChatLocal();
    renderizarMensagensChat();
    if (supabaseClient && SUPABASE_URL) {
        supabaseClient.from('sc_chat_pessoal').delete().eq('id', id).then(() => {});
    }
    if (avisar) mostrarToast("Anotação removida.");
}

// 9. INICIALIZAÇÃO: CTRL+Z TOTAL, AUTO-NUMERAÇÃO SELECIONÁVEL 1. 2. 3. E COLAGEM COM NEGRITO
window.addEventListener('DOMContentLoaded', () => {
    restaurarFundoSalvoChat();
    renderizarPaginaIcones();
    renderizarMensagensChat(true);
    setTimeout(() => sincronizarChatComSupabase(false), 600);

    const editor = obterEditorRico();
    if (editor) {
        registrarEstadoUndo(true);

        // Registra no histórico de Ctrl+Z cada palavra/frase digitada
        let timerTypingUndo = null;
        editor.addEventListener('input', () => {
            if (aplicandoUndoRedo) return;
            clearTimeout(timerTypingUndo);
            timerTypingUndo = setTimeout(() => registrarEstadoUndo(), 180);
        });

        editor.addEventListener('keyup', salvarSelecaoEditorRico);

        editor.addEventListener('mouseup', (e) => {
            const sel = window.getSelection();
            if (e.ctrlKey && sel && sel.rangeCount > 0 && !sel.isCollapsed && editor.contains(sel.anchorNode)) {
                registrarEstadoUndo();
                const range = sel.getRangeAt(0);
                const spanMulti = document.createElement('span');
                spanMulti.className = 'multi-sel-chunk';
                try {
                    spanMulti.appendChild(range.extractContents());
                    range.insertNode(spanMulti);
                    sel.removeAllRanges();
                    document.getElementById('rich-floating-toolbar').style.display = 'flex';
                    mostrarToast("✨ Frase adicionada à seleção múltipla! Escolha a cor ou negrito.");
                    return;
                } catch (err) {}
            } else if (!e.ctrlKey && (!sel || sel.isCollapsed)) {
                limparMarcacoesMultiSelecao();
            }
            salvarSelecaoEditorRico();
        });

        editor.addEventListener('keydown', (e) => {
            // 1. INTERCEPTA CTRL+Z (UNDO) E CTRL+Y (REDO) PARA DESFAZER QUALQUER AÇÃO!
            if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                acionarUndoRico();
                return;
            }
            if ((e.ctrlKey && e.key.toLowerCase() === 'y') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')) {
                e.preventDefault();
                acionarRedoRico();
                return;
            }

            // Atalhos rápidos Ctrl+B / Ctrl+I / Ctrl+U
            if (e.ctrlKey && ['b', 'i', 'u'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                const mapCmd = { b: 'bold', i: 'italic', u: 'underline' };
                executarComandoRico(mapCmd[e.key.toLowerCase()]);
                return;
            }

            if (e.key !== 'Enter') return;

            // 2. AUTO-NUMERAÇÃO 1. -> 2. -> 3. (COMO TEXTO SELECIONÁVEL E COLORÍVEL!)
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return;

            const range = sel.getRangeAt(0);
            const rangeAteInicio = range.cloneRange();
            rangeAteInicio.selectNodeContents(editor);
            rangeAteInicio.setEnd(range.startContainer, range.startOffset);

            const textoAteCursor = rangeAteInicio.toString();
            const ultimaLinha = textoAteCursor.split('\n').pop() || "";

            const matchNum = ultimaLinha.match(/^(\s*)(\d+)\.\s+(.*)$/);
            const matchTopico = ultimaLinha.match(/^(\s*)•\s+(.*)$/);
            const matchCheck = ultimaLinha.match(/^(\s*)[[ xX]]\s+(.*)$/);

            if (matchNum) {
                e.preventDefault();
                registrarEstadoUndo();
                // Se a linha atual só tem o número vazio (ex: "2. ") e você apertou Enter, encerra a lista numerada!
                if (matchNum[3].trim() === "") {
                    document.execCommand('insertHTML', false, `<br>`);
                } else {
                    const proxNum = parseInt(matchNum[2], 10) + 1;
                    document.execCommand('insertHTML', false, `<br>${matchNum[1]}${proxNum}.&nbsp;`);
                }
                salvarSelecaoEditorRico();
                registrarEstadoUndo();
                return;
            } else if (matchTopico && (e.shiftKey || matchTopico[2].trim() !== "")) {
                e.preventDefault();
                registrarEstadoUndo();
                document.execCommand('insertHTML', false, `<br>${matchTopico[1]}•&nbsp;`);
                salvarSelecaoEditorRico();
                registrarEstadoUndo();
                return;
            } else if (matchCheck && (e.shiftKey || matchCheck[2].trim() !== "")) {
                e.preventDefault();
                registrarEstadoUndo();
                document.execCommand('insertHTML', false, `<br>${matchCheck[1]}[ ]&nbsp;`);
                salvarSelecaoEditorRico();
                registrarEstadoUndo();
                return;
            }

            // Se apertou Enter sem Shift fora de lista, envia a anotação!
            if (!e.shiftKey || e.ctrlKey) {
                e.preventDefault();
                enviarMensagemChatPessoal();
            }
        });
    }

   // COLAGEM INTELIGENTE E INTERCEPTAÇÃO DE IMAGENS (CTRL+V)
    document.addEventListener('paste', (e) => {
        const modChat = document.getElementById('modulo-chat');
        if (!modChat || modChat.style.display === 'none') return;

        const items = e.clipboardData?.items;
        if (!items) return;

        const arquivosColados = [];
        let colouImagemDireta = false;

        // 1. Verifica arquivos de imagem/vídeo no clipboard (Print Screen ou Copiar imagem)
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('video') !== -1) {
                const f = items[i].getAsFile();
                if (f) {
                    arquivosColados.push(f);
                    colouImagemDireta = true;
                }
            }
        }

        // Se capturou imagens diretas, processa e impede a colagem padrão (Permite até 10 na fila)
        if (colouImagemDireta) {
            e.preventDefault();
            adicionarArquivosNaFilaStaging(arquivosColados);
            mostrarToast(`🖼️ +${arquivosColados.length} imagem(ns) na fila (${Math.min(listaAnexosStaging.length + arquivosColados.length, 10)}/10)!`);
            return;
        }

        // 2. Se for texto puro ou html rico (Cópia em massa do WhatsApp ou textos normais)
        const editorAtivo = obterEditorRico();
        if (editorAtivo && (document.activeElement === editorAtivo || editorAtivo.contains(document.activeElement))) {
            const htmlColado = e.clipboardData.getData('text/html');
            const textoPuro = e.clipboardData.getData('text/plain');

            e.preventDefault();
            registrarEstadoUndo();

            // Interceptador da string isolada "imagem" (Anomalia do WhatsApp Web)
            if (textoPuro && /\bimagem\b/i.test(textoPuro)) {
                let textoProcessado = textoPuro.replace(/\bimagem\b/gi, '\n[IMAGEM_ANEXADA_ABAIXO]\n');
                document.execCommand('insertText', false, textoProcessado);
                mostrarToast('Anomalia de texto "imagem" tratada!');
                salvarSelecaoEditorRico();
                registrarEstadoUndo();
                return;
            }

            // Fallback para colagem rica normal mantendo negrito e cores
            if (htmlColado) {
                const parser = new DOMParser();
                const docTemp = parser.parseFromString(htmlColado, 'text/html');

                docTemp.body.querySelectorAll('ol, ul').forEach(lista => {
                    const frag = docTemp.createDocumentFragment();
                    lista.querySelectorAll('li').forEach((li, idx) => {
                        const divLinha = docTemp.createElement('div');
                        divLinha.innerHTML = li.innerHTML;
                        frag.appendChild(divLinha);
                    });
                    lista.replaceWith(frag);
                });

                docTemp.body.querySelectorAll('*').forEach(el => {
                    el.removeAttribute('style');
                    el.removeAttribute('class');
                    el.removeAttribute('color');
                    el.removeAttribute('bgcolor');
                });

                let htmlLimpo = docTemp.body.innerHTML.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                document.execCommand('insertHTML', false, `<span style="color:#ffffff;">${htmlLimpo}</span><div><br></div>`);
            } else if (textoPuro) {
                 document.execCommand('insertText', false, textoPuro);
            }

            salvarSelecaoEditorRico();
            registrarEstadoUndo();
        }
    });
});
	

// ==============================================================
// 10. BLINDAGEM NÍVEL MÁXIMO: LOGIN SUPABASE AUTH + AUTO-SYNC
// ==============================================================
(function iniciarBlindagemSupabaseAuth() {
    // 1. Injeta a Tela de Login Cósmica e o Botão de Trancar Cofre
    const authOverlay = document.createElement('div');
    authOverlay.id = 'cosmic-auth-gate';
    authOverlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999999;
        background: radial-gradient(circle at 50% 20%, rgba(126, 34, 206, 0.35), #020308 75%);
        backdrop-filter: blur(18px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
    `;

    authOverlay.innerHTML = `
        <div class="glass-card" style="width: 100%; max-width: 390px; padding: 28px 24px; border: 1px solid rgba(192, 132, 252, 0.5); box-shadow: 0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(192, 132, 252, 0.2); text-align: center; display: flex; flex-direction: column; gap: 14px;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: radial-gradient(circle, #38bdf8, #7e22ce); display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 0 20px rgba(56, 189, 248, 0.5);">
                <span class="material-icons-round" style="font-size: 26px; color: white;">lock</span>
            </div>
            <div>
                <h2 style="font-size: 17px; font-weight: 800; color: white; letter-spacing: 0.5px;">Cofre SC Smart Cockpit</h2>
                <p style="font-size: 11.5px; color: #94a3b8; margin-top: 4px;">Acesso blindado por RLS • Autenticação Obrigatória</p>
            </div>

            <form id="form-login-supabase" style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <div class="input-box">
                    <label>SEU E-MAIL</label>
                    <input type="email" id="auth-email" required placeholder="seu-email@exemplo.com" autocomplete="username" style="padding: 10px 12px; font-size: 13px;">
                </div>
                <div class="input-box">
                    <label>SENHA DO COFRE</label>
                    <input type="password" id="auth-password" required placeholder="••••••••••••" autocomplete="current-password" style="padding: 10px 12px; font-size: 13px;">
                </div>
                <div id="auth-error-msg" style="display: none; color: #fca5a5; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); padding: 8px 10px; border-radius: 8px; font-size: 11.5px; font-weight: 600; text-align: center;"></div>
                <button type="submit" id="btn-submit-auth" class="btn-pip" style="margin-top: 6px; padding: 12px; font-size: 12px;">
                    <span class="material-icons-round" style="font-size: 16px;">key</span> DESTRANCAR COFRE & SINCRONIZAR
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(authOverlay);

    // 2. Adiciona botões de Sincronizar e Sair (Logout) na Sidebar esquerda
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (sidebarFooter) {
        const authControls = document.createElement('div');
        authControls.style.cssText = 'display: flex; gap: 6px; width: 100%;';
        authControls.innerHTML = `
            <button type="button" class="btn-mini-tool" style="flex: 1; justify-content: center; border-color: rgba(16, 185, 129, 0.4); color: #6ee7b7;" onclick="baixarTudoDoSupabase()" data-tip="Buscar todos os cards salvos no Supabase">
                <span class="material-icons-round" style="font-size: 14px;">cloud_download</span> Sync Nuvem
            </button>
            <button type="button" class="btn-mini-tool" style="flex: 1; justify-content: center; border-color: rgba(248, 113, 113, 0.4); color: #fca5a5;" onclick="trancarCofreLogout()" data-tip="Deslogar e limpar cache deste navegador">
                <span class="material-icons-round" style="font-size: 14px;">lock</span> Trancar
            </button>
        `;
        sidebarFooter.insertBefore(authControls, sidebarFooter.firstChild);
    }

    // 3. Função que puxa automaticamente os Cards e o Chat do Supabase ao logar!
    window.baixarTudoDoSupabase = async function() {
        if (!supabaseClient) return;
        try {
            const { data: cardsNuvem, error: errCards } = await supabaseClient
                .from('sc_respostas_rapidas')
                .select('*')
                .order('id', { ascending: true });

            if (errCards) throw errCards;

           if (Array.isArray(cardsNuvem) && cardsNuvem.length > 0) {
                listaScripts = cardsNuvem;
                ['sc_cockpit_scripts_v3', 'sc_cockpit_scripts_v4', 'sc_cockpit_scripts_v5'].forEach(k => {
                    localStorage.setItem(k, JSON.stringify(listaScripts));
                });
                renderizarPillsCategorias();
                renderizarCards();
                inicializarBarraCopilotHUD();

                const qtdCardsAtendimento = listaScripts.filter(s => s.categoria !== 'Prompts IA').length;
                mostrarToast(`☁️ ${qtdCardsAtendimento} cards carregados do seu Cofre Supabase!`);
            } else if (listaScripts.length > 0) {
                // Se o Supabase estiver vazio mas você tiver cards locais, sobe eles para a nuvem
                await sincronizarComNuvem();
            }

            // Sincroniza também o Diário / Chat Pessoal
            await sincronizarChatComSupabase(false);
        } catch (err) {
            console.error("Erro ao sincronizar com Supabase:", err);
            mostrarToast("⚠️ Erro de permissão RLS ou conexão: " + (err.message || ""));
        }
    };

    // 4. Função de Logout (Trancar Cofre e limpar dados sensíveis da máquina local)
    window.trancarCofreLogout = async function() {
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        // Limpa os dados locais para não deixar CPF/notas no PC caso você saia
        ['sc_cockpit_scripts_v3', 'sc_cockpit_scripts_v4', 'sc_cockpit_scripts_v5', 'sc_chat_pessoal_v1'].forEach(k => {
            localStorage.removeItem(k);
        });
        listaScripts = [];
        listaChatPessoal = [];
        renderizarPillsCategorias();
        renderizarCards();
        renderizarMensagensChat();
        authOverlay.style.display = 'flex';
        mostrarToast("🔒 Cofre trancado com segurança!");
    };

    // 5. Lógica do Formulário de Login
    const formLogin = document.getElementById('form-login-supabase');
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const errBox = document.getElementById('auth-error-msg');
        const btn = document.getElementById('btn-submit-auth');

        errBox.style.display = 'none';
        btn.disabled = true;
        btn.innerText = 'Verificando credenciais...';

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.session) {
                authOverlay.style.display = 'none';
                mostrarToast("🔓 Bem-vindo, Ricardo! Sincronizando cofre...");
                await baixarTudoDoSupabase();
            }
        } catch (err) {
            errBox.style.display = 'block';
            errBox.innerText = 'Acesso negado: E-mail ou senha incorretos.';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<span class="material-icons-round" style="font-size: 16px;">key</span> DESTRANCAR COFRE & SINCRONIZAR';
        }
    });

    // 6. Verifica ao abrir a página se você já está logado
    async function checarSessaoInicial() {
        if (!supabaseClient) return;
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            authOverlay.style.display = 'none';
            await baixarTudoDoSupabase();
        } else {
            authOverlay.style.display = 'flex';
        }
    }

    window.addEventListener('DOMContentLoaded', checarSessaoInicial);
})();


// ==============================================================
// 11. MOTOR GEMINI ULTRA-RÁPIDO (STREAMING + ZERO-THINKING + HISTÓRICO 5 + CONTINUIDADE)
// ==============================================================

// Relógio instantâneo do Portal
function iniciarRelogioPlanetario() {
    const atualizarRelogioEstelar = () => {
        const el = document.getElementById('obs-live-clock');
        if (el) {
            el.innerText = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
    };
    atualizarRelogioEstelar();
    setInterval(atualizarRelogioEstelar, 15000);
}
iniciarRelogioPlanetario();

// Garante que o botão Limpar (lixeira) limpe tanto o texto quanto as mídias da tela
const _oldLimparCaixaGem = limparCaixaGemHUD;
limparCaixaGemHUD = function() {
    window.filaMidiasGemHUD = [];
    renderizarGaleriaGemNativa();
    _oldLimparCaixaGem();
};

// Estado de velocidade, histórico das últimas 5 respostas e conversa ativa
window.modoVelocidadeGem = localStorage.getItem('sc_gem_speed_mode') || 'veloz';
window.historicoRespostasGem = (() => {
    try { return JSON.parse(sessionStorage.getItem('sc_gem_hist_5') || '[]'); } catch (e) { return []; }
})();
window.idHistoricoGemAtivo = null;
window.ultimoModeloUsadoGem = '';

function salvarHistoricoGemSessao() {
    try {
        sessionStorage.setItem('sc_gem_hist_5', JSON.stringify(window.historicoRespostasGem.slice(0, 5)));
    } catch (e) {}
}

window.alternarModoVelocidadeGem = function() {
    window.modoVelocidadeGem = (window.modoVelocidadeGem === 'veloz') ? 'analitico' : 'veloz';
    localStorage.setItem('sc_gem_speed_mode', window.modoVelocidadeGem);
    listaModelosReaisCache = null; // Recalcula ordem de modelos
    const doc = obterDocAtivo();
    const btn = doc.getElementById('btn-gem-speed-mode');
    if (btn) {
        btn.innerText = window.modoVelocidadeGem === 'veloz' ? '⚡ Modo Ultra-Rápido' : '🧠 Modo Analítico';
    }
    mostrarToast(window.modoVelocidadeGem === 'veloz'
        ? '⚡ Modo Ultra-Rápido ativado (resposta instantânea via streaming)!'
        : '🧠 Modo Analítico ativado (raciocínio mais profundo)!');
};

// 1. CÉREBRO COMPACTO E PRECISO: Top 8 cards mais certeiros + Anotações Fixadas (muito mais rápido!)
compilarCerebroCompletoCockpit = function(textoPergunta = "") {
    const cardsAtendimento = listaScripts.filter(s => s.categoria !== 'Prompts IA');
    const palavrasChave = textoPergunta
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .split(/\W+/)
        .filter(p => p.length > 2 && !['para', 'como', 'que', 'uma', 'com', 'por', 'nao', 'esta', 'cliente', 'visitante', 'ola', 'bom', 'boa', 'dia', 'tarde', 'noite'].includes(p));

    const cardsPontuados = cardsAtendimento.map(card => {
        const conteudoCard = `${card.categoria} ${card.titulo} ${card.atalho || ''} ${card.texto}`
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let pontos = card.favorito ? 2 : 0;
        for (let i = 0; i < palavrasChave.length; i++) {
            if (conteudoCard.includes(palavrasChave[i])) pontos += 6;
        }
        return { card, pontos };
    });

    cardsPontuados.sort((a, b) => b.pontos - a.pontos);

    // Top 8 cards mais relevantes: mantém precisão cirúrgica e corta pela metade o tempo de resposta!
    const limiteCards = window.modoVelocidadeGem === 'veloz' ? 8 : 14;
    const selecionados = cardsPontuados.slice(0, limiteCards).map((item, idx) => {
        const s = item.card;
        return `${idx + 1}. [${s.categoria} | ${s.titulo}]: ${processarTexto(s.texto, false)}`;
    }).join('\n\n');

    let notasFixadasDiario = "";
    if (typeof listaChatPessoal !== 'undefined' && Array.isArray(listaChatPessoal)) {
        const fixadas = listaChatPessoal.filter(m => m.fixado && m.texto).slice(0, 6);
        if (fixadas.length > 0) {
            notasFixadasDiario = `\n\n=== ANOTAÇÕES FIXADAS ===\n` +
                fixadas.map(f => {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = f.texto;
                    return `• ${(tmp.innerText || tmp.textContent || '').trim()}`;
                }).join('\n');
        }
    }

    return `\n\n=== PROCEDIMENTOS OFICIAIS DO SUPORTE (USE ESTES CAMINHOS QUANDO APLICÁVEL) ===\n${selecionados}${notasFixadasDiario}`;
};

// 2. DESCOBERTA INTELIGENTE DE MODELOS (PRIORIZA OS MAIS RÁPIDOS NO MODO VELOZ)
let listaModelosReaisCache = null;

async function obterModelosReaisDaChave(apiKey) {
    if (listaModelosReaisCache && listaModelosReaisCache.length > 0) {
        return listaModelosReaisCache;
    }
    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
        const data = await resp.json();
        if (data && Array.isArray(data.models)) {
            const disponiveis = data.models
                .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
                .map(m => m.name.replace('models/', ''))
                .filter(nome => nome.includes('gemini') && !nome.includes('2.0') && !nome.includes('1.5') && !nome.includes('vision') && !nome.includes('tts') && !nome.includes('image') && !nome.includes('embedding'));

            const veloz = window.modoVelocidadeGem === 'veloz';
            disponiveis.sort((a, b) => {
                const peso = (n) => {
                    if (veloz) {
                        if (n.includes('3.5-flash-lite')) return 1;
                        if (n.includes('3.6-flash')) return 2;
                        if (n.includes('3.8-flash')) return 3;
                        if (n.includes('flash-lite')) return 4;
                        if (n.includes('2.5-flash') && !n.includes('pro')) return 5;
                        if (n.includes('flash')) return 6;
                        return 9;
                    } else {
                        if (n.includes('3.8-flash')) return 1;
                        if (n.includes('3.6-flash')) return 2;
                        if (n.includes('2.5-flash') && !n.includes('lite')) return 3;
                        if (n.includes('flash') && !n.includes('lite')) return 4;
                        if (n.includes('flash-lite')) return 5;
                        return 9;
                    }
                };
                return peso(a) - peso(b);
            });

            if (disponiveis.length > 0) {
                const extras = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'].filter(m => !disponiveis.includes(m));
                listaModelosReaisCache = [...disponiveis.slice(0, 5), ...extras].slice(0, 6);
                return listaModelosReaisCache;
            }
        }
    } catch (e) {}
    return ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];
}

// 3. MOTOR DE STREAMING SSE + ZERO-THINKING BUDGET (RESPOSTA COMEÇA EM ~0.8s!)
chamarMotorGeminiAPI = async function(promptUsuario, usarContextoScripts = true, opcoes = {}) {
    if (!configGeminiGem.apiKey) {
        toggleGavetaHUD('hud-gemini-drawer');
        const doc = obterDocAtivo();
        const box = doc.getElementById('box-config-apikey-hud');
        if (box) box.style.display = 'flex';
        throw new Error("Configure sua Chave de API do Gemini primeiro!");
    }

    const { onChunk = null, historicoContents = null } = opcoes;
    const doc = obterDocAtivo();
    const nomeCliente = doc.getElementById('var-nome')?.value.trim() || '';
    const nomeCond = doc.getElementById('var-condominio')?.value.trim() || '';
    const saudacao = obterSaudacaoHorario();

    const cerebroOtimizado = usarContextoScripts ? compilarCerebroCompletoCockpit(promptUsuario) : "";
    const contextoVariaveis = `\n\n=== DADOS DO ATENDIMENTO ATUAL ===\nSaudação do horário: "${saudacao}" | Nome do Cliente: "${nomeCliente || 'Não informado'}" | Condomínio: "${nomeCond || 'Não informado'}"`;

    let contentsPayload;
    if (Array.isArray(historicoContents) && historicoContents.length > 0) {
        contentsPayload = historicoContents;
    } else {
        const userParts = [];
        let textosDeArquivos = "";

        for (const item of window.filaMidiasGemHUD) {
            if (item.tipoCurto === 'texto' && item.textoExtraido) {
                textosDeArquivos += `\n\n--- ARQUIVO (${item.nome}) ---\n${item.textoExtraido}`;
            } else if (item.base64Data) {
                userParts.push({
                    inlineData: {
                        mimeType: item.mimeType || 'image/jpeg',
                        data: item.base64Data
                    }
                });
            }
        }
        userParts.push({ text: promptUsuario + textosDeArquivos });
        contentsPayload = [{ role: "user", parts: userParts }];
    }

    const modelosParaTentar = await obterModelosReaisDaChave(configGeminiGem.apiKey);
    let ultimoErro = null;
    const isVeloz = window.modoVelocidadeGem === 'veloz';

    const montarPayload = (incluirThinkingConfig) => {
        const genCfg = {
            temperature: 0.25,
            maxOutputTokens: isVeloz ? 1100 : 1800
        };
        // Desativa tokens de pensamento oculto no modo veloz (principal causa de demora nos Gemini 2.5/3.x!)
        if (incluirThinkingConfig && isVeloz) {
            genCfg.thinkingConfig = { thinkingBudget: 0 };
        }
        return {
            systemInstruction: {
                parts: [{ text: INSTRUCAO_PROFISSIONAL_RICARDO + "\n" + (configGeminiGem.instrucaoGem || "") + contextoVariaveis + cerebroOtimizado }]
            },
            contents: contentsPayload,
            generationConfig: genCfg
        };
    };

    for (const mod of modelosParaTentar) {
        for (const tentarSemThinking of [false, true]) {
            if (tentarSemThinking && !isVeloz) break;

            const controller = new AbortController();
            const timerTimeout = setTimeout(() => controller.abort(), 45000);

            try {
                const usarStream = typeof onChunk === 'function';
                const endpoint = usarStream ? 'streamGenerateContent?alt=sse&' : 'generateContent?';
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:${endpoint}key=${encodeURIComponent(configGeminiGem.apiKey)}`;

                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(montarPayload(!tentarSemThinking)),
                    signal: controller.signal
                });

                clearTimeout(timerTimeout);

                if (!resp.ok) {
                    const errData = await resp.json().catch(() => ({}));
                    const errMsg = errData.error?.message || `HTTP ${resp.status}`;
                    // Se o modelo não aceita thinkingConfig, tenta imediatamente sem ele!
                    if (!tentarSemThinking && /thinking/i.test(errMsg)) {
                        continue;
                    }
                    ultimoErro = errMsg;
                    break;
                }

                window.ultimoModeloUsadoGem = mod;

                if (usarStream && resp.body) {
                    const reader = resp.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let buffer = '';
                    let textoAcumulado = '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        buffer += decoder.decode(value, { stream: true });
                        const linhas = buffer.split('\n');
                        buffer = linhas.pop() || '';

                        for (const linha of linhas) {
                            const l = linha.trim();
                            if (!l.startsWith('data:')) continue;
                            const jsonStr = l.slice(5).trim();
                            if (!jsonStr || jsonStr === '[DONE]') continue;
                            try {
                                const chunk = JSON.parse(jsonStr);
                                const parts = chunk.candidates?.[0]?.content?.parts || [];
                                for (const p of parts) {
                                    if (!p.thought && p.text) {
                                        textoAcumulado += p.text;
                                        onChunk(textoAcumulado);
                                    }
                                }
                            } catch (e) {}
                        }
                    }
                    if (textoAcumulado.trim()) {
                        return textoAcumulado.trim();
                    }
                } else {
                    const data = await resp.json();
                    const textoGerado = data.candidates?.[0]?.content?.parts
                        ?.filter(p => !p.thought)
                        ?.map(p => p.text || '')
                        .join('')?.trim();
                    if (textoGerado) return textoGerado;
                }
            } catch (err) {
                clearTimeout(timerTimeout);
                ultimoErro = err.name === 'AbortError' ? "Tempo limite esgotado." : err.message;
                break;
            }
        }
    }

    throw new Error(`Falha na API: ${ultimoErro}`);
};

function formatarHtmlRespostaGem(textoBruto) {
    return (textoBruto || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function renderizarHistoricoGemHUD() {
    const doc = obterDocAtivo();
    const bar = doc.getElementById('gem-hud-history-bar');
    if (!bar) return;

    if (!window.historicoRespostasGem || window.historicoRespostasGem.length === 0) {
        bar.style.display = 'none';
        bar.innerHTML = '';
        return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = `<span style="font-size:8.5px; font-weight:900; color:#7dd3fc; margin-right:2px;">🕘 ÚLTIMAS ${window.historicoRespostasGem.length}:</span>`;

    window.historicoRespostasGem.forEach((item, idx) => {
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = `gem-history-chip ${item.id === window.idHistoricoGemAtivo ? 'active' : ''}`;
        btn.setAttribute('data-tip', `${item.hora} • ${item.titulo} (Clique para reabrir e continuar assunto)`);
        btn.innerText = `#${idx + 1} ${item.titulo}`;
        btn.onclick = () => selecionarHistoricoGem(item.id);
        bar.appendChild(btn);
    });
}

function renderizarResultadoCompletoGem(itemHist) {
    const doc = obterDocAtivo();
    const outBox = doc.getElementById('gemini-hud-resultado');
    if (!outBox || !itemHist) return;

    ultimaRespostaGeradaGem = itemHist.resposta;
    window.idHistoricoGemAtivo = itemHist.id;
    const htmlVisual = formatarHtmlRespostaGem(itemHist.resposta);
    const qtdTurnos = Math.max(1, Math.floor((itemHist.conversa?.length || 2) / 2));

    outBox.style.display = 'flex';
    outBox.innerHTML = `
        <div class="gem-ans-header">
            <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
                <strong style="color:var(--neon-green); font-size:10px;">⚡ PRONTO EM ${itemHist.segundos}s (COPIADO!)</strong>
                <span class="gem-model-badge">${itemHist.modelo || 'gemini'}</span>
                ${qtdTurnos > 1 ? `<span class="gem-model-badge" style="color:#f5d0fe; border-color:rgba(192,132,252,0.45);">💬 ${qtdTurnos} turnos</span>` : ''}
            </div>
            <button type="button" class="btn-gem-copy-big" onclick="copiarTextoUniversal(ultimaRespostaGeradaGem); mostrarToast('✓ Copiado pro Ctrl+V!')">
                <span class="material-icons-round" style="font-size:14px;">content_copy</span>
                COPIAR RESPOSTA
            </button>
        </div>
        <div class="gem-ans-body" id="gem-stream-body">${htmlVisual}</div>
        <div class="gem-refine-bar">
            <span style="font-size:9px; font-weight:800; color:var(--text-muted);">REFINAR:</span>
            <button type="button" class="gem-refine-chip" onclick="refinarRespostaGem('encurtar')">✂️ Encurtar</button>
            <button type="button" class="gem-refine-chip" onclick="refinarRespostaGem('firme')">🛡️ Mais Firme</button>
            <button type="button" class="gem-refine-chip" onclick="refinarRespostaGem('passos')">🔢 Em Passos</button>
            <button type="button" class="gem-refine-chip" onclick="refinarRespostaGem('amigavel')">😊 Mais Leve</button>
        </div>
        <div class="gem-followup-row">
            <input type="text" id="gem-followup-input" placeholder="💬 Continuar este assunto (ex: diga que o boleto vence amanhã, peça o print...)" onkeydown="if(event.key==='Enter'){event.preventDefault(); continuarAssuntoGem();}">
            <button type="button" class="btn-hud-action btn-hud-ai-gem" style="padding:6px 10px;" onclick="continuarAssuntoGem()">
                <span class="material-icons-round" style="font-size:13px;">send</span> Continuar
            </button>
        </div>
    `;
    renderizarHistoricoGemHUD();
}

window.selecionarHistoricoGem = function(id) {
    const item = window.historicoRespostasGem.find(h => h.id === id);
    if (!item) return;
    renderizarResultadoCompletoGem(item);
    copiarTextoUniversal(item.resposta).catch(() => {});
    mostrarToast(`🕘 Histórico #${window.historicoRespostasGem.indexOf(item) + 1} reaberto e copiado!`);
};

// 4. EXECUÇÃO ULTRA-RÁPIDA COM STREAMING AO VIVO + REGISTRO DAS ÚLTIMAS 5
executarGemNoHUD = async function(modo) {
    const doc = obterDocAtivo();
    const input = doc.getElementById('gemini-hud-input');
    const outBox = doc.getElementById('gemini-hud-resultado');
    let texto = input?.value.trim() || "";

    if (!texto && window.filaMidiasGemHUD.length === 0) {
        return mostrarToast("Cole a conversa, print ou digite sua mensagem primeiro!");
    }

    if (!texto && window.filaMidiasGemHUD.length > 0) {
        texto = "Analise atentamente a(s) imagem(ns)/documento(s) anexado(s) e dê a resposta pronta para o cliente.";
    }

    // Reação do Anjo Holográfico!
    if (modo === 'desabafo' || tomAtivoGem === 'firme') {
        reagirAnjo('calm', 6000);
    } else {
        reagirAnjo('thinking', 0);
    }

    const inicioMs = performance.now();
    outBox.style.display = 'block';
    outBox.innerHTML = `
        <div class="gem-ans-header">
            <strong style="color:#7dd3fc; font-size:10px;" id="gem-stream-status">⚡ Gerando resposta ao vivo...</strong>
        </div>
        <div class="gem-ans-body" id="gem-stream-body"><em>Conectando ao motor...</em></div>
    `;

    const instrucoesTom = {
        curto: "TOM CURTO E DIRETO: Vá direto ao ponto em 1 a 3 frases curtas. Sem introduções.",
        padrao: "TOM PADRÃO PROFISSIONAL: Equilibrado, claro, objetivo e prestativo.",
        firme: "TOM CLIENTE DIFÍCIL (FIRME E SÊNIOR): Postura firme, segura, técnica e definitiva. Zero submissão, zero desculpas.",
        amigavel: "TOM AMIGÁVEL E HUMANO: Cordial, leve, prestativo e acolhedor, com foco na solução rápida.",
        passos: "TOM PASSO A PASSO: Estruture a orientação em passos numerados curtos (1., 2., 3.)."
    };

    const regrasInviolaveisSaida = `
REGRAS DE OURO:
- Escreva em 1ª pessoa como o próprio atendente falando diretamente com o cliente.
- PROIBIDO dizer "Sou o assistente", "Aqui é o Ricardo" ou fazer autoapresentação.
- Ignore linhas de sistema do log copiado e foque 100% na dúvida real do cliente e nos anexos.
- Entregue APENAS o texto final pronto para dar Ctrl+V, sem aspas em volta e sem asteriscos (**).`;

    try {
        const diretrizTom = instrucoesTom[tomAtivoGem] || instrucoesTom.padrao;
        let comando = "";
        let precisaDosCards = true;

        if (modo === 'raiox') {
            comando = `Analise a(s) imagem(ns)/documento(s) anexado(s) junto com o histórico: "${texto}".
Entregue em 2 blocos separados por "---":
🔍 DIAGNÓSTICO DO PRINT/ARQUIVO: O que aparece na imagem e a causa técnica.
💬 RESPOSTA PRONTA PARA O CLIENTE: Mensagem direta em 1ª pessoa (${diretrizTom}, sem se apresentar e sem asteriscos **).`;
        } else if (modo === 'desabafo') {
            comando = `Contexto/desabafo sobre o caso:\n"${texto}"\n\nTransforme em uma resposta CURTA, DIRETA, FIRME E PROFISSIONAL (1 a 3 frases) em 1ª pessoa para o cliente, sem pedir desculpas.${regrasInviolaveisSaida}`;
        } else if (modo === 'lapidar') {
            comando = `Rascunho para lapidar:\n"${texto}"\n\nReescreva em 1ª pessoa com postura de Especialista Sênior (${diretrizTom}), clara e direta.${regrasInviolaveisSaida}`;
        } else if (modo === 'triagem') {
            precisaDosCards = false;
            comando = `Histórico do cliente:\n"${texto}"\n\nEscreva APENAS 1 frase curta e direta em 1ª pessoa pedindo somente o dado que falta para investigar (condomínio, unidade, e-mail ou print).${regrasInviolaveisSaida}`;
        } else {
            comando = `Mensagem do cliente:\n"${texto}"\n\n${window.filaMidiasGemHUD.length > 0 ? `Há ${window.filaMidiasGemHUD.length} mídia(s)/print(s) anexado(s).` : ''}\nSiga rigorosamente o ${diretrizTom}.${regrasInviolaveisSaida}`;
        }

        const respostaBruta = await chamarMotorGeminiAPI(comando, precisaDosCards, {
            onChunk: (parcial) => {
                const bodyEl = doc.getElementById('gem-stream-body');
                if (bodyEl) bodyEl.innerHTML = formatarHtmlRespostaGem(parcial);
            }
        });

        const duracaoSeg = ((performance.now() - inicioMs) / 1000).toFixed(1);
        const respostaLimpa = respostaBruta.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
        ultimaRespostaGeradaGem = respostaLimpa;
        copiarTextoUniversal(respostaLimpa).catch(() => {});

        const novoItemHist = {
            id: Date.now(),
            titulo: (texto.replace(/\s+/g, ' ').trim().slice(0, 22) || 'Resposta IA'),
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            modelo: window.ultimoModeloUsadoGem || 'gemini',
            segundos: duracaoSeg,
            resposta: respostaLimpa,
            conversa: [
                { role: 'user', parts: [{ text: comando }] },
                { role: 'model', parts: [{ text: respostaLimpa }] }
            ]
        };

        window.historicoRespostasGem.unshift(novoItemHist);
        if (window.historicoRespostasGem.length > 5) {
            window.historicoRespostasGem = window.historicoRespostasGem.slice(0, 5);
        }
        salvarHistoricoGemSessao();
        renderizarResultadoCompletoGem(novoItemHist);

        reagirAnjo(modo === 'desabafo' ? 'calm' : 'spark', 1500);
        mostrarToast(`⚡ Resposta pronta em ${duracaoSeg}s e copiada!`);
    } catch (err) {
        reagirAnjo('normal', 0);
        outBox.innerHTML = `<div class="gem-ans-body" style="color:#f87171;">❌ ${err.message}</div>`;
    }
};

// 5. CONTINUIDADE DA CONVERSA E REFINO EM 1 CLIQUE (MESMO ASSUNTO!)
window.continuarAssuntoGem = async function(instrucaoDireta = null) {
    const doc = obterDocAtivo();
    const inputFollow = doc.getElementById('gem-followup-input');
    const pergunta = (instrucaoDireta || inputFollow?.value || '').trim();
    if (!pergunta) return mostrarToast("Digite o ajuste ou questionamento para continuar!");

    const itemHist = window.historicoRespostasGem.find(h => h.id === window.idHistoricoGemAtivo) || window.historicoRespostasGem[0];
    if (!itemHist) return mostrarToast("Gere uma resposta primeiro!");

    if (inputFollow && !instrucaoDireta) inputFollow.value = '';
    const bodyEl = doc.getElementById('gem-stream-body');
    if (bodyEl) bodyEl.innerHTML = `<em>⚡ Atualizando resposta com seu ajuste...</em>`;
    reagirAnjo('thinking', 0);

    const inicioMs = performance.now();
    const conversaAtual = Array.isArray(itemHist.conversa) ? [...itemHist.conversa] : [
        { role: 'model', parts: [{ text: itemHist.resposta }] }
    ];
    conversaAtual.push({
        role: 'user',
        parts: [{ text: `${pergunta}\n\nEntregue APENAS a resposta final atualizada pronta para enviar ao cliente em 1ª pessoa, sem asteriscos (**).` }]
    });

    try {
        const respostaBruta = await chamarMotorGeminiAPI(pergunta, true, {
            historicoContents: conversaAtual,
            onChunk: (parcial) => {
                const b = doc.getElementById('gem-stream-body');
                if (b) b.innerHTML = formatarHtmlRespostaGem(parcial);
            }
        });

        const duracaoSeg = ((performance.now() - inicioMs) / 1000).toFixed(1);
        const respostaLimpa = respostaBruta.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
        conversaAtual.push({ role: 'model', parts: [{ text: respostaLimpa }] });

        itemHist.resposta = respostaLimpa;
        itemHist.segundos = duracaoSeg;
        itemHist.modelo = window.ultimoModeloUsadoGem || itemHist.modelo;
        itemHist.conversa = conversaAtual.slice(-10); // Mantém últimos 5 turnos leves
        salvarHistoricoGemSessao();

        copiarTextoUniversal(respostaLimpa).catch(() => {});
        renderizarResultadoCompletoGem(itemHist);
        reagirAnjo('spark', 1200);
        mostrarToast(`💬 Resposta atualizada em ${duracaoSeg}s e copiada!`);
    } catch (err) {
        reagirAnjo('normal', 0);
        mostrarToast(`❌ ${err.message}`);
    }
};

window.refinarRespostaGem = function(tipo) {
    const comandos = {
        encurtar: 'Deixe a resposta acima ainda mais curta e direta (máximo 2 frases objetivas), mantendo a solução.',
        firme: 'Reescreva a resposta acima em tom mais firme, técnico e definitivo, sem pedir desculpas.',
        passos: 'Reorganize a resposta acima em um passo a passo numerado curto (1., 2., 3.) fácil de ler no WhatsApp.',
        amigavel: 'Reescreva a resposta acima em tom mais leve, cordial e acolhedor, mantendo a objetividade.'
    };
    continuarAssuntoGem(comandos[tipo] || comandos.encurtar);
};

// 6. AUTO-DETECÇÃO DE NOME E CONDOMÍNIO (1 CLIQUE)
window.detectarDadosClienteNoTexto = async function() {
    const doc = obterDocAtivo();
    let fonte = doc.getElementById('gemini-hud-input')?.value.trim() || '';
    if (!fonte) {
        fonte = await lerTextoUniversalClipboard();
    }
    if (!fonte) return mostrarToast("Cole uma conversa na IA Gem ou copie um texto primeiro!");

    let achouAlgo = false;
    const matchCond = fonte.match(/(?:condom[ií]nio|residencial|edif[ií]cio|edificio)\s+([A-ZÀ-Úa-zà-ú0-9][A-ZÀ-Úa-zà-ú0-9\s\-]{2,36}?)(?=[,.\n!?]|$|unidade|apto|bloco|torre)/i);
    if (matchCond && matchCond[1]) {
        const elCond = doc.getElementById('var-condominio') || document.getElementById('var-condominio');
        if (elCond) {
            elCond.value = capitalizarNomeCliente(matchCond[1].trim());
            achouAlgo = true;
        }
    }

    const matchNome = fonte.match(/(?:nome|me chamo|sou o|sou a|aqui [eé] o|aqui [eé] a|falo com)\s*:?\s*([A-ZÀ-Úa-zà-ú]{2,18}(?:\s+[A-ZÀ-Úa-zà-ú]{2,18})?)/i);
    if (matchNome && matchNome[1]) {
        const elNome = doc.getElementById('var-nome') || document.getElementById('var-nome');
        if (elNome) {
            elNome.value = capitalizarNomeCliente(matchNome[1].trim());
            achouAlgo = true;
        }
    }

    if (achouAlgo) {
        aoDigitarVariavelPersonalizacao();
        mostrarToast("✨ Dados do cliente preenchidos automaticamente!");
    } else {
        mostrarToast("Não identifiquei Nome/Condomínio explícito no texto.");
    }
};

// ==============================================================
// 12. CHECKLIST INTERATIVO N1/N2 (SEU CONDOMÍNIO • NO CLIQUE)
// ==============================================================
const CHECKLISTS_N1N2 = {
    app: {
        label: '📱 App / Convite',
        passos: [
            { txt: 'Confirmar e-mail cadastrado e unidade/bloco', msg: 'Consegue me confirmar o seu e-mail cadastrado, o nome do condomínio e a sua unidade/bloco para eu verificar o acesso?' },
            { txt: 'Checar caixa de Spam / Lixeira pelo convite', msg: 'Verifique por gentileza na caixa de Spam ou Lixo Eletrônico se o e-mail de ativação do Seu Condomínio chegou lá.' },
            { txt: 'Convite com nome de antigo morador (Editar Perfil)', msg: 'Nesse caso, clique em "Editar perfil" no link, crie sua senha e depois acesse "Editar perfil" novamente para atualizar os dados. O ideal é a administração excluir o cadastro antigo e criar um novo.' }
        ]
    },
    boleto: {
        label: '💰 Boleto / Remessa',
        passos: [
            { txt: 'Confirmar competência/mês e unidade do boleto', msg: 'Pode me informar o nome do condomínio, a unidade e o mês de vencimento do boleto para eu analisar?' },
            { txt: 'Validar se remessa foi enviada ao banco', msg: 'Verifique em Financeiro > Cobranças > Ações > Remessas se o boleto já foi registrado junto ao banco.' },
            { txt: 'Pedir print da mensagem de erro na emissão', msg: 'Consegue me enviar um print da tela onde aparece o erro ao tentar gerar o boleto?' }
        ]
    },
    ofx: {
        label: '🔍 Conciliação OFX',
        passos: [
            { txt: 'Conferir período exato do extrato OFX importado', msg: 'Consegue me confirmar qual período (data inicial e final) foi exportado no arquivo OFX do banco?' },
            { txt: 'Verificar se há boleto excluído sem baixa no banco', msg: 'Verifique se algum boleto liquidado no extrato foi excluído no sistema antes da baixa de retorno, causando a divergência.' },
            { txt: 'Solicitar arquivo OFX ou print da divergência', msg: 'Se puder me enviar o print da tela de conciliação (ou o valor exato da diferença), já analiso a causa raiz para você!' }
        ]
    },
    portaria: {
        label: '🛡️ Portaria / Acessos',
        passos: [
            { txt: 'Validar se a permissão do perfil está ativa', msg: 'Verifique no cadastro da unidade se o morador está com status ativo e permissão habilitada para a portaria.' },
            { txt: 'Testar em aba anônima / limpar cache do navegador', msg: 'Por gentileza, faça um teste abrindo o sistema em uma Aba Anônima (Ctrl + Shift + N) para descartarmos cache do navegador.' }
        ]
    }
};
let abaChecklistAtiva = 'app';

window.selecionarAbaChecklist = function(chave) {
    abaChecklistAtiva = chave;
    renderizarChecklistN1N2();
};

window.copiarPerguntaChecklist = function(chave, idx) {
    const passo = CHECKLISTS_N1N2[chave]?.passos?.[idx];
    if (!passo) return;
    copiarTextoUniversal(passo.msg).catch(() => {});
    reagirAnjo('spark', 650);
    mostrarToast("✓ Pergunta de triagem copiada pro Ctrl+V!");
};

window.renderizarChecklistN1N2 = function() {
    const doc = obterDocAtivo();
    const tabs = doc.getElementById('checklist-tabs-container');
    const list = doc.getElementById('checklist-steps-container');
    if (!tabs || !list) return;

    tabs.innerHTML = Object.entries(CHECKLISTS_N1N2).map(([k, v]) => `
        <button type="button" class="gem-tone-chip ${abaChecklistAtiva === k ? 'active' : ''}" onclick="selecionarAbaChecklist('${k}')">${v.label}</button>
    `).join('');

    const atual = CHECKLISTS_N1N2[abaChecklistAtiva] || CHECKLISTS_N1N2.app;
    list.innerHTML = atual.passos.map((p, idx) => `
        <div class="checklist-step-row">
            <label><input type="checkbox"> <span>${p.txt}</span></label>
            <button type="button" class="btn-hud-action" style="padding:2px 7px; font-size:9px; border-color:var(--neon-blue); color:#7dd3fc;" onclick="copiarPerguntaChecklist('${abaChecklistAtiva}', ${idx})">Copiar</button>
        </div>
    `).join('');
};

// ==============================================================
// 13. ANJO HOLOGRÁFICO + SANTUÁRIO DE SERENIDADE + SOM ETÉREO (WEB AUDIO)
// ==============================================================
let somEtereoAtivo = localStorage.getItem('sc_holo_sound') === 'true';
let modoSutilAnjo = localStorage.getItem('sc_holo_subtle') === 'true';
let vistaPortalSidebar = localStorage.getItem('sc_holo_portal_view') || 'anjo';
let _timerEstadoAnjo = null;
let _timersRespiracao = [];
let _audioCtxEtereo = null;

const PRECES_SERENIDADE = [
    "“A calma é o escudo da alma serena. Que a paz guie cada palavra do seu atendimento.”",
    "“Senhor, fazei-me instrumento da Vossa paz. Onde houver impaciência, que eu leve serenidade.”",
    "“Respire fundo: você não precisa absorver a pressa do outro. Responda em luz, firmeza e equilíbrio.”",
    "“A paciência também é caridade. Cada atendimento feito com amor eleva o seu próprio espírito.”",
    "“Que os bons espíritos envolvam este ambiente de trabalho em harmonia, clareza e proteção.”"
];

function inicializarPortalAnjoHolografico() {
    const portal = document.getElementById('sidebar-holo-portal');
    const viewAnjo = document.getElementById('portal-view-anjo');
    const viewPlaneta = document.getElementById('portal-view-planeta');
    const titulo = document.getElementById('holo-portal-title');
    const btnSom = document.getElementById('btn-holo-sound');
    const btnSutil = document.getElementById('btn-holo-subtle');

    if (portal) portal.classList.toggle('holo-subtle', modoSutilAnjo);
    if (viewAnjo && viewPlaneta) {
        viewAnjo.style.display = vistaPortalSidebar === 'anjo' ? 'flex' : 'none';
        viewPlaneta.style.display = vistaPortalSidebar === 'planeta' ? 'flex' : 'none';
    }
    if (titulo) {
        titulo.innerText = vistaPortalSidebar === 'anjo' ? '✦ ANJO DE LUZ' : '✦ ÓRBITA SERENA';
    }
    if (btnSom) {
        btnSom.classList.toggle('active', somEtereoAtivo);
        btnSom.innerHTML = `<span class="material-icons-round">${somEtereoAtivo ? 'volume_up' : 'volume_off'}</span>`;
    }
    if (btnSutil) {
        btnSutil.classList.toggle('active', modoSutilAnjo);
    }
}

window.alternarPortalSidebar = function() {
    vistaPortalSidebar = (vistaPortalSidebar === 'anjo') ? 'planeta' : 'anjo';
    localStorage.setItem('sc_holo_portal_view', vistaPortalSidebar);
    inicializarPortalAnjoHolografico();
    tocarNotaEterea('suave');
};

window.alternarModoSutilAnjo = function() {
    modoSutilAnjo = !modoSutilAnjo;
    localStorage.setItem('sc_holo_subtle', modoSutilAnjo ? 'true' : 'false');
    inicializarPortalAnjoHolografico();
    mostrarToast(modoSutilAnjo ? "✨ Holograma em modo sutil." : "👼 Holograma em modo pleno!");
};

window.alternarSomEtereo = function() {
    somEtereoAtivo = !somEtereoAtivo;
    localStorage.setItem('sc_holo_sound', somEtereoAtivo ? 'true' : 'false');
    inicializarPortalAnjoHolografico();
    if (somEtereoAtivo) {
        tocarNotaEterea('bencao');
        mostrarToast("🔔 Som etéreo suave ativado!");
    } else {
        mostrarToast("🔇 Som etéreo silenciado.");
    }
};

window.tocarNotaEterea = function(tipo = 'suave') {
    if (!somEtereoAtivo) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!_audioCtxEtereo) _audioCtxEtereo = new AudioCtx();
        if (_audioCtxEtereo.state === 'suspended') _audioCtxEtereo.resume();

        const agora = _audioCtxEtereo.currentTime;
        const notas = tipo === 'bencao' ? [528, 660, 792] : [432, 648];

        notas.forEach((freq, i) => {
            const osc = _audioCtxEtereo.createOscillator();
            const gain = _audioCtxEtereo.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, agora + i * 0.09);

            gain.gain.setValueAtTime(0.0001, agora + i * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.032, agora + i * 0.09 + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.0001, agora + i * 0.09 + 0.95);

            osc.connect(gain);
            gain.connect(_audioCtxEtereo.destination);
            osc.start(agora + i * 0.09);
            osc.stop(agora + i * 0.09 + 1.0);
        });
    } catch (e) {}
};

window.reagirAnjo = function(estado = 'normal', duracaoMs = 1200) {
    const portal = document.getElementById('sidebar-holo-portal');
    const lbl = document.getElementById('angel-status-label');
    if (!portal) return;

    clearTimeout(_timerEstadoAnjo);
    portal.classList.remove('state-thinking', 'state-calm', 'state-spark');

    if (estado === 'thinking') {
        portal.classList.add('state-thinking');
        if (lbl) lbl.innerText = 'EM SINTONIA...';
    } else if (estado === 'calm') {
        portal.classList.add('state-calm');
        if (lbl) lbl.innerText = 'PAZ & EQUILÍBRIO';
    } else if (estado === 'spark') {
        portal.classList.add('state-spark');
        if (lbl) lbl.innerText = 'LUZ IRRADIADA';
    } else {
        if (lbl) lbl.innerText = 'LUZ & PAZ';
    }

    if (duracaoMs > 0) {
        _timerEstadoAnjo = setTimeout(() => {
            portal.classList.remove('state-thinking', 'state-calm', 'state-spark');
            if (lbl) lbl.innerText = 'LUZ & PAZ';
        }, duracaoMs);
    }
};

window.pulsarBencaoAnjo = function() {
    reagirAnjo('calm', 2400);
    tocarNotaEterea('bencao');
    trocarPensamentoEspirita();
    mostrarToast("👼 Luz, paz e serenidade irradiadas para o seu atendimento!");
};

window.novaPreceSerenidade = function() {
    const el = document.getElementById('serenidade-quote-text');
    if (!el) return;
    const nova = PRECES_SERENIDADE[Math.floor(Math.random() * PRECES_SERENIDADE.length)];
    el.innerText = nova;
    tocarNotaEterea('suave');
};

window.iniciarRespiracaoGuiada = function() {
    _timersRespiracao.forEach(t => clearTimeout(t));
    _timersRespiracao = [];

    const stage = document.getElementById('serenidade-breath-stage');
    const phase = document.getElementById('serenidade-breath-phase');
    if (!stage || !phase) return;

    const ciclo = () => {
        stage.classList.remove('breath-hold', 'breath-out');
        stage.classList.add('breath-in');
        phase.innerText = '🌬️ Inspire luz profundamente... (4s)';

        _timersRespiracao.push(setTimeout(() => {
            stage.classList.remove('breath-in');
            stage.classList.add('breath-hold');
            phase.innerText = '✨ Segure em serenidade... (2s)';
        }, 4000));

        _timersRespiracao.push(setTimeout(() => {
            stage.classList.remove('breath-hold');
            stage.classList.add('breath-out');
            phase.innerText = '🕊️ Solte toda tensão devagar... (6s)';
        }, 6000));

        _timersRespiracao.push(setTimeout(() => {
            const modal = document.getElementById('modal-serenidade-anjo');
            if (modal && modal.style.display !== 'none') ciclo();
        }, 12200));
    };

    ciclo();
};

window.abrirSantuarioSerenidade = function() {
    const modal = document.getElementById('modal-serenidade-anjo');
    if (!modal) return;
    modal.style.display = 'flex';
    novaPreceSerenidade();
    tocarNotaEterea('bencao');
    iniciarRespiracaoGuiada();
};

window.fecharSantuarioSerenidade = function() {
    _timersRespiracao.forEach(t => clearTimeout(t));
    _timersRespiracao = [];
    const modal = document.getElementById('modal-serenidade-anjo');
    if (modal) modal.style.display = 'none';
};
