const STORAGE_KEY = "dogtown_perfil_v2";

const dadosIniciais = {
    cliente: {
        nome: "Cliente DogTown",
        telefone: "(91) 99999-9999",
        email: "cliente@email.com",
        desde: "24/05/1998",
        foto: ""
    },
    pets: [
        { nome: "Luna", especie: "Cachorra", idade: "4 anos", icone: "fa-cat" },
        { nome: "Thor", especie: "Cachorro", idade: "5 anos", icone: "fa-dog" }
    ],
    procedimentos: [
        {
            id: 1, tipo: "banho", titulo: "Banho e Tosa", pet: "Luna",
            data: "2026-08-08", hora: "14:00",
            descricao: "Banho completo, secagem, perfume e corte das unhas.",
            status: "CONCLUÍDO", statusClass: "concluido"
        },
        {
            id: 2, tipo: "vacina", titulo: "Vacina antirrábica", pet: "Thor",
            data: "2026-08-05", hora: "10:30",
            descricao: "Vacina aplicada conforme calendário de vacinação.",
            status: "REALIZADA", statusClass: "realizada"
        },
        {
            id: 3, tipo: "veterinario", titulo: "Consulta veterinária", pet: "Thor",
            data: "2026-07-27", hora: "16:00",
            descricao: "Consulta de rotina. Avaliação geral do animal.",
            status: "CONCLUÍDO", statusClass: "concluido"
        },
        {
            id: 4, tipo: "ocorrencia", titulo: "Doença / Ocorrência", pet: "Luna",
            data: "2026-07-14", hora: "09:20",
            descricao: "Irritação na pele. Tratamento realizado e concluído.",
            status: "RESOLVIDO", statusClass: "resolvido"
        },
        {
            id: 5, tipo: "banho", titulo: "Tosa higiênica", pet: "Thor",
            data: "2026-07-02", hora: "15:30",
            descricao: "Tosa higiênica e corte das unhas.",
            status: "CONCLUÍDO", statusClass: "concluido"
        },
        {
            id: 6, tipo: "vacina", titulo: "Vacina múltipla", pet: "Luna",
            data: "2026-06-20", hora: "11:00",
            descricao: "Dose de reforço aplicada.",
            status: "REALIZADA", statusClass: "realizada"
        }
    ],
    proximo: {
        titulo: "Banho e Tosa",
        pet: "Luna",
        data: "2026-08-15",
        hora: "14:00"
    }
};

let estado = carregarDados();
let filtroAtual = "todos";
let buscaAtual = "";
let mostrarTodos = false;

const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => [...document.querySelectorAll(seletor)];

function carregarDados() {
    try {
        let salvo = null; try { salvo = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        return salvo ? { ...dadosIniciais, ...JSON.parse(salvo) } : JSON.parse(JSON.stringify(dadosIniciais));
    } catch {
        return JSON.parse(JSON.stringify(dadosIniciais));
    }
}

function salvarDados(mostrarMensagem = true) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); } catch (e) {}
    if (mostrarMensagem) mostrarToast("Alterações salvas com sucesso.");
}

function mostrarToast(texto) {
    const toast = $("#toast");
    toast.textContent = texto;
    toast.classList.add("visivel");
    clearTimeout(mostrarToast.timer);
    mostrarToast.timer = setTimeout(() => toast.classList.remove("visivel"), 2600);
}

function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function partesData(data) {
    const d = new Date(`${data}T12:00:00`);
    const meses = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
    return { dia: String(d.getDate()).padStart(2, "0"), mes: meses[d.getMonth()], ano: d.getFullYear() };
}

function iconeTipo(tipo) {
    return { banho: "fa-shower", vacina: "fa-syringe", veterinario: "fa-stethoscope", ocorrencia: "fa-triangle-exclamation" }[tipo] || "fa-paw";
}

function nomeTipo(tipo) {
    return { banho: "Banho/Tosa", vacina: "Vacina", veterinario: "Veterinário", ocorrencia: "Ocorrência" }[tipo] || tipo;
}

function renderizarPets() {
    $("#listaPets").innerHTML = estado.pets.map(pet => `
        <div class="pet-mini">
            <div class="pet-avatar"><i class="fa-solid ${escapar(pet.icone)}"></i></div>
            <div>
                <strong>${escapar(pet.nome)}</strong><br>
                <span style="font-size:0.8rem; color:#666;">${escapar(pet.especie)} • ${escapar(pet.idade)}</span>
            </div>
        </div>
    `).join("");

    $("#novoPet").innerHTML = estado.pets.map(pet => `<option value="${escapar(pet.nome)}">${escapar(pet.nome)}</option>`).join("");
}

