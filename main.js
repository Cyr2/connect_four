let boardDiv;
const game = document.querySelector('#game');
let currentPlayer = 'red';
let isClickDisabled = false;
let interval;
let board = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
];

function firstEvent(){
  game.innerHTML = `<div class="menu">
      <img src="public/logo.svg" alt="logo">
      <button id="play">
          <p>PLAY VS PLAYER</p>
          <img src="public/player-vs-player.svg" alt="PvP">
      </button>
      <button id="rules">GAME RULES</button>
    </div>`
  document.querySelector('#play').addEventListener('click', start);
  document.querySelector('#rules').addEventListener('click', rules);
};

function start(){
    game.innerHTML = `<div class="player">
    <img src="public/player-one.svg" draggable="false" alt="Player one Logo">
    <h3>PLAYER 1</h3>
    <p id="playerRedScore">0</p>
  </div>
  <div class="gameBoard">
    <nav>
      <button id="menu">MENU</button>
      <img src="public/logo.svg" alt="">
      <button id="restart">RESTART</button>
    </nav>
    <img src="public/board-layer-white-large.svg" class="boardLayer" alt="">
    <div class="hover"><img id="markerRed" src="public/marker-red.svg" alt=""><img id="markerYellow" src="public/marker-yellow.svg" alt=""></div>
    <div id="board"></div>
    <img src="public/board-layer-black-large.svg" class="boardLayerBlack" alt="">
  </div>
  <div class="turn">
    <div class="containerContent">
      <div class="content" id="contentTimer">  
        <h3 id="playerTurn">Player 1's turn</h3>
        <p id="timer">30s</p>
      </div>
      <div class="content" id="contentRematch">  
          <h3 id="winner"></h3>
          <h1>WIN</h1>
          <button id="rematch">PLAY AGAIN</button>
        </div>
      <img src="public/turn-background-red.svg" id="turnRed" alt="Turn Red bg">
      <img src="public/turn-background-yellow.svg" id="turnYellow" alt="Turn Yellow bg">
    </div>
  </div>
  <div class="player">
    <img src="public/player-two.svg" draggable="false" alt="Player two Logo">
    <h3>PLAYER 2</h3>
    <p id="playerYellowScore">0</p>
  </div>`
  init();
};

function rules(){
  game.innerHTML = `<div class="rules">
  <h1>RULES</h1>
  <h2>OBJECTIVE</h2>
  <p>Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).</p>
  <h2>HOW TO PLAY</h2>
  <ol>
      <li><span>1</span><p>Red goes first in the first game.</p></li>
      <li><span>2</span><p>Players must alternate turns, and only one disc can be dropped in each turn.</p></li>
      <li><span>3</span><p>The game ends when there is a 4-in-a-row or a stalemate.</p></li>
  </ol>
  <button id="check"><img src="public/icon-check.svg" alt="check"></button>
  </div>`
  document.querySelector('#check').addEventListener('click', firstEvent)
};

// RENDERING & EVENT HANDLERS

function init() {
  boardDiv = document.querySelector('#board');
  clearInterval(interval);
  isClickDisabled = false;
  boardDiv.innerHTML = '';
  boardDiv.removeEventListener('click', clickHandler);

  document.querySelector('#contentTimer').style.display = "block";
  document.querySelector('#contentRematch').style.display = "none";
  document.querySelector('footer').style.backgroundColor = "#5C2DD5";
  document.querySelector('.hover').style.display = 'block';
  document.querySelector('#playerTurn').textContent = "Player 1's turn";
  document.querySelector('#turnRed').style.display = 'block';
  document.querySelector('#turnYellow').style.display = 'none';
  document.querySelector('#markerRed').style.display = 'block';
  document.querySelector('#markerYellow').style.display = 'none';

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (board[i][j] === 'red') {
        cell.classList.add('red');
      } else if (board[i][j] === 'yellow') {
        cell.classList.add('yellow');
      }
      cell.addEventListener('mouseover', highlightColumn);
      cell.addEventListener('mouseout', unhighlightColumn);
      boardDiv.appendChild(cell);
    }
  }
  timer();
  boardDiv.addEventListener('click', clickHandler);
  document.querySelector('#restart').addEventListener('click', restart);
  document.querySelector('#menu').addEventListener('click', ()=>{
    reset();
    setTimeout(firstEvent, 50);
  })
};

function render(){
  const cells = document.querySelectorAll('.cell');
  for(let i = 0; i < cells.length; i++){
    const cell = cells[i];
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    if(board[row][col] === 'red'){
      cell.classList.add('red');
    } else if(board[row][col] === 'yellow'){
      cell.classList.add('yellow');
    }
  }
};

function highlightColumn(e) {
  const hoverElement = document.querySelector('.hover');
  const col = e.target.dataset.col;
  const cells = document.querySelectorAll(`.cell[data-col='${col}']`);
  cells.forEach(cell => cell.classList.add('highlight'));
  hoverElement.style.left = `${e.target.offsetLeft}px`;
};

function unhighlightColumn(e) {
  const col = e.target.dataset.col;
  const cells = document.querySelectorAll(`.cell[data-col='${col}']`);
  cells.forEach(cell => cell.classList.remove('highlight'));
};

const clickHandler = (e) => {
  if (isClickDisabled) return;
  isClickDisabled = true;
  setTimeout(() => {
    isClickDisabled = false;
  }, 200);
  const cell = e.target;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  if (!isNaN(row) && !isNaN(col)) move(col);
};

