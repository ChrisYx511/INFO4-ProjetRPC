/*  College Jean-Eudes -- (Chris) Xi Yang - 410
    Concentration Informatique - Roche papier ciseaux
*/

// Sounds
const bgmGreenGreens = new Audio("./assets/common/bgm/greengreens.webm")
const bgmSandCanyon = new Audio("./assets/common/bgm/sandcanyon.mp3")
const bgmGourmetRace = new Audio("./assets/common/bgm/gourmetrace.webm")

const sfxLevelClear = new Audio("./assets/common/sfx/levelclear.webm")
const sfxTimeToLearn = new Audio("./assets/common/sfx/timetolearn.webm")
const sfxClick = new Audio("./assets/common/sfx/click.wav")
const sfxPaper = new Audio("./assets/common/sfx/paper.wav")
const sfxCissors = new Audio("./assets/common/sfx/cissors.wav")
const sfxRock = new Audio("./assets/common/sfx/rock.wav")
const sfxCrash = new Audio("./assets/common/sfx/crash.wav")

// Global vars
const dialogBox = document.querySelector("#dialogBox")
const computerSection = document.querySelector("#computerSection")
const playerSection = document.querySelector("#playerSection")
let matchData = []
let globalNumberOfTurns
let currentTurn
let currentMatchGlobalPlayerChoice
let currentMatchGlobalCPUChoice
let bgmChoice

function startGame() {
    sfxClick.play()
    //Initial Checks
    globalNumberOfTurns = parseInt(document.querySelector("#turnsInput").value)
    console.log("Number of Turns: "+ globalNumberOfTurns)
    if (isNaN(globalNumberOfTurns) != false || globalNumberOfTurns > 20) {
        failGameStart()
    } else {
        rpsStartProcedure()
    }
    currentTurn = 1
}

function failGameStart() {
    // Notifier si la valeur des tours n'est pas un chiffre entre 1-20
    const startButton = document.querySelector("#startButton")
    startButton.value = "Le nombre de tours doit être un nombre de 1 à 20!"
    setInterval(function(){
        startButton.value = "Commencer!"
    }, 2000)
}


function rpsStartProcedure() {
    // Initial Elm Positioning
    dialogBox.innerHTML = `
    <div id="playerSelection" class="control">Choix du joueur</div>
    <div id="computerSelection" class="control">Choix CPU</div>
    <h2 class="promptTextHead" id="gameTurnMessage" style="bottom:30px; position: absolute;"><span>${globalNumberOfTurns} tours restant</span></h2>
    <h2 class="promptTextHead" id="gameStatusMessage" style="bottom:100px; position: absolute;"><span>Choisissez roche, papier ou ciseaux.</span></h2>
    `
    computerSection.style.display = "inherit"
    playerSection.style.display = "inherit"
    // BGM
    bgmChoice = Math.floor(Math.random() * 3)
    console.log("BGM Choice: " + bgmChoice)
    switch (bgmChoice) {
        case 0:
            bgmGreenGreens.play()
            bgmGreenGreens.volume = 0.5
            bgmGreenGreens.loop = true
            break;
        case 1:
            bgmSandCanyon.play()
            bgmSandCanyon.volume = 0.5
            bgmSandCanyon.loop = true
            break;
        case 2:
            bgmGourmetRace.play()
            bgmGourmetRace.volume = 0.5
            bgmGourmetRace.loop = true
            break;
    }

}

function rpsDoEndPlayerChoice(choice) {
    // Process player choice
    const playerSelection = document.querySelector("#playerSelection")
    const gameStatusMessage = document.querySelector("#gameStatusMessage")
    let choiceFriendlyName
    if (choice === "rock") {
        choiceFriendlyName = "Roche"
        sfxRock.play()
    } else if (choice === "cutter") {
        choiceFriendlyName = "Ciseaux"
        sfxCissors.play()
    } else if (choice === "paper") {
        choiceFriendlyName = "Papier"
        sfxPaper.play()
    }
    // Generate Statuses
    gameStatusMessage.innerHTML = "<span>Attente du choix de l'ordinateur...</span>"
    playerSelection.innerHTML = `Choix du joueur<img src="./assets/playerassets/${choice}.png" alt="${choiceFriendlyName}">`

    currentMatchGlobalPlayerChoice = choice
    console.log(currentMatchGlobalPlayerChoice)

    playerSection.style.display = "none"
    // Calll computer choice
    rpsDoComputerChoice()
}

