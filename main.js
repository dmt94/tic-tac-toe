window.onload = function() {
  Particles.init({
    selector: '.background',
    maxParticles: 100,
    connectParticles: false,
    color: ["#E1FFFB", "#F2FE89", "#4087FB"],
    sizeVariations: 2,
    //options
    responsive: [
      {
        breakpoints: 768,
        options: {
          // maxParticles: 80,
        }
      }
    ]
  });
};

//STATE VARIABLES
const jsConfetti = new JSConfetti();
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

  [3, 4, 5], //
  [1, 4, 7],
]

let board;
let playerTurn;
//X(1), O(-1), Tie("T")
let winner = null;

// CACHED ELEMENTS
const resetBtn = document.getElementById("reset-btn");
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
    null,null,null, //row 0
    null,null,null, //row 1
    null,null,null, //row 2
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

  //make mark on board
  board[clickedSquareIdx] = playerTurn;

  //DOM = create X and O elements to display
  let divSquareEl = document.getElementById(`${clickedSquareIdx}`);
  let createPlayerPiece = document.createElement("h1");
  createPlayerPiece.classList.add(`player-${PLAYERS[playerTurn].name}`);
  createPlayerPiece.innerText = `${PLAYERS[playerTurn].name}`;
  divSquareEl.append(createPlayerPiece);
  
  //end of create elements

  winner = checkWinner();
  playerTurn *= -1;
  render();
}

function checkWinner() {
  for (let i = 0; i < WIN_COMBOS.length; i++) {

    let indexValsArr = WIN_COMBOS[i];
    let boardMapVals = board.filter((val, idx) => indexValsArr.includes(idx));
    let total = boardMapVals.reduce((acc, curr) => acc + curr);
    let absTotal = Math.abs(total);

    if (absTotal === 3 ) {
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
  }
}

function renderControls() {
  if (winner || !board.includes(null)) {
    resetBtn.style.visibility = "visible";
    //change confetti emojis according to who wins
    // X , O, Tie
      if (winner === 1) {
        jsConfetti.addConfetti({
          emojis: ['⭐️', '👾', '❌', '🚀']
        })
      } else if (winner === -1) {
        jsConfetti.addConfetti({
          emojis: ['🔮', '🪐', '🌕', '🫧']
      })} else {
        jsConfetti.addConfetti({
          emojis: ['🥴', '😐', '🫢'],
        })
      }
  } else {
    resetBtn.style.visibility = "hidden";
  }
}