// GAME LOGIC

function move(col){
  for(let i = board.length - 1; i >= 0; i--){
    if(board[i][col] === ''){
      board[i][col] = currentPlayer;
      render();
      if(checkVertical(col) || checkHorizontal(i) || checkDiagonal(i, col)) return;
      checkDraw();
      setTimeout(changePlayer, 50);
      break;
    }
  }
};

function changePlayer(){
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  const redImg = document.querySelector('#turnRed');
  const yellowImg = document.querySelector('#turnYellow');
  const redMarker = document.querySelector('#markerRed');
  const yellowMarker = document.querySelector('#markerYellow');
  document.querySelector('#playerTurn').textContent = currentPlayer === 'red' ? "Player 1's turn" : "Player 2's turn";
  if(currentPlayer === 'red'){
    redImg.style.display = 'block';
    yellowImg.style.display = 'none';
    redMarker.style.display = 'block';
    yellowMarker.style.display = 'none';
  } else {
    redImg.style.display = 'none';
    yellowImg.style.display = 'block';
    redMarker.style.display = 'none';
    yellowMarker.style.display = 'block';
  }
  clearInterval(interval);
  timer();
};

function checkVertical(col){
  let move = [];
  for(let i = 0; i < board.length; i++){
    if(board[i][col] === currentPlayer){
      move.push([i,col]);
      if(move.length === 4){
        win(currentPlayer, move);
        return true;
      }
    } else {
      move = [];
    }
  }
  return false;
};

function checkHorizontal(row){
  let move = [];
  for(let i = 0; i < board[row].length; i++){
    if(board[row][i] === currentPlayer){
      move.push([row,i]);
      if(move.length === 4){
        win(currentPlayer, move);
        return true;
      }
    } else {
      move = [];
    }
  }
  return false;
};

function checkDiagonal(row, col){
  let move = [];
  let i = row;
  let j = col;
  while(i < board.length && j < board[i].length){
    if(board[i][j] === currentPlayer){
      move.push([i,j]);
      if(move.length === 4){
        win(currentPlayer, move);
        return true;
      }
    } else {
      move = [];
    }
    i++;
    j++;
  }
  move = [];
  i = row;
  j = col;
  while(i >= 0 && j >= 0){
    if(board[i][j] === currentPlayer){
      move.push([i,j]);
      if(move.length === 4){
        win(currentPlayer, move);
        return true;
      }
    } else {
      move = [];
    }
    i--;
    j--;
  }
  move = [];
  i = row;
  j = col;
  while(i < board.length && j >= 0){
    if(board[i][j] === currentPlayer){
      move.push([i,j]);
      if(move.length === 4){
        win(currentPlayer, move);
        return true;
      }
    } else {
      move = [];
    }
    i++;
    j--;
  }
  move = [];
  i = row;
  j = col;
  while(i >= 0 && j < board[i].length){
    if(board[i][j] === currentPlayer){
      move.push([i,j]);
      if(move.length === 4){
        win(currentPlayer, move);
        return true;
      }
    } else {
      move = [];
    }
    i--;
    j++;
  }
  return false;
};

function checkDraw(){
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      if(board[i][j] === ''){
        return false;
      }
    }
  }
  setTimeout(() => {
    alert("It's a draw!");
  }, 50);
  reset();
};

function win(player, move){
  const playerWin = player.charAt(0).toUpperCase() + player.slice(1);
  setTimeout(() => {
    for(let i = 0; i<move.length; i++){
      const cell = document.querySelector(`[data-row="${move[i][0]}"][data-col="${move[i][1]}"]`)
      cell.classList.add('win');
    }
    isClickDisabled = true;
    const score = document.querySelector(`#player${playerWin}Score`);
    score.textContent = parseInt(score.textContent) + 1;

    document.querySelector('#winner').textContent = playerWin;
    document.querySelector('.hover').style.display = 'none';
    document.querySelector('#contentTimer').style.display = "none";
    document.querySelector('#contentRematch').style.display = "block";
    document.querySelector('footer').style.backgroundColor = player === "red" ? "#FD6687" : "#FFCE67";
    document.querySelector('#rematch').addEventListener('click', reset);
  }, 250);
};

function reset(timer){
  board = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
  ];
  currentPlayer = 'red';
  render();
  setTimeout(() => {
    init();
  }, timer ? timer : 0);
};

function restart(){
  if(confirm("Are you sure you want to restart the game?")) {
    const player1Score = document.querySelector('#playerRedScore');
    const player2Score = document.querySelector('#playerYellowScore');
    let player1ScoreInt = parseInt(player1Score.textContent);
    let player2ScoreInt = parseInt(player2Score.textContent);
    setTimeout(() => {
      alert(`Game restarted, ${player1ScoreInt > player2ScoreInt ? "Player 1" : player1ScoreInt < player2ScoreInt ? "Player 2" : "No one"} win!`);
      player1Score.textContent = 0;
      player2Score.textContent = 0;
    }, 100);
    reset();
  }
};

function timer(){
  let time = 30;
  const timer = document.querySelector('#timer');
  timer.textContent = time + "s";
  interval = setInterval(() => {
    time--;
    timer.textContent = time + "s";
    if(time === 0){
      clearInterval(interval);
      move(Math.floor(Math.random() * 7))
    }
  }, 1000);
};

firstEvent();