window.onload = function() {
  Particles.init({
    selector: '.background',
    maxParticles: 400,
    connectParticles: false,
    color: ["#E1FFFB", "#F2FE89", "#4087FB"],
    sizeVariations: 2,
  });
};

//STATE VARIABLES
const jsConfetti = new JSConfetti();
const COMPUTER_GAME = "computerGame";
const PASS_N_PLAY_GAME = "passPlayGame";
const PLAYERS = {
  '0': {
    color: "var(--board-square-color)",
    name: null
  },
  '1': {
    color: "var(--player-x-color)",
    name: "X",
    emphasis: "player-emphasis-x"
  },
  '-1': {
    color: "var(--player-o-color)",
    name: "O",
    emphasis: "player-emphasis-o"
  }
}

const WIN_COMBOS = [
  [0, 1, 2], //horizontal top
  [6, 7, 8], //horizontal bottom

  [0, 3, 6], //vertical left
  [2, 5, 8], //vertical right

  [0, 4, 8], //diagonal (main)
  [2, 4, 6], //diagonal (anti)

  [3, 4, 5], 
  [1, 4, 7],
]

let chosenGame;
let chosenPiece;
let computerPiece;
let board;
let playerTurn;
//X(1), O(-1), Tie("T")
let winner = null;
let winningComboIndice;
let isMusicOn = false;

// CACHED ELEMENTS
const overlayBg = document.getElementById("overlay");
const gameTypePopup = document.getElementById("pick-player-div");
const resetBtn = document.getElementById("reset-btn");
const boardEl = document.getElementById("board-container");
const squareChoices = document.querySelectorAll("#board-container > div");
const squareChoiceEl = [...document.querySelectorAll("#board-container > div")];
const messageEl = document.getElementById("game-message");
const bottomArtText = document.getElementById("circle");

resetBtn.style.visibility = "hidden";

// EVENT LISTENERS
resetBtn.addEventListener("click", clearBoard);


// FUNCTIONS
function onHover(e) {
  e.target.style.backgroundColor = "var(--board-square-hover)";
}
function triggerDarkBg(e) {
  e.target.style.backgroundColor = PLAYERS['0'].color;
}

function clearBoard() {
  squareChoices.forEach(square => {
    square.textContent = "";
    square.className = "";
  })
  init();
}

// --> INITIALIZE
init();
playMusic();

function init() {
  setDisplayGameType("on");
  initialGameType();
};

function initialGameType() {
  let passPlayBtn = document.getElementById("passnplay-btn");
  let computerPlayBtn = document.getElementById("vs-computer-btn");

  passPlayBtn.addEventListener("click", () => {
    chosenGame = "passPlayGame";
    setDisplayGameType("off");
    triggerPassPlayGame();
  })
}

function setDisplayGameType(onOrOff) {
  if (onOrOff === "on") {
    gameTypePopup.style.display = "flex";
    overlayBg.style.display = "block";
  } else {
    gameTypePopup.style.display = "none";
    overlayBg.style.display = "none";
  }
}

function setFirstPlayer() {
  let pickX = document.getElementById("usr-pick-x");
  let pickO = document.getElementById("usr-pick-o");
  pickX.addEventListener("click", xPlayerFirst);
  pickO.addEventListener("click", oPlayerFirst);
}  

function xPlayerFirst() {
  chosenPiece = 1;
  playerTurn = 1;
}
function oPlayerFirst() {
  chosenPiece = -1;
  playerTurn = -1;
}

function clearBoardGame() {
  squareChoices.forEach(square => {
    square.textContent = "";
    square.className = "";
  })
  board = [
    null,null,null, //row 0
    null,null,null, //row 1
    null,null,null, //row 2
  ];
  playerTurn = 1;
  winner = null;
  messageEl.textContent = "";
}
// CURRENTLY WORKING ON
function triggerNewGame() {
  clearBoardGame();
  renderBoard();
  squareChoices.forEach((choice) => {
    choice.addEventListener("mouseenter", onHover);
    choice.addEventListener("mouseleave", triggerDarkBg);
  })
  boardEl.addEventListener("click", handleGameType);
}

//triggerCompGame
function triggerComputerGame() {
  triggerNewGame();
}

//passPlayGame
function triggerPassPlayGame() {
  triggerNewGame();
}

//handles data change / interaction of click event
function handleGameType(evt) {
  if (chosenGame === PASS_N_PLAY_GAME) {
    passPlayGameRender(evt);
  } else {
    passComputerGameRender(evt);
  }
}

function passComputerGameRender(evt) {
  let clickedSquareIdx = squareChoiceEl.indexOf(evt.target);
  let boardIdx = board[clickedSquareIdx];
  if (boardIdx) return;
  if (winner !== null) return;
  console.log("helloo", winner);
}

function passPlayGameRender(evt) {
  let clickedSquareIdx = squareChoiceEl.indexOf(evt.target);
  let boardIdx = board[clickedSquareIdx];
  if (boardIdx) return;
  if (winner !== null) return;
  onClickSound();  
  //make mark on board
  board[clickedSquareIdx] = playerTurn;
  createMoves(playerTurn, clickedSquareIdx);
  winner = checkWinner();
  playerTurn *= -1;
  render();
}