function renderizarCliente() {
    $("#clienteNome").value = estado.cliente.nome;
    $("#clienteTelefone").value = estado.cliente.telefone;
    $("#clienteEmail").value = estado.cliente.email;
    $("#clienteDesde").textContent = estado.cliente.desde;

    const preview = $("#fotoPreview");
    const camera = $("#cameraIcon");

    if (estado.cliente.foto) {
        preview.src = estado.cliente.foto;
        preview.hidden = false;
        camera.hidden = true;
    } else {
        preview.hidden = true;
        camera.hidden = false;
    }
}

function renderizarResumo() {
    const total = estado.procedimentos.length;
    const agendado = estado.proximo ? 1 : 0;

    ["#totalPets", "#totalPetsAcomp"].forEach(id => $(id).textContent = estado.pets.length);
    $("#totalProcedimentos").textContent = total;
    $("#totalProcedimentosGeral").textContent = total;
    $("#totalAgendados").textContent = agendado;
    $("#totalAgendadosGeral").textContent = agendado;
}

function renderizarProximo() {
    const p = estado.proximo;
    if (!p) {
        $("#proximoAtendimento").innerHTML = `
            <div class="proximo-icone"><i class="fa-regular fa-calendar-xmark"></i></div>
            <div class="proximo-info">
                <span>PRÓXIMO ATENDIMENTO</span>
                <h3>Nenhum atendimento agendado</h3>
                <p>Você pode adicionar um novo procedimento ao histórico.</p>
            </div>
        `;
        return;
    }

    $("#proximoAtendimento").innerHTML = `
        <div class="proximo-icone"><i class="fa-regular fa-calendar-check"></i></div>
        <div class="proximo-info">
            <span>PRÓXIMO ATENDIMENTO</span>
            <h3>${escapar(p.titulo)}</h3>
            <p>${escapar(p.pet)} <b>•</b> ${formatarData(p.data)} <b>•</b> ${escapar(p.hora)}</p>
        </div>
        <span class="tag-agendado">AGENDADO</span>
    `;
}

function renderizarHistorico() {
    const filtrados = estado.procedimentos
        .slice()
        .sort((a, b) => `${b.data} ${b.hora}`.localeCompare(`${a.data} ${a.hora}`))
        .filter(item => filtroAtual === "todos" || item.tipo === filtroAtual)
        .filter(item => {
            const termo = buscaAtual.toLowerCase().trim();
            if (!termo) return true;
            return `${item.titulo} ${item.pet} ${item.descricao} ${nomeTipo(item.tipo)}`.toLowerCase().includes(termo);
        });

    const limite = mostrarTodos ? filtrados.length : 6;
    const exibidos = filtrados.slice(0, limite);

    $("#historico").innerHTML = exibidos.map(item => {
        const d = partesData(item.data);
        return `
            <article class="item-historico" data-tipo="${escapar(item.tipo)}">
                <div class="data">
                    <strong>${d.dia}</strong>
                    <span>${d.mes}</span>
                </div>

                <div class="icone-procedimento ${escapar(item.tipo)}" title="${nomeTipo(item.tipo)}">
                    <i class="fa-solid ${iconeTipo(item.tipo)}"></i>
                </div>

                <div class="descricao">
                    <h3>${escapar(item.titulo)}</h3>
                    <span class="pet"><i class="fa-solid fa-paw"></i> ${escapar(item.pet)}</span>
                    <p>${escapar(item.descricao || "Sem descrição cadastrada.")}</p>
                </div>

                <div class="data-procedimento">
                    <span><i class="fa-regular fa-calendar"></i> ${formatarData(item.data)}</span>
                    <span><i class="fa-regular fa-clock"></i> ${escapar(item.hora)}</span>
                </div>

                <span class="status-procedimento ${escapar(item.statusClass || "concluido")}">
                    ${escapar(item.status)}
                </span>
            </article>
        `;
    }).join("");

    $("#estadoVazio").hidden = filtrados.length !== 0;
    $("#btnHistoricoCompleto").innerHTML = mostrarTodos
        ? `<i class="fa-solid fa-chevron-up"></i> MOSTRAR MENOS`
        : `<i class="fa-solid fa-clock-rotate-left"></i> VER HISTÓRICO COMPLETO`;

    const anos = [...new Set(filtrados.map(item => new Date(`${item.data}T12:00:00`).getFullYear()))];
    $("#anoHistorico").textContent = anos.length ? anos.join(" / ") : "—";
}

function renderizarTudo() {
    renderizarCliente();
    renderizarPets();
    renderizarResumo();
    renderizarProximo();
    renderizarHistorico();
}

function abrirModal() {
    $("#modalProcedimento").classList.add("aberto");
    $("#modalProcedimento").setAttribute("aria-hidden", "false");
    $("#novoTitulo").focus();
}

function fecharModal() {
    $("#modalProcedimento").classList.remove("aberto");
    $("#modalProcedimento").setAttribute("aria-hidden", "true");
    $("#formProcedimento").reset();
}

