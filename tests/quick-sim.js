/**
 * Quick Simulation - Fast first-player advantage test
 */

const { runSimulations } = require('./simulate-advantage');

console.log('Running QUICK simulations with easy AI...\n');

// Quick test with easy AI (depth 2)
runSimulations({
    gridSize: 5,
    diagonalMode: 'short',
    winLineLength: null,
    difficulty: 'easy', // Fast AI
    numGames: 100
});
