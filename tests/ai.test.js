/**
 * Paperballs AI Tests
 *
 * Tests for the AI opponent using Minimax algorithm
 */

const PaperballsGame = require('../web/js/game');
const PaperballsAI = require('../web/js/ai');

describe('PaperballsAI', () => {
    let game;
    let ai;

    beforeEach(() => {
        game = new PaperballsGame(3, 'short');  // Use 3x3 for faster tests
        ai = new PaperballsAI('medium');  // Use medium difficulty for faster tests
    });

    describe('AI Initialization', () => {
        test('initializes with correct difficulty', () => {
            const easyAI = new PaperballsAI('easy');
            const mediumAI = new PaperballsAI('medium');
            const hardAI = new PaperballsAI('hard');

            expect(easyAI.difficulty).toBe('easy');
            expect(mediumAI.difficulty).toBe('medium');
            expect(hardAI.difficulty).toBe('hard');
        });

        test.each([
            ['easy', 2],
            ['medium', 4],
            ['hard', 6]
        ])('difficulty %s uses depth %i', (difficulty, expectedDepth) => {
            const testAI = new PaperballsAI(difficulty);
            expect(testAI.maxDepth).toBe(expectedDepth);
        });

        test('sets correct player IDs', () => {
            expect(ai.aiPlayer).toBe(2);
            expect(ai.opponent).toBe(1);
        });
    });

    describe('Move Generation - Placement Phase', () => {
        test('returns valid placement move', () => {
            const move = ai.getMove(game.getState());

            expect(move).toBeDefined();
            expect(move.type).toBe('place');
            expect(move.row).toBeGreaterThanOrEqual(0);
            expect(move.row).toBeLessThan(3);
            expect(move.col).toBeGreaterThanOrEqual(0);
            expect(move.col).toBeLessThan(3);
        });

        test('placement moves are valid and executable', () => {
            for (let i = 0; i < 3; i++) {  // 3 balls per player for 3x3
                const state = game.getState();
                const move = ai.getMove(state);

                expect(move.type).toBe('place');
                expect(state.grid[move.row][move.col]).toBe(null);

                const result = game.placeBall(move.row, move.col);
                expect(result.success).toBe(true);
                game.switchPlayer();
            }
        });

        test('detects winning placement opportunity', () => {
            // Setup: AI (Player 2) has 2 balls in a row with empty 3rd spot
            // Row 0: [null, 2, 2]
            game.grid[0][1] = 2;
            game.grid[0][2] = 2;
            game.ballsPlaced[2] = 2;
            game.currentPlayer = 2;

            const move = ai.getMove(game.getState());

            expect(move.type).toBe('place');
            // AI should complete the winning row
            expect(move.row).toBe(0);
            expect(move.col).toBe(0);
        });

        test('blocks opponent winning placement', () => {
            // Setup: Opponent (Player 1) has 2 balls in a row with empty 3rd spot
            // Row 0: [null, 1, 1]
            game.grid[0][1] = 1;
            game.grid[0][2] = 1;
            game.ballsPlaced[1] = 2;
            game.currentPlayer = 2;

            const move = ai.getMove(game.getState());

            expect(move.type).toBe('place');
            // AI should block the winning spot
            expect(move.row).toBe(0);
            expect(move.col).toBe(0);
        });
    });

    describe('Move Generation - Movement Phase', () => {
        beforeEach(() => {
            // Setup complete placement phase with 3x3 grid
            game.phase = 'movement';
            game.grid = [
                [1, null, 2],
                [null, 1, null],
                [2, null, 1]
            ];
            game.ballsPlaced = { 1: 3, 2: 3 };
            game.ballsPerPlayer = 3;
            game.currentPlayer = 2;
        });

        test('returns valid movement move', () => {
            const move = ai.getMove(game.getState());

            expect(move).toBeDefined();
            expect(move.type).toBe('move');
            expect(move.fromRow).toBeGreaterThanOrEqual(0);
            expect(move.fromRow).toBeLessThan(3);
            expect(move.fromCol).toBeGreaterThanOrEqual(0);
            expect(move.fromCol).toBeLessThan(3);
            expect(move.toRow).toBeGreaterThanOrEqual(0);
            expect(move.toRow).toBeLessThan(3);
            expect(move.toCol).toBeGreaterThanOrEqual(0);
            expect(move.toCol).toBeLessThan(3);
        });

        test('movement moves are valid and executable', () => {
            for (let i = 0; i < 3; i++) {
                const state = game.getState();
                const move = ai.getMove(state);

                expect(move.type).toBe('move');
                expect(state.grid[move.fromRow][move.fromCol]).toBe(2);
                expect(state.grid[move.toRow][move.toCol]).toBe(null);

                game.selectBall(move.fromRow, move.fromCol);
                const result = game.moveBall(move.toRow, move.toCol);
                expect(result.success).toBe(true);
                game.switchPlayer();

                // Opponent makes a dummy move to continue
                game.currentPlayer = 1;
                const opponentBall = findPlayerBall(game.grid, 1);
                if (opponentBall) {
                    const validMove = findValidMove(game, opponentBall.row, opponentBall.col);
                    if (validMove) {
                        game.selectBall(opponentBall.row, opponentBall.col);
                        game.moveBall(validMove.row, validMove.col);
                    }
                }
                game.currentPlayer = 2;
            }
        });

        test('detects winning movement opportunity', () => {
            // Setup: AI can move to complete winning horizontal line
            // Row 0: [2, 2, null], AI has ball at [0,1] that can move to [0,2]
            // Or ball at [1,2] can move to [0,2]
            game.grid = [
                [2, 2, null],
                [null, null, 2],
                [null, null, null]
            ];
            game.phase = 'movement';
            game.currentPlayer = 2;

            const move = ai.getMove(game.getState());

            expect(move.type).toBe('move');
            // AI should move to [0,2] to complete top row
            expect(move.toRow).toBe(0);
            expect(move.toCol).toBe(2);
        });
    });

    describe('Evaluation Function', () => {
        test('evaluates winning position for AI very highly', () => {
            // Setup: AI has winning line (3x3)
            game.grid = [
                [2, 2, 2],
                [null, null, null],
                [null, null, null]
            ];

            const score = ai.evaluate(game.getState());
            expect(score).toBeGreaterThan(900000);
        });

        test('evaluates losing position very negatively', () => {
            // Setup: Opponent has winning line (3x3)
            game.grid = [
                [1, 1, 1],
                [null, null, null],
                [null, null, null]
            ];

            const score = ai.evaluate(game.getState());
            expect(score).toBeLessThan(-900000);
        });

        test('evaluates near-win position highly', () => {
            // Setup: AI has 2 in a row with 1 empty (3x3)
            game.grid = [
                [null, 2, 2],
                [null, null, null],
                [null, null, null]
            ];

            const score = ai.evaluate(game.getState());
            expect(score).toBeGreaterThan(40000);
        });

        test('evaluates center positions favorably', () => {
            // AI ball in center should score higher than edge (3x3)
            const centerGrid = [
                [null, null, null],
                [null, 2, null],
                [null, null, null]
            ];

            const edgeGrid = [
                [2, null, null],
                [null, null, null],
                [null, null, null]
            ];

            game.grid = centerGrid;
            const centerScore = ai.evaluate(game.getState());

            game.grid = edgeGrid;
            const edgeScore = ai.evaluate(game.getState());

            expect(centerScore).toBeGreaterThan(edgeScore);
        });
    });

    describe('Adjacent Positions', () => {
        test.each([
            ['short', 8],  // 4 orthogonal + 4 short diagonal
            ['all', 8]  // For 3x3 grid from center, all adjacent cells are already covered by short diagonals
        ])('diagonal mode %s returns correct adjacency count from center', (mode, expectedCount) => {
            const testGame = new PaperballsGame(3, mode);
            const testAI = new PaperballsAI('medium');

            const adjacent = testAI.getAdjacentPositions(testGame.getState(), 1, 1);
            expect(adjacent.length).toBe(expectedCount);
        });

        test('diagonal mode none returns only orthogonal from center', () => {
            const testGame = new PaperballsGame(3, 'none');
            const testAI = new PaperballsAI('medium');

            const adjacent = testAI.getAdjacentPositions(testGame.getState(), 1, 1);
            expect(adjacent.length).toBe(4);  // Only orthogonal directions
        });

        test('respects grid boundaries', () => {
            const adjacent = ai.getAdjacentPositions(game.getState(), 0, 0);

            // All positions should be within grid
            for (const [row, col] of adjacent) {
                expect(row).toBeGreaterThanOrEqual(0);
                expect(row).toBeLessThan(3);
                expect(col).toBeGreaterThanOrEqual(0);
                expect(col).toBeLessThan(3);
            }
        });
    });

    describe('Game State Simulation', () => {
        test('clones game state without mutating original', () => {
            const originalState = game.getState();
            const originalGrid = JSON.stringify(originalState.grid);

            const cloned = ai.cloneGameState(originalState);
            cloned.grid[0][0] = 2;

            expect(JSON.stringify(originalState.grid)).toBe(originalGrid);
            expect(originalState.grid[0][0]).toBe(null);
        });

        test('simulates placement correctly', () => {
            const originalState = game.getState();
            const simulated = ai.simulatePlacement(originalState, 2, 2, 2);

            expect(originalState.grid[2][2]).toBe(null);
            expect(simulated.grid[2][2]).toBe(2);
            expect(simulated.ballsPlaced[2]).toBe(originalState.ballsPlaced[2] + 1);
        });

        test('simulates movement correctly', () => {
            game.grid[0][0] = 2;
            const originalState = game.getState();

            const simulated = ai.simulateMovement(originalState, 0, 0, 0, 1);

            expect(originalState.grid[0][0]).toBe(2);
            expect(originalState.grid[0][1]).toBe(null);
            expect(simulated.grid[0][0]).toBe(null);
            expect(simulated.grid[0][1]).toBe(2);
        });
    });

    describe('Win Detection', () => {
        test('detects horizontal win', () => {
            game.grid = [
                [2, 2, 2],
                [null, null, null],
                [null, null, null]
            ];

            const winner = ai.checkWinnerFromState(game.getState());
            expect(winner).toBe(2);
        });

        test('detects vertical win', () => {
            game.grid = [
                [1, null, null],
                [1, null, null],
                [1, null, null]
            ];

            const winner = ai.checkWinnerFromState(game.getState());
            expect(winner).toBe(1);
        });

        test('detects diagonal win', () => {
            game.grid = [
                [2, null, null],
                [null, 2, null],
                [null, null, 2]
            ];

            const winner = ai.checkWinnerFromState(game.getState());
            expect(winner).toBe(2);
        });

        test('returns null when no winner', () => {
            game.grid = [
                [1, 2, null],
                [null, 1, null],
                [null, null, 2]
            ];

            const winner = ai.checkWinnerFromState(game.getState());
            expect(winner).toBe(null);
        });
    });

    describe('Integration Tests', () => {
        test('AI completes full placement phase without errors', () => {
            for (let i = 0; i < 3; i++) {  // 3 balls per player for 3x3
                // Human player
                game.currentPlayer = 1;
                const humanMove = findEmptyCell(game.grid);
                game.placeBall(humanMove.row, humanMove.col);
                game.switchPlayer();

                // AI player
                const aiMove = ai.getMove(game.getState());
                expect(aiMove.type).toBe('place');
                const result = game.placeBall(aiMove.row, aiMove.col);
                expect(result.success).toBe(true);
                game.switchPlayer();
            }

            expect(game.phase).toBe('movement');
        });

        test('AI plays movement phase without invalid moves', () => {
            // Complete placement phase
            for (let i = 0; i < 3; i++) {  // 3 balls per player for 3x3
                game.currentPlayer = 1;
                const humanMove = findEmptyCell(game.grid);
                game.placeBall(humanMove.row, humanMove.col);
                game.switchPlayer();

                const aiMove = ai.getMove(game.getState());
                game.placeBall(aiMove.row, aiMove.col);
                game.switchPlayer();
            }

            expect(game.phase).toBe('movement');

            // Test that AI makes 3 valid moves in movement phase
            for (let i = 0; i < 3; i++) {
                // Player 1 makes a simple valid move
                game.currentPlayer = 1;
                const player1Ball = findPlayerBall(game.grid, 1);
                if (player1Ball) {
                    const validMove = findValidMove(game, player1Ball.row, player1Ball.col);
                    if (validMove) {
                        game.selectBall(player1Ball.row, player1Ball.col);
                        game.moveBall(validMove.row, validMove.col);
                    }
                }

                if (game.checkWinner()) break;
                game.switchPlayer();

                // AI makes its move
                const aiMove = ai.getMove(game.getState());
                expect(aiMove.type).toBe('move');
                expect(aiMove).toHaveProperty('fromRow');
                expect(aiMove).toHaveProperty('fromCol');
                expect(aiMove).toHaveProperty('toRow');
                expect(aiMove).toHaveProperty('toCol');

                game.selectBall(aiMove.fromRow, aiMove.fromCol);
                const result = game.moveBall(aiMove.toRow, aiMove.toCol);
                expect(result.success).toBe(true);

                if (game.checkWinner()) break;
                game.switchPlayer();
            }
        });
    });
});

/**
 * Helper function to find an empty cell
 */
function findEmptyCell(grid) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === null) {
                return { row, col };
            }
        }
    }
    return null;
}

/**
 * Helper function to find a ball belonging to a player
 */
function findPlayerBall(grid, player) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === player) {
                return { row, col };
            }
        }
    }
    return null;
}

/**
 * Helper function to find a valid move for a ball
 */
function findValidMove(game, row, col) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < game.n &&
            newCol >= 0 && newCol < game.n &&
            game.grid[newRow][newCol] === null) {
            return { row: newRow, col: newCol };
        }
    }
    return null;
}