function createMoves(playerTurn, indexOfSquareEl) {
  //DOM = create X and O elements to display
  let divSquareEl = document.getElementById(`${indexOfSquareEl}`);
  let createPlayerPiece = document.createElement("h1");
  createPlayerPiece.classList.add(`player-${PLAYERS[playerTurn].name}`);
  createPlayerPiece.innerText = `${PLAYERS[playerTurn].name}`;
  divSquareEl.append(createPlayerPiece);
  //end of create elements
}

function checkWinner() {
  for (let i = 0; i < WIN_COMBOS.length; i++) {
    let indexValsArr = WIN_COMBOS[i];
    let boardMapVals = [];
    let boardMapValsIndex = [];
    board.forEach((val, indx) => {
      if (indexValsArr.includes(indx)) {
        boardMapVals.push(val);
        boardMapValsIndex.push(indx);
      }
    })
    let total = boardMapVals.reduce((acc, curr) => acc + curr);
    let absTotal = Math.abs(total);
    if (absTotal === 3 ) {
      //update winning combo array
      winningComboIndice = boardMapValsIndex;
      return total === 3 ? 1 : -1
    }
  }
   return !board.includes(null) ? "T" : null;
}

// --> RENDER
function render() {
  renderBoard();
  renderMessage();
  renderControls();
}

function renderBoard() {
  squareChoiceEl.forEach((squareChoice, idx) => {
    squareChoice.style.background = PLAYERS['0'].color;
  });
}

function renderMessage() {
  let currentPlayer = PLAYERS[playerTurn];
  let winningPlayer = PLAYERS[winner];
  
  if (winner === "T") {
    messageEl.innerText = "It's a Tie❗❗";
  } else if (winner) {
    messageEl.innerHTML = `<span class="${winningPlayer.emphasis}" style="color: ${winningPlayer.color}">${winningPlayer.name.toUpperCase()}</span> WINS!`;
  } else {
    //Game is still in process
    messageEl.innerHTML = `<span class="${currentPlayer.emphasis}" style="color: ${currentPlayer.color}">${currentPlayer.name.toUpperCase()}</span>'s turn`;
    bottomArtText.innerText = `${currentPlayer.name}`
  }
}

function renderControls() {
  if (winner || !board.includes(null)) {
    onEndGameSound();
    resetBtn.style.visibility = "visible";
    triggerWinAnimation(winner);
  } else {
    //continue game
    resetBtn.style.visibility = "hidden";
  }
}
// End of game functions
function triggerWinAnimation(winningPlayer) {
  throwEmoji(winningPlayer, 120);
  if (winner !== 'T') {
    pushWinningSquares(winningComboIndice);
  }
}

function throwEmoji(winningPlayer, size) {
  if (winningPlayer === 1) {
    jsConfetti.addConfetti({
      emojis: ['⭐️', '👾', '❌', '🚀'],
      emojiSize: size
    })
  } else if (winningPlayer === -1) {
    jsConfetti.addConfetti({
      emojis: ['🔮', '🪐', '🌕', '🫧'],
      emojiSize: size
  })} else if ((winningPlayer === "T")) {
    jsConfetti.addConfetti({
      emojis: ['🥴', '😐', '🫢'],
      emojiSize: size
    })
  }
} 

function pushWinningSquares(winningCombo) {
  //map index values stored as an element in winning combo
  //(cont...) to the div squares index
  //refer to squareChoiceEl
  squareChoices.forEach((choice) => {
    choice.removeEventListener("mouseenter", onHover);
    choice.removeEventListener("mouseleave", triggerDarkBg);
  })
  let winningDivs = squareChoiceEl.filter((square, idx) => 
  winningCombo.includes(idx));
  let nonWinningDivs = squareChoiceEl.filter((square, idx) => !winningCombo.includes(idx));
  winningDivs.forEach((winningDiv, idx) => {
    winningDiv.classList.add(`animation-${idx + 1}`);
  })
  nonWinningDivs.forEach((square, idx) => {
    square.style.backgroundColor = "var(--board-square-hover)";
  })
} 

function playMusic() {
  const audio2 = document.getElementById("music-btn");
  const audio = new Audio("./music/music_zapsplat_game_music_arcade_electro_repeating_retro_arp_electro_drums_serious_012.mp3");
  audio2.addEventListener("click", () => {
    if (isMusicOn) {
      isMusicOn = false;
      audio2.innerText = "Play Tunes"
      audio.pause();
  
    } else {
      audio2.innerText = "Stop Music!"
      isMusicOn = true;
      audio.play();
    }
  })

}

function onClickSound() {
  const audio = new Audio("./music/esm_5_wickets_sound_fx_arcade_casino_kids_mobile_app.mp3");
  audio.playbackRate = 1;
  audio.play();
}

function onEndGameSound() {
  const endGameAudio = new Audio("./music/esm_8_bit_small_win_arcade_80s_simple_alert_notification_game.mp3");
  endGameAudio.play();
}