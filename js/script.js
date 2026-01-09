window.setThermo = function() {
    if (!player || !thermoBar) return;

    const MAX_PONTOS = 319; // ajuste como quiser
    const pontos = player.correctAnswers;

    // calcula porcentagem (0 a 100)
    let percent = (pontos / MAX_PONTOS) * 100;
    percent = Math.min(100, Math.max(0, percent)); // trava limites

    // aplica altura proporcional
    thermoBar.style.height = percent + "%";

    // cores por estado
    thermoBar.classList.remove("hot", "cold");

    if (percent >= 60) {
        thermoBar.classList.add("hot");
    } else {
        thermoBar.classList.add("cold");
    }
}




window.showFullScreenVideo = function(videoUrl) {
//function showFullScreenLink(url) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "#000";
    overlay.style.zIndex = 9999;

    const iframe = document.createElement("iframe");
    iframe.src = videoUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    const close = document.createElement("button");
    close.innerHTML = "✖";
    close.style.position = "absolute";
    close.style.top = "15px";
    close.style.right = "15px";
    close.style.zIndex = 10000;
    close.style.fontSize = "22px";
    close.style.padding = "6px 12px";
    close.style.border = "none";
    close.style.borderRadius = "6px";
    close.style.cursor = "pointer";
    close.style.background = "rgba(0,0,0,0.6)";
    close.style.color = "#fff";

    close.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(iframe);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
}


// Atualize a função checkVideoReward para usar tela cheia
window.checkVideoReward = function() {
    const hits = player.correctAnswers;

    if (hits === 0 || hits % 10 !== 0) return;

    const index = (hits / 10) - 1;
    if (!rewardVideos[index]) return;

    // Salva o progresso antes de mostrar o vídeo
    exportUser();

    // Mostra o vídeo em tela cheia
    showFullScreenVideo(rewardVideos[index]);

    // Aumenta o nível ao mostrar o vídeo (opcional)
    player.level++;
    feedbackEl.innerHTML = `<div class="msg level">⬆️ Nível UP!</div>`;
    speak("Nível aumentado");
    savePlayer();
    updateUserInfo();
}

// Atualize 
window.AtulizaNivel = function() {
    const hits = player.correctAnswers;
    if (hits === 0 || hits % 10 !== 0) return;
    const index = (hits / 10) - 1;
    
    exportUser();// Salva o progresso 
    player.level++;// Aumenta o nível
    feedbackEl.innerHTML = `<div class="msg level">⬆️ Nível UP!</div>`;
    speak("Nível aumentado, Salve seu Progresso...");
    savePlayer();
    updateUserInfo();
}


window.MudImg = function() {
  // Assuming player.score is defined somewhere in your code
  let playerScore = player.score;  // Example: player.score = 5;

  // Get the game element
  let gameElement = document.getElementById('game');

  // Set the background image dynamically based on the player's score
  gameElement.style.backgroundImage = `url('img/${playerScore}.gif')`;

  // Trigger the fade-in effect by changing the opacity to 1
  setTimeout(() => {
    gameElement.style.opacity = 1;  // Fade in the game element
  }, 10);  // Small timeout to trigger the transition after setting the background
}

window.MudVideo = function() {
  const video = document.getElementById('bgVideo');
  video.src = `vd/${player.score}.mp4`;
  video.load();
}


window.fecharVideo = function() {
    const box = document.getElementById("rewardBox");
    const iframe = document.getElementById("rewardVideo");

    iframe.src = "";
    box.style.display = "none";

    // Sair do fullscreen, se estiver ativo
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}








/* ================= JOGO ================= */


