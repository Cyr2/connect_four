const boardDiv = document.querySelector('#board');
let currentPlayer = 'red';
let board = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
];

init();

function init(){
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
      boardDiv.appendChild(cell);
    }
  }

  boardDiv.addEventListener('click', function(e){
    const cell = e.target;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if(!isNaN(row) && !isNaN(col)) move(col);
  });
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

function move(col){
  for(let i = board.length - 1; i >= 0; i--){
    if(board[i][col] === ''){
      board[i][col] = currentPlayer;
      render();
      if(checkVertical(col) || checkHorizontal(i) || checkDiagonal(i, col)){
        alert(currentPlayer + ' wins!');
        return;
      }
      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      break;
    }
  }
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