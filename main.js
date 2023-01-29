//STATE VARIABLES

const PLAYERS = {
  '0': {
    color: "color: 'rgba(255, 255, 255, 0)',",
    name: null
  },
  '1': {
    color: "var(--player-x-color)",
    name: "X"
  },
  '-1': {
    color: "var(--player-o-color)",
    name: "O"
  }
}

let board;
let playerTurn = 1;
let winner;

// CACHED ELEMENTS
const resetBtn = document.getElementById("reset-btn");
resetBtn.style.visibility = "hidden";


// EVENT LISTENERS

// FUNCTIONS

// --> INITIALIZE
function init() {
  board = [
    [0,0,0], //col 0
    [0,0,0], //col 1
    [0,0,0], //col 2
  ];

  playerTurn;
  winner = null;
  render();
};

//handles data change / interaction of click event
function handleMove(evt) {

}

// --> RENDER
function render() {
  renderBoard();
  renderMessage();
  renderControls();
}

function renderBoard() {

}

function renderMessage() {

}

function renderControls() {

}