// Adicione esta função auxiliar no script.js
window.registrarNoHistorico = function(palavraKey, resultado) {
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


window.imporResetarTotal = function() {
    if (!player) return;

    const ok = confirm("Isso vai apagar TODO o progresso deste usuário. Continuar?");
    if (!ok) return;

    localStorage.removeItem("player_" + player.username);

    // limpa histórico visual
    const lista = document.getElementById("listaHistorico");
    if (lista) lista.innerHTML = "Sem registros ainda";

    location.reload();
}

window.imporResetar = function() {
    if (!player) return;	

    const ok = confirm("☠️ Tem certeza que deseja resetar todo o progresso?");
    if (!ok) return;

    // progresso geral
    player.score = 0;
    player.level = 1;
    player.current = 0;

    player.totalAnswered = 0;
    player.correctAnswers = 0;
    player.wrongAnswers = 0;
    player.clicksCorrect = 0;
    player.clicksWrong = 0;

    // 🧠 limpa histórico por palavra
    player.history = {};

    savePlayer();
    updateUserInfo();
    loadQuestion();

    // limpa histórico visual
    const lista = document.getElementById("listaHistorico");
    if (lista) lista.innerHTML = "Sem registros ainda";

    feedbackEl.innerHTML = `<div class="msg level">🔄 Progresso resetado</div>`;
    speak("Progresso resetado");
}







window.updateImageByWord = function(isCorrect) {
    const box = document.getElementById("boxImg");
    const body = document.getElementById("boxColor");

    // limpa estados anteriores
    wordEl.classList.remove("hot", "cold", "error");

    if (isCorrect) {
		MudImg()
        box.style.backgroundImage = `url("img/correct.png")`;
        body.style.backgroundColor = "#00800061";

        wordEl.classList.add("hot");

        // volta ao estado frio depois
        setTimeout(() => {
            wordEl.classList.remove("hot");
            wordEl.classList.add("cold");
        }, 800);

    } else {
		MudImg()
        box.style.backgroundImage = `url("img/incorrect.png")`;
        body.style.backgroundColor = "red";

        wordEl.classList.add("error");

        // remove tremor
		setTimeout(() => {
			body.style.backgroundColor = "";
		}, 500);
    }
}


window.toggleHint777777777 = function() {
  const check = document.getElementById("checkHint");
  const hint = document.getElementById("hint");
  const hintOff = document.getElementById("hintOff");

  if (check.checked) {
    hint.style.display = "block";
    hintOff.style.display = "none";
  } else {
    hint.style.display = "none";
    hintOff.style.display = "block";
  }
}

window.toggleHint = function toggleHint() {
  const hint = document.getElementById("hint");
  const hintOff = document.getElementById("hintOff");

  const visivel = hint.style.display === "block";

  hint.style.display = visivel ? "none" : "block";
  hintOff.style.display = visivel ? "block" : "none";
  player.score--;
  updateUserInfo();
}




///Sequencia
window.shuffleArray = function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



window.loadQuestion = function() {
	MudImg()
	MudVideo()
	atualizarHistoricoUI();

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
  <div class="dica" id="hintOff" style="display:none;background-color: rgb(255 22 22 / 56%);">🤔 Dica: Desativada</div>
  <div class="exemplo">🧐 Exemplo: ${q.example}</div>
  
<div id="ind" style="
                width: 94%;
                float: left;
                font-size: 26px;
                text-align: center;
                padding: 1px 1px 1px 1px;
                color: #000000;
                background-color: #f0f8ff7d;
                font-weight: bolder;
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




window.imporResetar = function mostrarDicadisplay() 
 {	
       // ⏳ aguarda 30 segundos antes de mostrar a dica
        setTimeout(() => {
            const hintEl = document.getElementById("hint");
            if (hintEl) {
                hintEl.style.display = "none";
                hintEl.style.backgroundColor = "#ffff168f";
                hintEl.className = "dica";
            }
        }, 1); // 0s
		
 }
//speak(q.hint, 300, "pt"); // 👈 força PT-BR masculino


window.mostrarDica = function() {
  const hint = document.getElementById("hint");
  const example = document.getElementById("example");

  hint.style.display = "block";
  example.style.display = "block";
  
}

 window.esconderDica = function() {
  const hint = document.getElementById("hint");
  const example = document.getElementById("example");

  hint.style.display = "none";
  example.style.display = "none";
 }


    const shuffledChoices = [...q.choices];
    shuffleArray(shuffledChoices);

    shuffledChoices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => checkAnswer(choice);
        optionsEl.appendChild(btn);
    });

    // áudio estratégico
    speak(q.word);
    if (q.example) setTimeout(() => speak(q.example), 600);

    // libera cliques após tudo pronto
    optionsEl.style.pointerEvents = "auto";

    // tradução como apoio
    traduzirWord();
 }


window.ouvirNovamente = function() {
    if (!player) return;

    const q = questions[player.current];
    if (!q) return;

    speak(q.word);
	speak(q.example);
}



window.EscondeOpcoes = function() {
    const options = document.getElementById("options");
    options.style.display = "none";
    options.className = "options";
}


