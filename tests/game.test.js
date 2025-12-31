const PaperballsGame = require('../web/js/game');

describe('PaperballsGame', () => {
    let game;

    beforeEach(() => {
        game = new PaperballsGame(5, 'short');
    });

    test('initializes correctly', () => {
        expect(game.n).toBe(5);
        expect(game.currentPlayer).toBe(1);
        expect(game.phase).toBe('placement');
        expect(game.ballsPlaced).toEqual({ 1: 0, 2: 0 });
    });

    test('places balls correctly', () => {
        const result = game.placeBall(0, 0);
        expect(result.success).toBe(true);
        expect(game.grid[0][0]).toBe(1);
        expect(game.ballsPlaced[1]).toBe(1);
    });

    test('prevents placing on occupied spot', () => {
        game.placeBall(0, 0);
        const result = game.placeBall(0, 0);
        expect(result.success).toBe(false);
    });

    test('switches phase after all balls placed', () => {
        // Create a small 3×3 board for easier testing (3 balls each)
        game = new PaperballsGame(3, 'short');

        // Place all 6 balls (3 per player)
        // Note: switchPlayer() must be called manually after each placement
        // (in the actual game, this is done by the application layer)
        game.placeBall(0, 0); // P1
        game.switchPlayer();
        game.placeBall(1, 0); // P2
        game.switchPlayer();
        game.placeBall(0, 1); // P1
        game.switchPlayer();
        game.placeBall(1, 1); // P2
        game.switchPlayer();
        game.placeBall(0, 2); // P1
        game.switchPlayer();
        game.placeBall(1, 2); // P2

        // After all balls placed, phase should transition to movement
        expect(game.phase).toBe('movement');
    });

    test('validates adjacent moves in movement phase', () => {
        // Setup board for movement
        game = new PaperballsGame(3, 'short');
        game.phase = 'movement';
        game.grid[1][1] = 1; // P1 at center
        game.grid[0][0] = null; // Top-left empty

        // P1 selects center
        game.currentPlayer = 1;
        game.selectBall(1, 1);

        // Move to 0,0 (diagonal) - valid in 'short' mode
        const result = game.moveBall(0, 0);
        expect(result.success).toBe(true);
        expect(game.grid[1][1]).toBeNull();
        expect(game.grid[0][0]).toBe(1);
    });
});

// ============================================================================
// Win Detection Tests (Parameterized across grid sizes)
// ============================================================================
describe.each([
    [3, 'short'],
    [4, 'short'],
    [5, 'short'],
])('Win detection (grid=%i, mode=%s)', (n, diagonalMode) => {
    let game;

    beforeEach(() => {
        game = new PaperballsGame(n, diagonalMode);
        game.phase = 'movement'; // Set to movement phase for winner checking
    });

    test('detects horizontal win (top row)', () => {
        // Fill entire top row with Player 1
        for (let col = 0; col < n; col++) {
            game.grid[0][col] = 1;
        }

        const winner = game.checkWinner();
        expect(winner).toBe(1);
    });

    test('detects horizontal win (middle row)', () => {
        const midRow = Math.floor(n / 2);
        // Fill middle row with Player 2
        for (let col = 0; col < n; col++) {
            game.grid[midRow][col] = 2;
        }

        const winner = game.checkWinner();
        expect(winner).toBe(2);
    });

    test('detects vertical win (left column)', () => {
        // Fill entire left column with Player 1
        for (let row = 0; row < n; row++) {
            game.grid[row][0] = 1;
        }

        const winner = game.checkWinner();
        expect(winner).toBe(1);
    });

    test('detects vertical win (right column)', () => {
        // Fill entire right column with Player 2
        for (let row = 0; row < n; row++) {
            game.grid[row][n - 1] = 2;
        }

        const winner = game.checkWinner();
        expect(winner).toBe(2);
    });

    test('detects main diagonal win (top-left to bottom-right)', () => {
        // Fill main diagonal with Player 1
        for (let i = 0; i < n; i++) {
            game.grid[i][i] = 1;
        }

        const winner = game.checkWinner();
        expect(winner).toBe(1);
    });

    test('detects anti-diagonal win (top-right to bottom-left)', () => {
        // Fill anti-diagonal with Player 2
        for (let i = 0; i < n; i++) {
            game.grid[i][n - 1 - i] = 2;
        }

        const winner = game.checkWinner();
        expect(winner).toBe(2);
    });

    test('returns null when no winner exists', () => {
        // Partially fill grid without completing any line
        game.grid[0][0] = 1;
        game.grid[0][1] = 2;
        game.grid[1][0] = 2;
        game.grid[1][1] = 1;

        const winner = game.checkWinner();
        expect(winner).toBeNull();
    });

    test('returns null for partial lines (one short of winning)', () => {
        // Fill all but one position in top row
        for (let col = 0; col < n - 1; col++) {
            game.grid[0][col] = 1;
        }
        game.grid[0][n - 1] = 2; // Last position different player

        const winner = game.checkWinner();
        expect(winner).toBeNull();
    });
});

