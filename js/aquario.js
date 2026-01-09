/* ================= AQUÁRIO / PEIXE ================= */

// 🔹 Muda imagem de fundo conforme pontuação
window.MudImg = function () {
    if (!window.player) return;

    const playerScore = player.score || 0;
    const gameElement = document.getElementById("aquario");
    if (!gameElement) return;

    gameElement.style.backgroundImage = `url('img/${playerScore}.gif')`;

    // fade-in
    setTimeout(() => {
        gameElement.style.opacity = 1;
    }, 10);
};


// 🔹 Atualiza tamanho do peixe (ciclo)
window.atualizarPeixe = function () {
    if (!window.player) return;

    const peixe = document.getElementById("peixe");
    if (!peixe) return;

    const MAX = 6.66;

    if (player.correctAnswers >= MAX) {
        player.correctAnswers = 0;
    }

    const escala = 1 + player.correctAnswers * 0.01;
    peixe.style.transform = `scale(${Math.min(1.5, escala)})`;
};


// 🔹 Anima erro (bolha)
window.peixeErrou = function () {
    const peixe = document.getElementById("peixe");
    const aquario = document.getElementById("aquario");
    if (!peixe || !aquario) return;

    peixe.style.transform = "scale(0.95)";

    const bolha = document.createElement("div");
    bolha.className = "bolha";
    aquario.appendChild(bolha);

    setTimeout(() => bolha.remove(), 2000);
};


// 🔹 Solta comida (palavra)
window.soltarComida = function (texto) {
    const aquario = document.getElementById("aquario");
    if (!aquario) return;

    const comida = document.createElement("div");
    comida.className = "comida";
    comida.textContent = texto;
    comida.style.left = Math.random() * 70 + "%";

    aquario.appendChild(comida);

    // 🐟 peixe percebe a comida
    setTimeout(() => {
        peixeVaiAte(comida);
    }, 300);

    // 🍽️ peixe come
    setTimeout(() => {
        comida.remove();
        crescerPeixe();
    }, 1300);
};


// 🔹 Peixe se move até a comida
window.peixeVaiAte = function (comida) {
    const peixe = document.getElementById("peixe");
    if (!peixe || !comida) return;

    const comidaX = comida.offsetLeft;
    const peixeLargura = peixe.offsetWidth;

    // centraliza o peixe na comida
    peixe.style.left = (comidaX - peixeLargura / 2) + "px";

    const peixeX = peixe.offsetLeft;

    peixe.style.transform = comidaX > peixeX ? "scaleX(1)" : "scaleX(-1)";
};


// 🔹 Crescimento visual do peixe
window.crescerPeixe = function () {
    if (!window.player) return;

    const peixe = document.getElementById("peixe");
    if (!peixe) return;

    const escala = 1 + player.correctAnswers * 0.01;
    peixe.style.transform = `scale(${Math.min(1.4, escala)})`;
};


// 🔎 Debug
console.log("aquario.js carregado com sucesso");

// Blogger-safe export ensured
