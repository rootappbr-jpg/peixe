/* ================= TTS ================= */

window.speakQueue = Promise.resolve();
window.voicesLoaded = false;
window.voicePT = null;
window.voiceEN = null;


// 🔹 Carrega vozes disponíveis
window.loadVoices = function () {
    const voices = speechSynthesis.getVoices();

    // Português (prioridade Google)
    window.voicePT =
        voices.find(v => v.lang === "pt-BR" && v.name.includes("Google")) ||
        voices.find(v => v.lang === "pt-BR") ||
        voices.find(v => v.lang.startsWith("pt"));

    // Inglês (prioridade Google)
    window.voiceEN =
        voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ||
        voices.find(v => v.lang === "en-GB" && v.name.includes("Google")) ||
        voices.find(v => v.lang.startsWith("en"));

    window.voicesLoaded = true;
};


// 🔹 Evento padrão do navegador
speechSynthesis.onvoiceschanged = window.loadVoices;
window.loadVoices();


// 🔹 Fala texto (fila segura)
window.speak = function (text, gap = 300, lang = "auto") {
    window.speakQueue = window.speakQueue.then(() => {
        return new Promise(resolve => {
            if (!window.voicesLoaded) window.loadVoices();

            const utter = new SpeechSynthesisUtterance(text);

            // 🔍 Detecta idioma automaticamente
            const isEnglish =
                lang === "en" ||
                /^[a-zA-Z\s.,!?']+$/.test(text);

            if (isEnglish && window.voiceEN) {
                utter.voice = window.voiceEN;
                utter.lang = window.voiceEN.lang;
                utter.rate = 0.95;
            } else if (window.voicePT) {
                utter.voice = window.voicePT;
                utter.lang = "pt-BR";
                utter.rate = 0.95;
            }

            utter.pitch = 1.0;
            utter.volume = 1.0;

            utter.onend = () => setTimeout(resolve, gap);

            speechSynthesis.speak(utter);
        });
    });
};


// 🔎 Debug
console.log("tts.js carregado com sucesso");

// Blogger-safe export ensured
