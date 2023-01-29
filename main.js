//STATE VARIABLES

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
  [0, 1, 2],
  [6, 7, 8],

  [0, 3, 6],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],

  [3, 4, 5],
  [1, 4, 7],
]

let board;
let playerTurn;
//X, O, Tie
let winner = null;

// CACHED ELEMENTS
const resetBtn = document.getElementById("reset-btn");
resetBtn.style.visibility = "visible";
const boardEl = document.getElementById("board-container");
const squareChoices = document.querySelectorAll("#board-container > div");
const squareChoiceEl = [...document.querySelectorAll("#board-container > div")];
const messageEl = document.getElementById("game-message");

// EVENT LISTENERS
squareChoices.forEach((choice) => {
  choice.addEventListener("mouseenter", onHover);
  choice.addEventListener("mouseleave", triggerDarkBg);
})
boardEl.addEventListener("click", handleMove);
resetBtn.addEventListener("click", clearBoard);


// FUNCTIONS
function onHover(e) {
  e.target.style.backgroundColor = "var(--board-square-hover)";
}
function triggerDarkBg(e) {
  e.target.style.backgroundColor = PLAYERS['0'].color;
}

function clearBoard() {
  squareChoices.forEach(square => square.textContent = "")
  init();
}

// --> INITIALIZE
init();
function init() {
  board = [
    null,null,null, //col 0
    null,null,null, //col 1
    null,null,null, //col 2
  ];

  playerTurn = 1;
  winner = null;
  render();
};

//handles data change / interaction of click event
function handleMove(evt) {
  let clickedSquareIdx = squareChoiceEl.indexOf(evt.target);
  let boardIdx = board[clickedSquareIdx];

  if (boardIdx) return;
  if (winner !== null) return;

  board[clickedSquareIdx] = playerTurn;
  //DOM
  let divSquareEl = document.getElementById(`${clickedSquareIdx}`);
  let createPlayerPiece = document.createElement("h1");
  createPlayerPiece.classList.add(`player-${PLAYERS[playerTurn].name}`);
  createPlayerPiece.innerText = `${PLAYERS[playerTurn].name}`;
  divSquareEl.append(createPlayerPiece);

  playerTurn *= -1;
  render();
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
  }
}

function renderControls() {
  if (winner || !board.includes(null)) {
    resetBtn.style.visibility = "visible";
  } else {
    resetBtn.style.visibility = "hidden";
  }
}