// ============================================================================
// Diagonal Mode Tests (Parameterized across diagonal modes)
// ============================================================================
describe.each([
    ['none', 4],     // Orthogonal only (4 directions)
    ['short', 8],    // Orthogonal + short diagonals (8 directions)
    ['all', 'many'], // All diagonals (many directions)
])('Adjacency with mode=%s', (diagonalMode, expectedDirections) => {
    let game;

    beforeEach(() => {
        game = new PaperballsGame(5, diagonalMode); // Use 5×5 grid for testing
    });

    test('gets correct adjacent positions from center', () => {
        const adjacent = game.getAdjacentPositions(2, 2); // Center of 5×5 grid

        if (typeof expectedDirections === 'number') {
            expect(adjacent.length).toBe(expectedDirections);
        } else {
            expect(adjacent.length).toBeGreaterThan(8);
        }
    });

    test('validates orthogonal moves are always allowed', () => {
        const adjacent = game.getAdjacentPositions(2, 2);

        // Orthogonal moves should always be included
        expect(adjacent).toContainEqual([1, 2]); // Up
        expect(adjacent).toContainEqual([3, 2]); // Down
        expect(adjacent).toContainEqual([2, 1]); // Left
        expect(adjacent).toContainEqual([2, 3]); // Right
    });

    if (diagonalMode === 'none') {
        test('rejects diagonal moves in none mode', () => {
            const adjacent = game.getAdjacentPositions(2, 2);

            // Short diagonals should NOT be included
            expect(adjacent).not.toContainEqual([1, 1]); // Top-left
            expect(adjacent).not.toContainEqual([1, 3]); // Top-right
            expect(adjacent).not.toContainEqual([3, 1]); // Bottom-left
            expect(adjacent).not.toContainEqual([3, 3]); // Bottom-right
        });
    }

    if (diagonalMode === 'short') {
        test('allows short diagonal moves in short mode', () => {
            const adjacent = game.getAdjacentPositions(2, 2);

            // Short diagonals should be included
            expect(adjacent).toContainEqual([1, 1]); // Top-left
            expect(adjacent).toContainEqual([1, 3]); // Top-right
            expect(adjacent).toContainEqual([3, 1]); // Bottom-left
            expect(adjacent).toContainEqual([3, 3]); // Bottom-right
        });

        test('rejects long diagonal moves in short mode', () => {
            const adjacent = game.getAdjacentPositions(2, 2);

            // Long diagonals should NOT be included
            expect(adjacent).not.toContainEqual([0, 0]); // Far top-left
            expect(adjacent).not.toContainEqual([0, 4]); // Far top-right
        });
    }

    if (diagonalMode === 'all') {
        test('allows all diagonal moves in all mode', () => {
            const adjacent = game.getAdjacentPositions(2, 2);

            // Short diagonals should be included
            expect(adjacent).toContainEqual([1, 1]);
            expect(adjacent).toContainEqual([1, 3]);

            // Long diagonals should also be included
            expect(adjacent).toContainEqual([0, 0]); // Far top-left
            expect(adjacent).toContainEqual([0, 4]); // Far top-right
            expect(adjacent).toContainEqual([4, 0]); // Far bottom-left
            expect(adjacent).toContainEqual([4, 4]); // Far bottom-right
        });

        test('allows long orthogonal moves in all mode', () => {
            const adjacent = game.getAdjacentPositions(2, 2);

            // Long orthogonal moves should be included
            expect(adjacent).toContainEqual([0, 2]); // Far up
            expect(adjacent).toContainEqual([4, 2]); // Far down
            expect(adjacent).toContainEqual([2, 0]); // Far left
            expect(adjacent).toContainEqual([2, 4]); // Far right
        });
    }

    test('respects grid boundaries', () => {
        const adjacent = game.getAdjacentPositions(0, 0); // Top-left corner

        // All returned positions should be valid
        adjacent.forEach(([row, col]) => {
            expect(row).toBeGreaterThanOrEqual(0);
            expect(row).toBeLessThan(5);
            expect(col).toBeGreaterThanOrEqual(0);
            expect(col).toBeLessThan(5);
        });
    });
});

