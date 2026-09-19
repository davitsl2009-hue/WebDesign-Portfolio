/* =========================================================================
   PROJETO TROCA-FOLHA — JAVASCRIPT + DOM
   Este arquivo cobre os pontos das duas últimas aulas:
     - criação de funções em JavaScript (nomeadas e reutilizáveis)
     - seleção de elementos com getElementById e querySelector
     - manipulação de conteúdo, estilo e ESTRUTURA (criar/remover elementos)
     - eventos de clique disparando essas funções
     - ações a partir da interação do usuário
     - código organizado em funções reaproveitáveis, não repetido
   ========================================================================= */


/* -------------------------------------------------------------------------
   1. SELEÇÃO DE ELEMENTOS
   getElementById  -> pega um elemento pelo atributo id (a forma mais antiga)
   querySelector   -> pega um elemento com qualquer seletor de CSS
   querySelectorAll -> pega uma lista de elementos
   As duas primeiras formas fazem a mesma coisa quando usadas com "#id";
   aqui usamos getElementById nos elementos do formulário só para praticar
   as duas formas de seleção que a aula pediu.
   ------------------------------------------------------------------------- */
const botaoTema        = document.getElementById("botao-tema");
const botaoReservar    = document.getElementById("botao-reservar");
const contadorVagas    = document.getElementById("contador-vagas");
const botoesFavoritar  = document.querySelectorAll(".botao-favoritar");
const contadorFavoritos = document.getElementById("contador-favoritos");

const gradePlantas      = document.querySelector(".grade-plantas");
const campoNomePlanta   = document.getElementById("campo-nome-planta");
const campoNomeDono     = document.getElementById("campo-nome-dono");
const botaoAdicionar    = document.getElementById("botao-adicionar-planta");
const mensagemCadastro  = document.getElementById("mensagem-cadastro");


/* -------------------------------------------------------------------------
   2. FUNÇÃO: alternar tema claro/escuro
   Escrever como função nomeada (em vez de uma função anônima direto no
   addEventListener) deixa o código mais fácil de ler e de reaproveitar,
   caso outro botão precise chamar a mesma ação no futuro.
   ------------------------------------------------------------------------- */
function alternarTema() {
  const raiz = document.documentElement; // a tag <html>
  const temaAtual = raiz.getAttribute("data-theme");

  if (temaAtual === "dark") {
    raiz.setAttribute("data-theme", "light");
    botaoTema.textContent = "🌙";
  } else {
    raiz.setAttribute("data-theme", "dark");
    botaoTema.textContent = "☀️";
  }
}

botaoTema.addEventListener("click", alternarTema);


/* -------------------------------------------------------------------------
   3. FUNÇÃO: reservar vaga
   Mexe em conteúdo (texto), classe (estilo) e no atributo "disabled"
   do próprio botão quando as vagas acabam.
   ------------------------------------------------------------------------- */
let vagasRestantes = 76;

function reservarVaga() {
  if (vagasRestantes <= 0) {
    return;
  }

  vagasRestantes = vagasRestantes - 1;

  if (vagasRestantes > 0) {
    contadorVagas.textContent = vagasRestantes + " vagas restantes.";
  } else {
    contadorVagas.textContent = "Vagas esgotadas para esta edição.";
    botaoReservar.textContent = "Vagas esgotadas";
    botaoReservar.classList.add("esgotado");
    botaoReservar.disabled = true;
  }
}

botaoReservar.addEventListener("click", reservarVaga);


/* -------------------------------------------------------------------------
   4. FUNÇÃO REUTILIZÁVEL: favoritar um card
   Em vez de escrever a lógica de favoritar uma vez para os cards que já
   existem e de novo para os cards criados pelo formulário, existe UMA
   função (favoritarCard) e UMA função que liga essa função a um botão
   (ligarBotaoFavoritar). Assim, qualquer botão novo — mesmo criado
   depois, pelo JavaScript — se comporta exatamente igual aos originais.
   ------------------------------------------------------------------------- */
