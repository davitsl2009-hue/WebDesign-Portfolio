/* =========================================================================
   PROJETO TROCA-FOLHA — JAVASCRIPT
   Este arquivo cobre os pontos da aula:
     - manipular elementos da página (selecionar e alterar o que já existe)
     - criar interações com botões
     - alterar conteúdo, cor e estilo através de eventos
     - usar o evento "click"
     - organizar o código separado do HTML, mas ligado a ele pelo <script>
   ========================================================================= */


/* -------------------------------------------------------------------------
   1. MANIPULAR ELEMENTOS DA PÁGINA
   document.querySelector()  -> pega UM elemento que casa com o seletor CSS
   document.querySelectorAll() -> pega TODOS os elementos que casam
   Guardamos essas referências em variáveis para não precisar buscar de
   novo toda vez que formos usá-las.
   ------------------------------------------------------------------------- */
const botaoTema = document.querySelector("#botao-tema");
const botaoReservar = document.querySelector("#botao-reservar");
const contadorVagas = document.querySelector("#contador-vagas");
const botoesFavoritar = document.querySelectorAll(".botao-favoritar");
const contadorFavoritos = document.querySelector("#contador-favoritos");


/* -------------------------------------------------------------------------
   2. ALTERNAR TEMA CLARO/ESCURO — evento "click" + alterar estilo
   O HTML define as cores do tema escuro em [data-theme="dark"] (ver CSS).
   Aqui o JS só liga e desliga esse atributo no <html> e troca o emoji
   do botão — ele não decide nenhuma cor, só qual estado está ativo.
   ------------------------------------------------------------------------- */
botaoTema.addEventListener("click", function () {
  const raiz = document.documentElement; // a tag <html>
  const temaAtual = raiz.getAttribute("data-theme");

  if (temaAtual === "dark") {
    raiz.setAttribute("data-theme", "light");
    botaoTema.textContent = "🌙"; // alterar CONTEÚDO do botão
  } else {
    raiz.setAttribute("data-theme", "dark");
    botaoTema.textContent = "☀️";
  }
});


/* -------------------------------------------------------------------------
   3. BOTÃO "RESERVAR VAGA" — alterar texto, cor e estado por evento
   Cada clique reserva uma vaga: o texto do contador muda, e quando as
   vagas acabam o próprio botão muda de aparência e para de funcionar.
   ------------------------------------------------------------------------- */
let vagasRestantes = 76; // estado guardado em uma variável comum

botaoReservar.addEventListener("click", function () {
  if (vagasRestantes <= 0) {
    return; // já esgotou, o clique não faz nada
  }

  vagasRestantes = vagasRestantes - 1;

  if (vagasRestantes > 0) {
    contadorVagas.textContent = vagasRestantes + " vagas restantes.";
  } else {
    // alterar CONTEÚDO e também a CLASSE (que muda a cor/estilo no CSS)
    contadorVagas.textContent = "Vagas esgotadas para esta edição.";
    botaoReservar.textContent = "Vagas esgotadas";
    botaoReservar.classList.add("esgotado");
    botaoReservar.disabled = true;
  }
});


/* -------------------------------------------------------------------------
   4. BOTÃO "FAVORITAR" EM CADA CARD — interação repetida com forEach
   Como existem vários botões iguais (um por card), usamos um laço
   forEach para ligar o MESMO comportamento a cada um deles.
   "this" dentro da função dá acesso ao botão que foi realmente clicado.
   ------------------------------------------------------------------------- */
let totalFavoritos = 0;

botoesFavoritar.forEach(function (botao) {
  botao.addEventListener("click", function () {
    // closest() sobe pelo HTML até achar o card "pai" deste botão
    const card = botao.closest(".card");
    const jaEstaFavoritado = botao.classList.contains("favoritado");

    if (jaEstaFavoritado) {
      // desfavoritar: remove classes e volta o texto original
      botao.classList.remove("favoritado");
      card.classList.remove("favoritado");
      botao.textContent = "🤍 Favoritar";
      totalFavoritos = totalFavoritos - 1;
    } else {
      // favoritar: adiciona classes (o CSS cuida da cor) e troca o texto
      botao.classList.add("favoritado");
      card.classList.add("favoritado");
      botao.textContent = "💚 Favoritada";
      totalFavoritos = totalFavoritos + 1;
    }

    atualizarContadorFavoritos();
  });
});

function atualizarContadorFavoritos() {
  if (totalFavoritos === 0) {
    contadorFavoritos.textContent = "Nenhuma muda favoritada ainda.";
  } else if (totalFavoritos === 1) {
    contadorFavoritos.textContent = "1 muda favoritada.";
  } else {
    contadorFavoritos.textContent = totalFavoritos + " mudas favoritadas.";
  }
}