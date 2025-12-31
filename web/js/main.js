/**
 * Paperballs - Main Application
 */

let game = null;
let ui = null;
let aiPlayer = null;  // AI opponent instance
let gameMode = 'pvp'; // Current game mode: 'pvp' or 'pvai'

/**
 * Initialize a new game
 */
function initGame() {
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const diagonalMode = document.getElementById('diagonalMode').value;
    gameMode = document.getElementById('gameMode').value;

    game = new PaperballsGame(gridSize, diagonalMode);
    ui = new PaperballsUI(game);

    // Initialize AI if needed
    if (gameMode === 'pvai') {
        const difficulty = document.getElementById('aiDifficulty').value;
        aiPlayer = new PaperballsAI(difficulty);
    } else {
        aiPlayer = null;
    }

    // Show game sections
    document.getElementById('gameInfo').style.display = 'block';
    document.getElementById('gameBoard').style.display = 'block';
    document.getElementById('gameControls').style.display = 'block';

    // Initial render
    ui.refresh();

    // Add click handler to SVG
    setupBoardClickHandler();
}

/**
 * Setup click handler for the game board
 */
function setupBoardClickHandler() {
    const svg = document.getElementById('gameSvg');

    svg.addEventListener('click', (event) => {
        // Prevent clicks during AI turn
        if (game.currentPlayer === 2 && aiPlayer !== null) {
            return;
        }

        // Find the clicked vertex
        let target = event.target;
        while (target && target.tagName !== 'g') {
            target = target.parentElement;
        }

        if (!target || !target.classList.contains('vertex')) {
            return;
        }

        const row = parseInt(target.getAttribute('data-row'));
        const col = parseInt(target.getAttribute('data-col'));

        handleVertexClick(row, col);
    });
}

/**
 * Handle click on a vertex
 */
function handleVertexClick(row, col) {
    const state = game.getState();

    if (state.phase === 'placement') {
        handlePlacementClick(row, col);
    } else if (state.phase === 'movement') {
        handleMovementClick(row, col);
    }
}

/**
 * Handle click during placement phase
 */
function handlePlacementClick(row, col) {
    const result = game.placeBall(row, col);

    if (result.success) {
        game.switchPlayer();
        ui.refresh();

        // Check if AI should play
        if (shouldTriggerAI()) {
            executeAITurn();
        }
    } else {
        showMessage(result.error);
    }
}

/**
 * Handle click during movement phase
 */
function handleMovementClick(row, col) {
    const state = game.getState();
    const cellPlayer = state.grid[row][col];

    // If clicking on current player's ball
    if (cellPlayer === state.currentPlayer) {
        // If same ball is already selected, deselect it
        if (state.selectedBall &&
            state.selectedBall.row === row &&
            state.selectedBall.col === col) {
            game.cancelSelection();
            ui.refresh();
        } else {
            // Select this ball
            const result = game.selectBall(row, col);
            if (result.success) {
                ui.refresh();
            } else {
                showMessage(result.error);
            }
        }
    }
    // If clicking on empty cell and a ball is selected
    else if (state.selectedBall && cellPlayer === null) {
        const result = game.moveBall(row, col);

        if (result.success) {
            // Check for winner
            const winner = game.checkWinner();
            if (winner) {
                game.winner = winner;
                ui.refresh();
                setTimeout(() => ui.showWinner(winner), 300);
            } else {
                game.switchPlayer();
                ui.refresh();

                // Check if AI should play
                if (shouldTriggerAI()) {
                    executeAITurn();
                }
            }
        } else {
            showMessage(result.error);
        }
    }
}

/**
 * Check if AI should make a move
 */
function shouldTriggerAI() {
    return gameMode === 'pvai' &&
           game.currentPlayer === 2 &&
           !game.winner &&
           aiPlayer !== null;
}

/**
 * Execute AI turn
 */
function executeAITurn() {
    // Disable board interaction
    const svg = document.getElementById('gameSvg');
    svg.style.pointerEvents = 'none';

    // Update UI to show AI thinking
    const instruction = document.getElementById('instructionDisplay');
    const originalInstruction = instruction.textContent;
    instruction.textContent = '🤖 AI is thinking...';

    // Get AI decision
    const state = game.getState();
    const move = aiPlayer.getMove(state);

    // Execute move after delay (for UX)
    setTimeout(() => {
        if (move.type === 'place') {
            const result = game.placeBall(move.row, move.col);
            if (result.success) {
                game.switchPlayer();
                ui.refresh();

                // Re-enable board for human player
                svg.style.pointerEvents = 'auto';
            }
        } else if (move.type === 'move') {
            game.selectBall(move.fromRow, move.fromCol);
            const result = game.moveBall(move.toRow, move.toCol);
            if (result.success) {
                const winner = game.checkWinner();
                if (winner) {
                    game.winner = winner;
                    ui.refresh();
                    setTimeout(() => ui.showWinner(winner), 300);
                } else {
                    game.switchPlayer();
                    ui.refresh();

                    // Re-enable board
                    svg.style.pointerEvents = 'auto';
                }
            }
        }
    }, 500); // 500ms delay for UX
}

/**
 * Show a temporary message
 */
function showMessage(message) {
    const instruction = document.getElementById('instructionDisplay');
    const originalText = instruction.textContent;

    instruction.textContent = '⚠️ ' + message;
    instruction.style.color = '#e74c3c';

    setTimeout(() => {
        instruction.textContent = originalText;
        instruction.style.color = '';
    }, 2000);
}

/**
 * Reset the current game
 */
function resetGame() {
    if (confirm('Are you sure you want to reset the current game?')) {
        initGame();
    }
}

/**
 * Start a new game (return to setup)
 */
function newGame() {
    if (confirm('Are you sure you want to start a new game?')) {
        document.getElementById('gameInfo').style.display = 'none';
        document.getElementById('gameBoard').style.display = 'none';
        document.getElementById('gameControls').style.display = 'none';

        game = null;
        ui = null;
        aiPlayer = null;
        gameMode = 'pvp';
    }
}

/**
 * Initialize event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Start game button
    document.getElementById('startGame').addEventListener('click', initGame);

    // New game button
    document.getElementById('newGame').addEventListener('click', newGame);

    // Reset game button
    document.getElementById('resetGame').addEventListener('click', resetGame);
});
