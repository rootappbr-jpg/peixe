const wordEl = document.getElementById("word");
const traduzEl = document.getElementById("TraduzPt");

window.traduzirWord = function() {
    const palavra = wordEl.textContent.trim();

    if (!palavra) {
        traduzEl.textContent = "";
        return;
    }

    fetch(`/traduzir?word=${encodeURIComponent(palavra)}`)
        .then(r => r.json())
        .then(data => {
            traduzEl.textContent = data.traducao || "";
        });
}

// Blogger-safe export ensured