let totalFavoritos = 0;

function favoritarCard(botao) {
  const card = botao.closest(".card");
  const jaEstaFavoritado = botao.classList.contains("favoritado");

  if (jaEstaFavoritado) {
    botao.classList.remove("favoritado");
    card.classList.remove("favoritado");
    botao.textContent = "🤍 Favoritar";
    totalFavoritos = totalFavoritos - 1;
  } else {
    botao.classList.add("favoritado");
    card.classList.add("favoritado");
    botao.textContent = "💚 Favoritada";
    totalFavoritos = totalFavoritos + 1;
  }

  atualizarContadorFavoritos();
}

function atualizarContadorFavoritos() {
  if (totalFavoritos === 0) {
    contadorFavoritos.textContent = "Nenhuma muda favoritada ainda.";
  } else if (totalFavoritos === 1) {
    contadorFavoritos.textContent = "1 muda favoritada.";
  } else {
    contadorFavoritos.textContent = totalFavoritos + " mudas favoritadas.";
  }
}

function ligarBotaoFavoritar(botao) {
  botao.addEventListener("click", function () {
    favoritarCard(botao);
  });
}

// Liga a função em cada botão que já existe no HTML ao carregar a página.
botoesFavoritar.forEach(ligarBotaoFavoritar);


/* -------------------------------------------------------------------------
   5. FUNÇÃO: criar um card de planta do zero (manipulação de ESTRUTURA)
   Até aqui o JS só mudava texto e classe de elementos que já existiam.
   Esta função é diferente: ela cria elementos novos com
   document.createElement e os encaixa no HTML com appendChild — o DOM
   da página passa a ter mais elementos do que o arquivo index.html tinha.
   ------------------------------------------------------------------------- */
function criarCardPlanta(nomePlanta, nomeDono) {
  const card = document.createElement("article");
  card.className = "card";

  const titulo = document.createElement("h3");
  titulo.textContent = nomePlanta;

  const tipo = document.createElement("p");
  tipo.className = "card-tipo";
  tipo.textContent = "Trazida por " + nomeDono;

  const botaoFavoritarNovo = document.createElement("button");
  botaoFavoritarNovo.className = "botao-favoritar";
  botaoFavoritarNovo.type = "button";
  botaoFavoritarNovo.textContent = "🤍 Favoritar";
  ligarBotaoFavoritar(botaoFavoritarNovo); // reaproveita a função do passo 4

  const botaoRemover = document.createElement("button");
  botaoRemover.className = "botao-remover";
  botaoRemover.type = "button";
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", function () {
    card.remove(); // tira este card do DOM
  });

  // Monta a árvore de elementos antes de devolver o card pronto.
  card.appendChild(titulo);
  card.appendChild(tipo);
  card.appendChild(botaoFavoritarNovo);
  card.appendChild(botaoRemover);

  return card;
}


/* -------------------------------------------------------------------------
   6. FUNÇÃO: adicionar a planta cadastrada à galeria
   Lê o que o usuário digitou, valida, cria o card com a função acima
   e insere no DOM dentro de .grade-plantas.
   ------------------------------------------------------------------------- */
function adicionarPlanta() {
  const nomePlanta = campoNomePlanta.value.trim();
  const nomeDono = campoNomeDono.value.trim();

  if (nomePlanta === "") {
    mensagemCadastro.textContent = "Escreva o nome da planta antes de adicionar.";
    return;
  }

  const novoCard = criarCardPlanta(nomePlanta, nomeDono || "um vizinho");
  gradePlantas.appendChild(novoCard);

  mensagemCadastro.textContent = nomePlanta + " foi adicionada à lista!";

  // Limpa os campos para o próximo cadastro.
  campoNomePlanta.value = "";
  campoNomeDono.value = "";
}

botaoAdicionar.addEventListener("click", adicionarPlanta);