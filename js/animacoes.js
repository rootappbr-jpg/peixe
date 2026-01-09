/* ================= ANIMAÇÃO DA PALAVRA ================= */

window.animateWord = function (isCorrect) {
    if (!window.wordEl) return;

    wordEl.classList.remove("hot", "cold", "error");

    if (isCorrect) {
        wordEl.classList.add("hot");

        setTimeout(() => {
            wordEl.classList.remove("hot");
            wordEl.classList.add("cold");
        }, 800);
    } else {
        wordEl.classList.add("error");

        setTimeout(() => {
            wordEl.classList.remove("error");
        }, 800);
    }
};


// 🔎 Debug
console.log("animateWord carregado");

// Blogger-safe export ensured