// ============================================================================
// Boundary and Edge Case Tests (Parameterized across grid sizes)
// ============================================================================
describe.each([
    [3], [4], [5], [6], [7]
])('Boundary tests for grid size=%i', (n) => {
    let game;

    beforeEach(() => {
        game = new PaperballsGame(n, 'short');
    });

    test('validates position at top-left corner', () => {
        expect(game.isValidPosition(0, 0)).toBe(true);
    });

    test('validates position at bottom-right corner', () => {
        expect(game.isValidPosition(n - 1, n - 1)).toBe(true);
    });

    test('rejects negative row', () => {
        expect(game.isValidPosition(-1, 0)).toBe(false);
    });

    test('rejects negative column', () => {
        expect(game.isValidPosition(0, -1)).toBe(false);
    });

    test('rejects row at grid boundary', () => {
        expect(game.isValidPosition(n, 0)).toBe(false);
    });

    test('rejects column at grid boundary', () => {
        expect(game.isValidPosition(0, n)).toBe(false);
    });

    test('initializes empty grid', () => {
        // All cells should be null
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                expect(game.grid[row][col]).toBeNull();
            }
        }
    });

    test('initializes with correct number of balls per player', () => {
        expect(game.ballsPerPlayer).toBe(n);
    });
});

// ============================================================================
// Invalid Move Tests
// ============================================================================
describe('Invalid moves in movement phase', () => {
    let game;

    beforeEach(() => {
        game = new PaperballsGame(3, 'short');
        game.phase = 'movement';
        game.grid[1][1] = 1; // P1 at center
        game.grid[0][0] = 2; // P2 at top-left
        game.currentPlayer = 1;
    });

    test('rejects moving to occupied cell', () => {
        game.selectBall(1, 1);
        const result = game.moveBall(0, 0); // Try to move to occupied cell

        expect(result.success).toBe(false);
        expect(result.error).toContain('not empty');
    });

    test('rejects moving without selecting a ball', () => {
        game.selectedBall = null;
        const result = game.moveBall(0, 1);

        expect(result.success).toBe(false);
        expect(result.error).toContain('No ball selected');
    });

    test('rejects selecting opponent ball', () => {
        const result = game.selectBall(0, 0); // Try to select P2's ball as P1

        expect(result.success).toBe(false);
        expect(result.error).toContain("don't have a ball");
    });

    test('rejects moving during placement phase', () => {
        game.phase = 'placement';
        const result = game.selectBall(1, 1);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Not in movement phase');
    });

    test('rejects placing during movement phase', () => {
        game.phase = 'movement';
        const result = game.placeBall(2, 2);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Not in placement phase');
    });
});