function trocarAba(nome) {
    $$(".aba").forEach(btn => btn.classList.toggle("ativa", btn.dataset.aba === nome));
    $$(".conteudo-aba").forEach(sec => sec.classList.toggle("ativa", sec.id === nome));
}

$$(".aba").forEach(btn => btn.addEventListener("click", () => trocarAba(btn.dataset.aba)));

$$(".filtro").forEach(btn => {
    btn.addEventListener("click", () => {
        $$(".filtro").forEach(item => item.classList.remove("selecionado"));
        btn.classList.add("selecionado");
        filtroAtual = btn.dataset.filtro;
        mostrarTodos = false;
        renderizarHistorico();
    });
});

$("#buscaHistorico").addEventListener("input", (e) => {
    buscaAtual = e.target.value;
    mostrarTodos = true;
    renderizarHistorico();
});

$("#btnHistoricoCompleto").addEventListener("click", () => {
    mostrarTodos = !mostrarTodos;
    renderizarHistorico();
});

$("#btnAdicionar").addEventListener("click", abrirModal);
$("#fecharModal").addEventListener("click", fecharModal);
$("#cancelarModal").addEventListener("click", fecharModal);

$("#modalProcedimento").addEventListener("click", (e) => {
    if (e.target.id === "modalProcedimento") fecharModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#modalProcedimento").classList.contains("aberto")) fecharModal();
});

$("#formProcedimento").addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = $("#novoTipo").value;
    const novo = {
        id: Date.now(),
        tipo,
        titulo: $("#novoTitulo").value.trim(),
        pet: $("#novoPet").value,
        data: $("#novoData").value,
        hora: $("#novoHora").value,
        descricao: $("#novoDescricao").value.trim() || "Atendimento registrado no sistema.",
        status: tipo === "ocorrencia" ? "RESOLVIDO" : tipo === "vacina" ? "REALIZADA" : "CONCLUÍDO",
        statusClass: tipo === "ocorrencia" ? "resolvido" : tipo === "vacina" ? "realizada" : "concluido"
    };

    estado.procedimentos.push(novo);
    salvarDados(false);
    fecharModal();
    mostrarTodos = true;
    renderizarTudo();
    mostrarToast("Procedimento adicionado ao histórico.");
});

["#clienteNome", "#clienteTelefone", "#clienteEmail"].forEach(id => {
    $(id).addEventListener("change", () => {
        estado.cliente.nome = $("#clienteNome").value.trim();
        estado.cliente.telefone = $("#clienteTelefone").value.trim();
        estado.cliente.email = $("#clienteEmail").value.trim();
    });
});

$("#btnSalvar").addEventListener("click", () => {
    estado.cliente.nome = $("#clienteNome").value.trim();
    estado.cliente.telefone = $("#clienteTelefone").value.trim();
    estado.cliente.email = $("#clienteEmail").value.trim();
    salvarDados();
});

$("#fotoPet").addEventListener("change", (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
        mostrarToast("Selecione uma imagem válida.");
        return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
        estado.cliente.foto = leitor.result;
        renderizarCliente();
        salvarDados(false);
        mostrarToast("Foto atualizada.");
    };
    leitor.readAsDataURL(arquivo);
});

$("#btnImprimir").addEventListener("click", () => window.print());

$("#btnExcluir").addEventListener("click", () => {
    const confirmou = confirm("Isso vai apagar os dados salvos localmente e restaurar o exemplo original. Deseja continuar?");
    if (!confirmou) return;

    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    estado = JSON.parse(JSON.stringify(dadosIniciais));
    filtroAtual = "todos";
    buscaAtual = "";
    mostrarTodos = false;
    $("#buscaHistorico").value = "";
    $$(".filtro").forEach(item => item.classList.toggle("selecionado", item.dataset.filtro === "todos"));
    renderizarTudo();
    mostrarToast("Dados restaurados para o exemplo inicial.");
});

$("#btnEnviar").addEventListener("click", async () => {
    const assunto = encodeURIComponent(`Perfil DogTown - ${estado.cliente.nome}`);
    const corpo = encodeURIComponent(
        `Cliente: ${estado.cliente.nome}\nTelefone: ${estado.cliente.telefone}\nE-mail: ${estado.cliente.email}\nPets: ${estado.pets.map(p => p.nome).join(", ")}\nProcedimentos registrados: ${estado.procedimentos.length}`
    );
    window.location.href = `mailto:?subject=${assunto}&body=${corpo}`;
});

$("#btnMenu").addEventListener("click", () => {
    mostrarToast("Use os filtros, busca e botão de adicionar para gerenciar o perfil.");
});

const hoje = new Date();
const dataPadrao = new Date(hoje);
dataPadrao.setDate(dataPadrao.getDate() + 1);
$("#novoData").value = dataPadrao.toISOString().slice(0, 10);
$("#novoHora").value = "14:00";

// Inicializa a renderização
renderizarTudo();