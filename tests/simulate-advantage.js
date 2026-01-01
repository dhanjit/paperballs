/**
 * Simulation Script: Measure First-Player Advantage
 *
 * Runs AI vs AI games to determine if Player 1 has a statistical advantage
 */

const PaperballsGame = require('../web/js/game');
const PaperballsAI = require('../web/js/ai');

/**
 * Run a single game simulation
 */
function simulateGame(gridSize, diagonalMode, winLineLength, difficulty) {
    const game = new PaperballsGame(gridSize, diagonalMode, winLineLength);
    const ai1 = new PaperballsAI(difficulty); // Player 1
    const ai2 = new PaperballsAI(difficulty); // Player 2

    // Override AI player IDs since both are playing as AI
    ai1.aiPlayer = 1;
    ai1.opponent = 2;
    ai2.aiPlayer = 2;
    ai2.opponent = 1;

    let moveCount = 0;
    const maxMoves = 1000; // Prevent infinite loops

    while (!game.winner && moveCount < maxMoves) {
        const currentAI = game.currentPlayer === 1 ? ai1 : ai2;
        const state = game.getState();

        if (state.phase === 'placement') {
            // Get AI placement move
            const move = currentAI.getMove(state);
            if (!move || move.type !== 'place') {
                console.error('Invalid placement move', move);
                return null;
            }

            const result = game.placeBall(move.row, move.col);
            if (!result.success) {
                console.error('Placement failed:', result.error);
                return null;
            }

            game.switchPlayer();

        } else if (state.phase === 'movement') {
            // Check if current player has any valid moves
            if (!game.hasValidMoves(game.currentPlayer)) {
                // Current player has no moves - they lose
                game.winner = game.currentPlayer === 1 ? 2 : 1;
                break;
            }

            // Get AI movement move
            const move = currentAI.getMove(state);
            if (!move || move.type !== 'move') {
                console.error('Invalid movement move', move);
                return null;
            }

            const selectResult = game.selectBall(move.fromRow, move.fromCol);
            if (!selectResult.success) {
                console.error('Select ball failed:', selectResult.error);
                return null;
            }

            const moveResult = game.moveBall(move.toRow, move.toCol);
            if (!moveResult.success) {
                console.error('Move ball failed:', moveResult.error);
                return null;
            }

            // Check for winner
            const winner = game.checkWinner();
            if (winner) {
                game.winner = winner;
                break;
            }

            game.switchPlayer();
        }

        moveCount++;
    }

    if (moveCount >= maxMoves) {
        return { winner: 'draw', moves: moveCount };
    }

    return { winner: game.winner, moves: moveCount };
}

/**
 * Run multiple simulations and collect statistics
 */
function runSimulations(config) {
    const {
        gridSize = 5,
        diagonalMode = 'short',
        winLineLength = null,
        difficulty = 'medium',
        numGames = 100
    } = config;

    console.log('\n' + '='.repeat(60));
    console.log('FIRST-PLAYER ADVANTAGE SIMULATION');
    console.log('='.repeat(60));
    console.log(`Configuration:`);
    console.log(`  Grid Size: ${gridSize}×${gridSize}`);
    console.log(`  Diagonal Mode: ${diagonalMode}`);
    console.log(`  Win Condition: ${winLineLength || gridSize}-in-a-row`);
    console.log(`  AI Difficulty: ${difficulty}`);
    console.log(`  Number of Games: ${numGames}`);
    console.log('='.repeat(60));
    console.log();

    const results = {
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
        totalMoves: 0,
        errors: 0
    };

    const startTime = Date.now();

    for (let i = 0; i < numGames; i++) {
        if ((i + 1) % 10 === 0) {
            process.stdout.write(`\rProgress: ${i + 1}/${numGames} games completed...`);
        }

        const result = simulateGame(gridSize, diagonalMode, winLineLength, difficulty);

        if (!result) {
            results.errors++;
            continue;
        }

        if (result.winner === 1) {
            results.player1Wins++;
        } else if (result.winner === 2) {
            results.player2Wins++;
        } else {
            results.draws++;
        }

        results.totalMoves += result.moves;
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\rProgress: ${numGames}/${numGames} games completed!`);
    console.log();

    // Calculate statistics
    const validGames = numGames - results.errors;
    const player1WinRate = (results.player1Wins / validGames * 100).toFixed(2);
    const player2WinRate = (results.player2Wins / validGames * 100).toFixed(2);
    const drawRate = (results.draws / validGames * 100).toFixed(2);
    const avgMoves = (results.totalMoves / validGames).toFixed(1);

    // Display results
    console.log('='.repeat(60));
    console.log('RESULTS');
    console.log('='.repeat(60));
    console.log(`Valid Games: ${validGames}`);
    console.log(`Errors: ${results.errors}`);
    console.log(`Duration: ${duration}s`);
    console.log();
    console.log(`Player 1 Wins: ${results.player1Wins} (${player1WinRate}%)`);
    console.log(`Player 2 Wins: ${results.player2Wins} (${player2WinRate}%)`);
    console.log(`Draws: ${results.draws} (${drawRate}%)`);
    console.log(`Average Moves per Game: ${avgMoves}`);
    console.log();

    // Analysis
    console.log('='.repeat(60));
    console.log('ANALYSIS');
    console.log('='.repeat(60));

    const advantage = Math.abs(player1WinRate - player2WinRate);

    if (advantage < 5) {
        console.log('✅ BALANCED - No significant first-player advantage detected');
        console.log(`   Advantage: ${advantage.toFixed(2)}% (acceptable range: <5%)`);
        console.log('   Recommendation: Pie Rule NOT needed');
    } else if (advantage < 10) {
        console.log('⚠️  SLIGHT ADVANTAGE detected');
        console.log(`   Advantage: ${advantage.toFixed(2)}%`);
        console.log('   Recommendation: Pie Rule optional, or try simpler fixes first');
    } else {
        console.log('❌ SIGNIFICANT ADVANTAGE detected');
        console.log(`   Advantage: ${advantage.toFixed(2)}%`);
        console.log('   Recommendation: Pie Rule strongly recommended');
    }

    if (player1WinRate > player2WinRate) {
        console.log(`   Winner: Player 1 (first player)`);
    } else {
        console.log(`   Winner: Player 2 (second player)`);
    }

    console.log('='.repeat(60));
    console.log();

    return results;
}

// Run simulations with different configurations
async function main() {
    console.log('Starting simulations...\n');

    // Test 1: Standard 5×5 game (Classic configuration)
    console.log('TEST 1: Standard Configuration');
    runSimulations({
        gridSize: 5,
        diagonalMode: 'short',
        winLineLength: null, // N-in-a-row
        difficulty: 'medium',
        numGames: 200
    });

    // Test 2: 3×3 small grid (Quick games)
    console.log('\nTEST 2: Small Grid (3×3)');
    runSimulations({
        gridSize: 3,
        diagonalMode: 'short',
        winLineLength: null,
        difficulty: 'medium',
        numGames: 200
    });

    // Test 3: 5×5 with 3-in-a-row (Easier win condition)
    console.log('\nTEST 3: 5×5 with 3-in-a-row');
    runSimulations({
        gridSize: 5,
        diagonalMode: 'short',
        winLineLength: 3,
        difficulty: 'medium',
        numGames: 200
    });

    // Test 4: 7×7 large grid
    console.log('\nTEST 4: Large Grid (7×7)');
    runSimulations({
        gridSize: 7,
        diagonalMode: 'short',
        winLineLength: null,
        difficulty: 'medium',
        numGames: 100 // Fewer games as they take longer
    });
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { simulateGame, runSimulations };