// ============================================================================
// State Transition Tests
// ============================================================================
describe.each([
    [3],
    [4],
    [5],
])('State transitions for grid=%i', (n) => {
    let game;

    beforeEach(() => {
        game = new PaperballsGame(n, 'short');
    });

    test('starts in placement phase', () => {
        expect(game.phase).toBe('placement');
        expect(game.currentPlayer).toBe(1);
        expect(game.ballsPlaced).toEqual({ 1: 0, 2: 0 });
    });

    test('transitions to movement after all balls placed', () => {
        // Place all n balls for each player
        for (let i = 0; i < n; i++) {
            game.placeBall(0, i); // P1
            game.switchPlayer();
            game.placeBall(1, i); // P2
            game.switchPlayer();
        }

        expect(game.phase).toBe('movement');
    });

    test('tracks balls placed correctly', () => {
        game.placeBall(0, 0);
        expect(game.ballsPlaced[1]).toBe(1);

        game.switchPlayer();
        game.placeBall(1, 0);
        expect(game.ballsPlaced[2]).toBe(1);
    });
});

// ============================================================================
// Integration Tests - Complete Game Flows
// ============================================================================
describe('Complete game flow integration', () => {
    test('full game: placement → movement → win', () => {
        const game = new PaperballsGame(3, 'short');

        // Placement phase: Place all 6 balls
        expect(game.phase).toBe('placement');

        // Place balls strategically to set up a win
        game.placeBall(0, 0); // P1
        game.switchPlayer();
        game.placeBall(1, 0); // P2
        game.switchPlayer();
        game.placeBall(0, 1); // P1
        game.switchPlayer();
        game.placeBall(1, 1); // P2
        game.switchPlayer();
        game.placeBall(0, 2); // P1
        game.switchPlayer();
        game.placeBall(2, 2); // P2

        // Should have transitioned to movement phase
        expect(game.phase).toBe('movement');

        // P1 should have a horizontal line at row 0 → should win
        const winner = game.checkWinner();
        expect(winner).toBe(1);
    });

    test('multi-turn movement sequence', () => {
        const game = new PaperballsGame(3, 'short');
        game.phase = 'movement';

        // Setup initial board state
        game.grid[0][0] = 1;
        game.grid[2][2] = 2;
        game.currentPlayer = 1;

        // P1 selects and moves ball
        let result = game.selectBall(0, 0);
        expect(result.success).toBe(true);

        result = game.moveBall(0, 1);
        expect(result.success).toBe(true);
        expect(game.grid[0][1]).toBe(1);
        expect(game.grid[0][0]).toBeNull();

        // Switch to P2
        game.switchPlayer();
        expect(game.currentPlayer).toBe(2);

        // P2 selects and moves ball
        result = game.selectBall(2, 2);
        expect(result.success).toBe(true);

        result = game.moveBall(2, 1);
        expect(result.success).toBe(true);
        expect(game.grid[2][1]).toBe(2);
        expect(game.grid[2][2]).toBeNull();

        // Verify no winner yet
        expect(game.checkWinner()).toBeNull();
    });

    test('error recovery - invalid move does not break game state', () => {
        const game = new PaperballsGame(3, 'short');
        game.phase = 'movement';
        game.grid[1][1] = 1;
        game.grid[0][0] = 2;
        game.currentPlayer = 1;

        // Select ball
        game.selectBall(1, 1);

        // Try invalid move (to occupied position)
        const invalidMove = game.moveBall(0, 0);
        expect(invalidMove.success).toBe(false);

        // Game state should be unchanged
        expect(game.grid[1][1]).toBe(1);
        expect(game.grid[0][0]).toBe(2);
        expect(game.currentPlayer).toBe(1);

        // Should be able to make valid move after failed attempt
        const validMove = game.moveBall(1, 2);
        expect(validMove.success).toBe(true);
        expect(game.grid[1][2]).toBe(1);
        expect(game.grid[1][1]).toBeNull();
    });
});
