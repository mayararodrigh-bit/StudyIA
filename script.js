
// STUDYIA - Sistema de organização de estudos

// Recuperar tarefas salvas no navegador
let tarefas = JSON.parse(localStorage.getItem("studyIA_tarefas")) || [];

// Elementos da página
const formTarefa = document.getElementById("formTarefa");
const nomeTarefa = document.getElementById("nomeTarefa");
const materiaTarefa = document.getElementById("materiaTarefa");
const prazoTarefa = document.getElementById("prazoTarefa");
const listaTarefas = document.getElementById("listaTarefas");

// Salvar tarefas no LocalStorage
function salvarTarefas() {
    localStorage.setItem("studyIA_tarefas", JSON.stringify(tarefas));
}

// Atualizar os números do painel
function atualizarResumo() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = total - concluidas;

    document.getElementById("totalTarefas").textContent = total;
    document.getElementById("tarefasConcluidas").textContent = concluidas;
    document.getElementById("tarefasPendentes").textContent = pendentes;

    const porcentagem = total === 0
        ? 0
        : Math.round((concluidas / total) * 100);

    document.getElementById("barraProgresso").style.width =
        porcentagem + "%";

    document.getElementById("porcentagem").textContent =
        porcentagem + "% concluído";

    document.getElementById("textoProgresso").textContent =
        total === 0
            ? "Você ainda não cadastrou nenhuma tarefa."
            : `Você concluiu ${concluidas} de ${total} tarefas. Continue assim!`;
}

// Mostrar as tarefas na tela
function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    if (tarefas.length === 0) {
        listaTarefas.innerHTML =
            '<p class="vazio">Nenhuma tarefa cadastrada ainda.</p>';
    }

    tarefas.forEach(tarefa => {
        const item = document.createElement("div");
        item.className = tarefa.concluida
            ? "tarefa concluida"
            : "tarefa";

        const info = document.createElement("div");
        info.className = "tarefa-info";

        const titulo = document.createElement("h4");
        titulo.textContent = tarefa.nome;

        const detalhes = document.createElement("p");
        detalhes.textContent =
            `${tarefa.materia} • Prazo: ${tarefa.prazo}`;

        info.append(titulo, detalhes);

        const acoes = document.createElement("div");
        acoes.className = "acoes";

        const concluir = document.createElement("button");
        concluir.className = "btn-concluir";
        concluir.textContent = tarefa.concluida
            ? "Desfazer"
            : "Concluir";

        concluir.addEventListener("click", () => {
            tarefa.concluida = !tarefa.concluida;
            salvarTarefas();
            renderizarTarefas();
            atualizarResumo();
        });

        const excluir = document.createElement("button");
        excluir.className = "btn-excluir";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", () => {
            tarefas = tarefas.filter(t => t.id !== tarefa.id);
            salvarTarefas();
            renderizarTarefas();
            atualizarResumo();
        });

        acoes.append(concluir, excluir);
        item.append(info, acoes);
        listaTarefas.appendChild(item);
    });

    atualizarResumo();
}

// Cadastrar uma nova tarefa
formTarefa.addEventListener("submit", function(event) {
    event.preventDefault();

    const novaTarefa = {
        id: Date.now(),
        nome: nomeTarefa.value.trim(),
        materia: materiaTarefa.value,
        prazo: prazoTarefa.value,
        concluida: false
    };

    if (!novaTarefa.nome) {
        alert("Digite o nome da atividade!");
        return;
    }

    tarefas.push(novaTarefa);

    salvarTarefas();
    renderizarTarefas();

    formTarefa.reset();

    alert("Tarefa cadastrada com sucesso! 📚");
});

// Assistente de dicas de estudo
const dicas = [
    "Estude durante 25 minutos e faça uma pausa de 5 minutos. Isso ajuda na concentração!",
    "Faça pequenos resumos com suas próprias palavras para memorizar melhor.",
    "Organize suas tarefas por prioridade e comece pelas mais importantes.",
    "Evite distrações durante os estudos. Deixe o celular de lado por alguns minutos.",
    "Revise o conteúdo aprendido antes de dormir.",
    "Faça exercícios e questões para testar o que você aprendeu!",
    "Divida assuntos grandes em pequenas etapas para facilitar o aprendizado."
];

document.getElementById("btnDica").addEventListener("click", function() {
    const indice = Math.floor(Math.random() * dicas.length);

    document.getElementById("dicaIA").textContent = dicas[indice];
});

// Inicializar o sistema
renderizarTarefas();
