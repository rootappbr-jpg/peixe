// Atualize 
window.AtulizaNivel = function() {
    const hits = player.correctAnswers;
    if (hits === 0 || hits % 5 !== 0) return;
    const index = (hits / 5) - 1;
    
    exportUser();// Salva o progresso 
    player.level++;// Aumenta o nível
    feedbackEl.innerHTML = `<div class="msg level">⬆️ Nível UP!</div>`;
    speak("Nível aumentado, Salve seu Progresso...");
    savePlayer();
    updateUserInfo();
}

/* ================= JOGO ================= */
window.imporResetarTotal = function() {
    if (!player) return;

    const ok = confirm("Isso vai apagar TODO o progresso deste usuário. Continuar?");
    if (!ok) return;

    localStorage.removeItem("player_" + player.username);
    location.reload();
}



window.imporResetar = function() {
    if (!player) return;	
	
    const ok = confirm("☠️ Tem certeza que deseja resetar todo o progresso e o histórico de palavras?");
    if (!ok) return;

    // Limpa dados básicos do player
    player.score = 0;
    player.level = 1;
    player.current = 0;

    // Limpa estatísticas de cliques
    player.totalAnswered = 0;
    player.correctAnswers = 0;
    player.wrongAnswers = 0;
    player.clicksCorrect = 0;
    player.clicksWrong = 0;

    // ✨ NOVO: Limpa o histórico de acertos/erros por palavra
    player.history = {}; 

    // Salva e atualiza a interface
    savePlayer();
    updateUserInfo();
    loadQuestion();

    // Feedback visual e sonoro
    feedbackEl.innerHTML = `<div class="msg level" style="background: #ff4757; color: white;">🔄 TUDO RESETADO!</div>`;
    speak("Progresso resetado");
}

window.updateImageByWord = function(isCorrect) {
    const box = document.getElementById("boxImg");
    const body = document.getElementById("boxColor");

    // limpa estados anteriores
    wordEl.classList.remove("hot", "cold", "error");

    if (isCorrect) {
        box.style.backgroundImage = `url("img/correct.png")`;
        body.style.backgroundColor = "#00800061";

        wordEl.classList.add("hot");

        // volta ao estado frio depois
        setTimeout(() => {
            wordEl.classList.remove("hot");
            wordEl.classList.add("cold");
        }, 800);

    } else {
        box.style.backgroundImage = `url("img/incorrect.png")`;
        body.style.backgroundColor = "red";

        wordEl.classList.add("error");

        // remove tremor
		setTimeout(() => {
			body.style.backgroundColor = "";
		}, 500);
    }
}

///Sequencia
window.shuffleArray = function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


window.loadQuestion = function() {

    if (!player) return;

    // bloqueia cliques enquanto carrega
    optionsEl.style.pointerEvents = "none";
	
    const q = questions[player.current];

    wordEl.textContent = q.word;
    wordEl.classList.remove("hot", "error");
    wordEl.classList.add("cold");

   /// feedbackEl.textContent = "";
    optionsEl.innerHTML = "";

    // pré-ativação cognitiva
	if (q.hint) {
		mostrarDicadisplay();
		mostrarOpcoes();
		feedbackEl.innerHTML = 
		`<div class="msg tip"style="display:none;>
  <div class="dica" id="hint">🤔 Dica: ${q.hint} </div>
  <div class="dica" id="hintOff" style="display:none;">🤔 Dica: Desativada</div>
  <div class="exemplo">🧐 Exemplo: ${q.example}</div>
  
<div id="ind" style="
                width: 94%;
                float: left;
                font-size: 26px;
                text-align: center;
                padding: 23px 1px 1px 1px;
                color: #4aa3ff;
            ">
                ${q.ind}
            </div>
	
</div>`	
		}

window.mostrarOpcoes = function() {	
    const hintEl = document.getElementById("options");
    
    if (hintEl) {
        // Resetamos o elemento (caso ele já estivesse visível de uma rodada anterior)
        hintEl.style.display = "none";
        hintEl.classList.remove("options");

        // ⏳ Aguarda 4 segundos para mostrar
        setTimeout(() => {
            hintEl.style.display = "block";
            hintEl.classList.add("options"); // Adiciona a classe que dispara a animação CSS
        }, 4000); 
    }
}

window.registrarNoHistorico = function(palavraKey, resultado) {
	document.getElementById("listaHistorico").innerHTML = listaHistorico || "Sem registros ainda";
	
    if (!player.history) player.history = {};

    // Se a palavra ainda não existe no histórico, cria o objeto inicial
    if (!player.history[palavraKey]) {
        player.history[palavraKey] = { acertos: 0, erros: 0 };
    }

    // Soma +1 ao contador correspondente
    if (resultado === "correto") {
        player.history[palavraKey].acertos++;
    } else {
        player.history[palavraKey].erros++;
    }
}





window.checkAnswer = function(answer) {
EscondeOpcoes()
    const q = questions[player.current];
    player.totalAnswered++;

    if (answer === q.correct) {
        updateImageByWord(true);

        feedbackEl.innerHTML = `
          <div class="msg ok">
            Anterior foi = ✅ Correto!<br>
            ${q.hint ? `<small>💡 ${q.hint}</small><br>` : ""}
            ${q.example ? `<em>🗣 ${q.example}</em>` : ""}
          </div>
        `;
		speak("Correto");
     //   speak(q.example || "Correto");
		setThermo("hot");  // acerto
        player.score++;
        player.correctAnswers++;
        player.clicksCorrect++;
		AtulizaNivel();
	//	registrarNoHistorico(palavraKey, "correto"); // Registro de acerto			
        player.current++;
        animateWord(true);

	//   checkVideoReward();	
		
    } else {
        updateImageByWord(false);
        feedbackEl.innerHTML = `
          <div class="msg error">
            Anterior foi = ❌ Incorreto<br>
        </div>
        `;
		setThermo("cold"); // erro / estado neutro
        speak("Incorreto");

        player.score--;
        player.wrongAnswers++;
        player.clicksWrong++;
	//	registrarNoHistorico(palavraKey, "errado"); // Registro de erro		
        player.current++;
        animateWord(false);

    }

    savePlayer();
    updateUserInfo();
    setTimeout(loadQuestion, 800);
	

}


// Blogger-safe export ensured