function rpsDoComputerChoice() {
    // Declarations
    const computerRock = document.querySelector("#computerRock")
    const computerScissors = document.querySelector("#computerScissors")
    const computerPaper = document.querySelector("#computerPaper")
    const computerSelection = document.querySelector("#computerSelection")
    let randomPick = Math.floor(Math.random() * 3)
    let visualCycle = 0
    let choice
    
    // VISUAL ONLY: Colour cycle on computer choices
    let cycleInterval = setInterval(function() {
        switch (visualCycle) {
            case 0:
                computerScissors.style.backgroundColor = "white"
                computerPaper.style.backgroundColor = "white"
                computerRock.style.backgroundColor = "greenyellow"
                break;
            case 1:
                computerPaper.style.backgroundColor = "white"
                computerRock.style.backgroundColor = "white"
                computerScissors.style.backgroundColor = "greenyellow"
                break;
            case 2:
                computerScissors.style.backgroundColor = "white"
                computerRock.style.backgroundColor = "white"
                computerPaper.style.backgroundColor = "greenyellow"
                break;
        }

        visualCycle = visualCycle + 1
        if (visualCycle > 2) {
            visualCycle = 0
        }
    }, 250)
    // Show computer choice
    setTimeout(function() {
        clearInterval(cycleInterval);
        switch (randomPick) {
            case 0:
                computerScissors.style.backgroundColor = "white"
                computerPaper.style.backgroundColor = "white"
                computerRock.style.backgroundColor = "greenyellow"
                choice = "rock"
                sfxRock.play()
                break;
            case 1:
                computerPaper.style.backgroundColor = "white"
                computerRock.style.backgroundColor = "white"
                computerScissors.style.backgroundColor = "greenyellow"
                choice = "cutter"
                sfxCissors.play()
                break;
            case 2:
                computerScissors.style.backgroundColor = "white"
                computerRock.style.backgroundColor = "white"
                computerPaper.style.backgroundColor = "greenyellow"
                choice = "paper"
                sfxPaper.play()
                break;
        }
        currentMatchGlobalCPUChoice = choice
        // Define friendlyName for Alt Text
        let choiceFriendlyName
        if (choice === "rock") {
            choiceFriendlyName = "Roche"
        } else if (choice === "cutter") {
            choiceFriendlyName = "Ciseaux"
        } else if (choice === "paper") {
            choiceFriendlyName = "Papier"
        }
        computerSelection.innerHTML = `Choix CPU<img src="./assets/cpuassets/${choice}.png" alt="${choiceFriendlyName}">`
        // Call match decision making
        rpsDoDecisionMaking()
    }, 4000)

}

// rpsDoDecisionMaking(): Decides match winner
function rpsDoDecisionMaking() {
    const gameStatusMessage = document.querySelector("#gameStatusMessage")
    // Choice Debug Log
    console.log(currentMatchGlobalCPUChoice)
    console.log(currentMatchGlobalPlayerChoice)
    
    // Comparaisons pour savoir le gagnant de la partie actuelle
    if (currentMatchGlobalCPUChoice === currentMatchGlobalPlayerChoice) {
        console.log("DRAW")
        gameStatusMessage.innerHTML = "<span>C'est une EGALITE!</span>"
        matchData.push("draw")
    } else if (currentMatchGlobalPlayerChoice === "rock" && currentMatchGlobalCPUChoice === "cutter") {
        console.log("PLAYER WIN")
        gameStatusMessage.innerHTML = "<span>JOUEUR GAGNANT!</span>"
        matchData.push("player")
    } else if (currentMatchGlobalPlayerChoice === "paper" && currentMatchGlobalCPUChoice === "rock") {
        console.log("PLAYER WIN")
        gameStatusMessage.innerHTML = "<span>JOUEUR GAGNANT!</span>"
        matchData.push("player")
    } else if (currentMatchGlobalPlayerChoice === "cutter" && currentMatchGlobalCPUChoice === "paper") {
        console.log("PLAYER WIN")
        gameStatusMessage.innerHTML = "<span>JOUEUR GAGNANT!</span>"
        matchData.push("player")
    } else {
        console.log("CPU WIN")
        gameStatusMessage.innerHTML = "<span>CPU GAGNANT!</span>"
        matchData.push("cpu")
    }

    // VISUAL: Placer le pointage à l'aide de silhouettes de personnages en de sous des représ. des choix
    let distance
    let heightAdd
    // Define positions depend. on which game we're on
    switch (matchData.length) {
        case 1:
            distance = "40px"
            heightAdd = "0px"
            break;
        case 2:
            distance = "75px"
            heightAdd = "0px"
            break;
        case 3:
            distance = "110px"
            heightAdd = "0px"
            break;
        case 4:
            distance = "145px"
            heightAdd = "0px"
            break;
        case 5:
            distance = "180px"
            heightAdd = "0px"
            break;
        case 6:
            distance = "40px"
            heightAdd = "35px"
            break;
        case 7:
            distance = "75px"
            heightAdd = "35px"
            break;
        case 8:
            distance = "110px"
            heightAdd = "35px"
            break;
        case 9:
            distance = "145px"
            heightAdd = "35px"
            break;
        case 10:
            distance = "180px"
            heightAdd = "35px"
            break;
        case 11:
            distance = "40px"
            heightAdd = "70px"
            break;
        case 12:
            distance = "75px"
            heightAdd = "70px"
            break;
        case 13:
            distance = "110px"
            heightAdd = "70px"
            break;
        case 14:
            distance = "145px"
            heightAdd = "70px"
            break;
        case 15:
            distance = "180px"
            heightAdd = "70px"
            break;
        case 16:
            distance = "40px"
            heightAdd = "105px"
            break;
        case 17:
            distance = "75px"
            heightAdd = "105px"
            break;
        case 18:
            distance = "110px"
            heightAdd = "105px"
            break;
        case 19:
            distance = "145px"
            heightAdd = "105px"
            break;
        case 20:
            distance = "180px"
            heightAdd = "105px"
            break;                                                              
    }
    // Place HTML Elements for scorekeeping
    console.log(matchData)
    if (matchData[matchData.length - 1] === "player") {
        dialogBox.innerHTML += `
        <img src="./assets/playerassets/stockicon.png" alt="Wins" class="stockIcon" style="left: ${distance}; top: calc(220px + ${heightAdd});">
        <div class="stockIcon" style="right: ${distance}; top: calc(220px + ${heightAdd});"></div>
        `
    } else if (matchData[matchData.length - 1] === "cpu") {
        dialogBox.innerHTML += `
        <img src="./assets/cpuassets/stockicon.png" alt="Wins" class="stockIcon" style="right: ${distance}; top: calc(220px + ${heightAdd});">
        <div class="stockIcon" style="left: ${distance}; top: calc(220px + ${heightAdd});"></div>
        `
    } else {
        dialogBox.innerHTML += `
        <div class="stockIcon" style="left: ${distance}; top: calc(220px + ${heightAdd});"></div>
        <div class="stockIcon" style="right: ${distance}; top: calc(220px + ${heightAdd});"></div>
        `
    }
    // Decide if the game is over dep. on number of turns
    if (currentTurn === globalNumberOfTurns) {
        switch (bgmChoice) {
            case 0:
                bgmGreenGreens.pause()
                bgmGreenGreens.currentTime = 0
                break;
            case 1:
                bgmSandCanyon.pause()
                bgmSandCanyon.currentTime = 0
                break;
            case 2:
                bgmGourmetRace.pause()
                bgmGourmetRace.currentTime = 0
                break;
        }
    
        sfxCrash.play()
        endGame()
    } else {
        currentTurn = currentTurn + 1
        rpsResetGame()
    }
}

