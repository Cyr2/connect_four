const boardDiv = document.querySelector('#board');
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


// RENDERING & EVENT HANDLERS

function init(){
  clearInterval(interval);
  boardDiv.innerHTML = '';
  boardDiv.removeEventListener('click', clickHandler);

  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      if(board[i][j] === 'red'){
        cell.classList.add('red');
      } else if(board[i][j] === 'yellow'){
        cell.classList.add('yellow');
      }
      cell.addEventListener('mouseover', highlightColumn);
      cell.addEventListener('mouseout', unhighlightColumn);
      boardDiv.appendChild(cell);
    }
  }
  timer();
  boardDiv.addEventListener('click', clickHandler);
}

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
}

function highlightColumn(e) {
  const hoverElement = document.querySelector('.hover');
  const col = e.target.dataset.col;
  const cells = document.querySelectorAll(`.cell[data-col='${col}']`);
  cells.forEach(cell => cell.classList.add('highlight'));
  hoverElement.style.left = `${e.target.offsetLeft}px`;
}

function unhighlightColumn(e) {
  const col = e.target.dataset.col;
  const cells = document.querySelectorAll(`.cell[data-col='${col}']`);
  cells.forEach(cell => cell.classList.remove('highlight'));
}

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

document.querySelector('#restart').addEventListener('click', restart);


// GAME LOGIC

function move(col){
  for(let i = board.length - 1; i >= 0; i--){
    if(board[i][col] === ''){
      board[i][col] = currentPlayer;
      render();
      if(checkVertical(col) || checkHorizontal(i) || checkDiagonal(i, col)){
        win(currentPlayer);
        return;
      } else {
        checkDraw();
      }
      setTimeout(changePlayer, 200);
      break;
    }
  }
}

function changePlayer(){
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  const redImg = document.querySelector('#turnRed');
  const yellowImg = document.querySelector('#turnYellow');
  const redMarker = document.querySelector('#markerRed');
  const yellowMarker = document.querySelector('#markerYellow');
  document.querySelector('#playerTurn').textContent = currentPlayer === 'red' ? "PLAYER 1 TURN" : "PLAYER 2 TURN";
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
}

function checkVertical(col){
  let count = 0;
  for(let i = 0; i < board.length; i++){
    if(board[i][col] === currentPlayer){
      count++;
      if(count === 4){
        return true;
      }
    } else {
      count = 0;
    }
  }
  return false;
}

function checkHorizontal(row){
  let count = 0;
  for(let i = 0; i < board[row].length; i++){
    if(board[row][i] === currentPlayer){
      count++;
      if(count === 4){
        return true;
      }
    } else {
      count = 0;
    }
  }
  return false;
}

function checkDiagonal(row, col){
  let count = 0;
  let i = row;
  let j = col;
  while(i < board.length && j < board[i].length){
    if(board[i][j] === currentPlayer){
      count++;
      if(count === 4){
        return true;
      }
    } else {
      count = 0;
    }
    i++;
    j++;
  }
  count = 0;
  i = row;
  j = col;
  while(i >= 0 && j >= 0){
    if(board[i][j] === currentPlayer){
      count++;
      if(count === 4){
        return true;
      }
    } else {
      count = 0;
    }
    i--;
    j--;
  }
  count = 0;
  i = row;
  j = col;
  while(i < board.length && j >= 0){
    if(board[i][j] === currentPlayer){
      count++;
      if(count === 4){
        return true;
      }
    } else {
      count = 0;
    }
    i++;
    j--;
  }
  count = 0;
  i = row;
  j = col;
  while(i >= 0 && j < board[i].length){
    if(board[i][j] === currentPlayer){
      count++;
      if(count === 4){
        return true;
      }
    } else {
      count = 0;
    }
    i--;
    j++;
  }
  return false;
}

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
  }, 100);
  reset();
}

function win(player){
  const playerWin = player.charAt(0).toUpperCase() + player.slice(1);
  setTimeout(() => {
    alert(`${playerWin} win!`);
  }, 800);
  const score = document.querySelector(`#player${playerWin}Score`);
  score.textContent = parseInt(score.textContent) + 1;
  reset(1000);
}

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
  setTimeout(() => {
    init();
  }, timer ? timer : 0);
}

function restart(){
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
}




init();