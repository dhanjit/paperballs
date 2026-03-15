/**
 * Test if games are actually winnable with different configurations
 */

const { runSimulations } = require('./simulate-advantage');

console.log('Testing game winnability...\n');

// Test 1: 3×3 grid (should finish quickly)
console.log('TEST 1: 3×3 Grid');
runSimulations({
    gridSize: 3,
    diagonalMode: 'short',
    winLineLength: null, // 3-in-a-row
    difficulty: 'easy',
    numGames: 50
});

// Test 2: 5×5 with 3-in-a-row (easier win condition)
console.log('\nTEST 2: 5×5 with 3-in-a-row');
runSimulations({
    gridSize: 5,
    diagonalMode: 'short',
    winLineLength: 3,
    difficulty: 'easy',
    numGames: 50
});

// Test 3: 5×5 with 4-in-a-row (medium difficulty)
console.log('\nTEST 3: 5×5 with 4-in-a-row');
runSimulations({
    gridSize: 5,
    diagonalMode: 'short',
    winLineLength: 4,
    difficulty: 'easy',
    numGames: 50
});
