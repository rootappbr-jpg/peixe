/* ================= LOGIN ================= */

// 🔹 Carregar usuário salvo
window.Carregar = function () {
    importUser();

    setTimeout(() => {
        if (!window.player) return;

        normalizarPlayer();
        savePlayer();

        document.getElementById("login").style.display = "none";
        document.getElementById("game").style.display = "block";

        updateUserInfo();
        loadQuestion();
        crescerPeixe(); // 🐟 reaplica tamanho salvo
    }, 200);
};


// 🔹 Login / Novo jogador
window.login = function () {
    const input = document.getElementById("usernameInput");
    const name = input.value.trim() || "Teste";

    const saved = localStorage.getItem("player_" + name);

    if (saved) {
        window.player = JSON.parse(saved);
    } else {
        window.player = {
            username: name,
            score: 0,
            level: 1,
            current: 0
        };
    }

    normalizarPlayer();   // 👈 ESSENCIAL
    savePlayer();

    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";

    updateUserInfo();
    loadQuestion();

    // 🐟 reaplica o crescimento visual
    setTimeout(crescerPeixe, 100);
};


// 🔹 Salvar jogador
window.savePlayer = function () {
    localStorage.setItem(
        "player_" + player.username,
        JSON.stringify(player)
    );
};


// 🔹 Atualizar UI do usuário
window.updateUserInfo = function () {
    document.getElementById("userInfo").innerHTML = `
        <div class="user">${player.username}</div> 
        <div class="placar">⭐ ${player.score} | Nível ${player.level}</div>
    `;

    const totalQuestions = questions.length;
    const remaining = totalQuestions - player.current;

    document.getElementById("stats").innerHTML = `
        <div class="Tx1">📘 Total de questões: <b>${totalQuestions}</b></div>
        <div class="Tx1">✅ Acertos: <b>${player.correctAnswers}</b></div>
        <div class="Tx1">❌ Erros: <b>${player.wrongAnswers}</b></div>
        <div class="Tx1">⏳ Faltam: <b>${remaining}</b></div>
    `;
};


// 🔹 Normaliza dados antigos / novos
window.normalizarPlayer = function () {
    player.correctAnswers ??= 0;
    player.wrongAnswers ??= 0;
    player.totalAnswered ??= 0;
    player.clicksCorrect ??= 0;
    player.clicksWrong ??= 0;
    player.history ??= {};
};


// 🔹 Sair do jogo
window.sair = function () {
    exportUser();
    location.href = "../index.html";
};


// 🔎 Debug (opcional)
console.log("login.js carregado com sucesso");

// Blogger-safe export ensured
