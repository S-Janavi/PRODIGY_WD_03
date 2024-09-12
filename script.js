const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const playerTurnElement = document.getElementById('player-turn');
const restartButton = document.getElementById('restartButton');
const playAIButton = document.getElementById('playAI');
const winnerMessageElement = document.getElementById('winner-message');
const winnerTextElement = document.getElementById('winner-text');
const newGameButton = document.getElementById('newGameButton');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let aiEnabled = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Handle click on each cell
cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

// Restart the game
restartButton.addEventListener('click', restartGame);
newGameButton.addEventListener('click', restartGame);

playAIButton.addEventListener('change', function() {
    aiEnabled = playAIButton.checked;
});

function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== '' || !gameActive) return;

    placeMark(cell, currentPlayer);
    updateGameState(cellIndex, currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchTurn();
        if (aiEnabled && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        }
    }
}

function placeMark(cell, player) {
    cell.textContent = player;
    cell.classList.add('active');
}

function updateGameState(index, player) {
    gameState[index] = player;
}

function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerTurnElement.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === player;
        });
    });
}

function isDraw() {
    return gameState.every(cell => cell !== '');
}

function endGame(draw) {
    gameActive = false;
    winnerMessageElement.classList.add('show');

    if (draw) {
        winnerTextElement.textContent = 'It\'s a Draw!';
    } else {
        winnerTextElement.textContent = `Player ${currentPlayer} Wins!`;
        highlightWinningCells();
    }
}

function highlightWinningCells() {
    const winningCombo = winningCombinations.find(combination => {
        return combination.every(index => gameState[index] === currentPlayer);
    });
    if (winningCombo) {
        winningCombo.forEach(index => {
            cells[index].classList.add('winning');
        });
    }
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    winnerMessageElement.classList.remove('show');
    playerTurnElement.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('active', 'winning');
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function aiMove() {
    let emptyCells = [];
    gameState.forEach((cell, index) => {
        if (cell === '') emptyCells.push(index);
    });

    const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(cells[randomCellIndex], 'O');
    updateGameState(randomCellIndex, 'O');

    if (checkWin('O')) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchTurn();
    }
}