// rpsResetGame(): Prépare le jeu pour un autre tour
function rpsResetGame() {
    
    let remainingTurns = globalNumberOfTurns - currentTurn + 1
    const computerRock = document.querySelector("#computerRock")
    const computerScissors = document.querySelector("#computerScissors")
    const computerPaper = document.querySelector("#computerPaper")
    const playerSelection = document.querySelector("#playerSelection")
    const computerSelection = document.querySelector("#computerSelection")
    const gameTurnMessage = document.querySelector("#gameTurnMessage")
    const gameStatusMessage = document.querySelector("#gameStatusMessage")
    setTimeout(function() {
        
        playerSelection.innerHTML = "Choix du joueur"
        computerSelection.innerHTML = "Choix CPU"
        gameTurnMessage.innerHTML = "<span>" + remainingTurns + " tours restant</span>"
        gameStatusMessage.innerHTML = "<span>Choisissez roche, papier ou ciseaux.</span>"

        computerScissors.style.backgroundColor = "white"
        computerPaper.style.backgroundColor = "white"
        computerRock.style.backgroundColor = "white"
        playerSection.style.display = "inherit"
    }, 3500)

}

function endGame() {
    let playerWins = 0
    let cpuWins = 0
    let finalWinner
    // Store each match result from matchData array as a count to see who has more points
    for (let i = 0; i < matchData.length; i++) {
        switch (matchData[i]) {
            case "player":
                playerWins++
                break;
            case "cpu":
                cpuWins++
                break;
        }
    }

    setTimeout(function() {
        // Decides and display Final Winner 
        if (cpuWins < playerWins) {
            finalWinner = "Joueur"
            sfxLevelClear.play()
        } else if (cpuWins > playerWins) {
            finalWinner = "Ordinateur"
            sfxTimeToLearn.play()
        } else {
            sfxTimeToLearn.play()
            finalWinner = "EGALITE"
        }
        computerSection.style.display = "none"
        playerSection.style.display = "none"
        dialogBox.innerHTML = `
        <h2 class="promptTextHead"><span>Gagnant: ${finalWinner}!</span></h2>
        <p class="promptTextBody">Jouer une autre partie?</p>
        <input type="button" value="Recommencer!" id="restartButton" class="promptTextBody" onclick="location.reload()">
        `
    }, 2000)
}