window.atualizarHistoricoUI = function() {
    const lista = document.getElementById("listaHistorico");
    const container = document.querySelector(".historico-container");

    if (!lista || !container) return;

    if (!player.history || Object.keys(player.history).length === 0) {
        lista.innerHTML = "Sem registros ainda";
        return;
    }

    let html = "";

    for (const palavra in player.history) {
        const h = player.history[palavra];
        html += `
            <div style="font-size:14px; margin-bottom:4px;">
                <strong>${palavra}</strong>
                <span style="color:green;">✔ ${h.acertos}</span>
                <span style="color:red; margin-left:6px;">✖ ${h.erros}</span>
            </div>
        `;
    }

    lista.innerHTML = html;

    // ⬇️ auto rolar o CONTAINER (quem realmente rola)
    container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
    });
}




/* ================= EXPORT / IMPORT ================= */

window.exportUser = function() {
	speak("Save your progress");
    if (!player) return;

    const data = JSON.stringify(player, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${player.username}_${player.current}.json`;
    a.click();
}

window.importUser = function() {
	speak("Recover your progress");
    document.getElementById("fileInput").click();
}



document.getElementById("fileInput").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        player = JSON.parse(e.target.result);

        document.getElementById("login").style.display = "none";
        document.getElementById("game").style.display = "block";

        updateUserInfo();
        loadQuestion();
    };
    reader.readAsText(file);
});





window.checkAnswer = function(answer) {
    EscondeOpcoes();

    const q = questions[player.current];
    const palavraKey = q.word;

    player.totalAnswered++;

	if (answer === q.correct) {
		updateImageByWord(true);
		setThermo("hot");
		speak("Correto");

		registrarNoHistorico(palavraKey, "correto");
		atualizarHistoricoUI();

		player.score++;
		player.correctAnswers++;   // 👈 primeiro atualiza o estado
		player.clicksCorrect++;

		soltarComida(palavraKey);  // 👈 isso já chama crescerPeixe()

		AtulizaNivel();
		player.current++;
		animateWord(true);

		} 
	else {
		updateImageByWord(false);
		setThermo("cold");
		speak("Incorreto");

		peixeErrou(); // 👈 reação visual ao erro

		registrarNoHistorico(palavraKey, "erro");
		atualizarHistoricoUI();

		player.score--;
		player.wrongAnswers++;
		player.clicksWrong++;
		player.current++;
		animateWord(false);
	}
		

    savePlayer();
    updateUserInfo();
    setTimeout(loadQuestion, 800);
}












window.soltarComida = function(palavra) {
  const comida = document.createElement("div");
  comida.className = "comida";
  comida.textContent = palavra;

  comida.style.left = Math.random() * 80 + "%";
  document.getElementById("aquario").appendChild(comida);

  setTimeout(() => peixeCome(comida), 1200);
}
window.atualizarPeixe = function() {
    const peixe = document.getElementById("peixe");

    const MAX = 6.66;

    // se chegou ao limite, reinicia o ciclo
    if (player.correctAnswers >= MAX) {
        player.correctAnswers = 0;
    }

    const escala = 1 + player.correctAnswers * 0.01;
    peixe.style.transform = `scale(${Math.min(1.5, escala)})`;
}

window.peixeErrou = function() {
  const peixe = document.getElementById("peixe");
  peixe.style.transform = "scale(0.95)";

  const bolha = document.createElement("div");
  bolha.className = "bolha";
  document.getElementById("aquario").appendChild(bolha);

  setTimeout(() => bolha.remove(), 2000);
}
window.soltarComida = function(texto) {
    const comida = document.createElement("div");
    comida.className = "comida";
    comida.textContent = texto;
    comida.style.left = Math.random() * 70 + "%";

    const aquario = document.getElementById("aquario");
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
}


window.crescerPeixe = function() {
    const peixe = document.getElementById("peixe");
    const escala = 1 + player.correctAnswers * 0.01;
    peixe.style.transform = `scale(${Math.min(1.4, escala)})`;
}
window.peixeVaiAte = function(comida) {
    const peixe = document.getElementById("peixe");
    const aquario = document.getElementById("aquario");
	

    const comidaX = comida.offsetLeft;
    const peixeLargura = peixe.offsetWidth;

    // centraliza o peixe na comida
    peixe.style.left = (comidaX - peixeLargura / 2) + "px";
	const peixeX = peixe.offsetLeft;

	if (comidaX > peixeX) {
		peixe.style.transform = "scaleX(1)";
	} else {
		peixe.style.transform = "scaleX(-1)";
	}

}


// Blogger-safe export ensured
