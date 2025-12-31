/**
 * Paperballs - Core Game Logic
 */

class PaperballsGame {
    constructor(n = 5, diagonalMode = 'short', winLineLength = null) {
        if (n < 3) {
            throw new Error("Grid size must be at least 3");
        }

        this.n = n;
        this.diagonalMode = diagonalMode; // 'none', 'main', 'short'

        // Default: N-in-a-row for N×N grid (current behavior)
        this.winLineLength = winLineLength || n;

        // Validation: winLineLength must be 3 ≤ K ≤ N
        if (this.winLineLength < 3 || this.winLineLength > n) {
            throw new Error(`Win line length must be between 3 and ${n}`);
        }

        this.grid = Array(n).fill(null).map(() => Array(n).fill(null));
        this.currentPlayer = 1;
        this.phase = "placement"; // "placement" or "movement"
        this.ballsPlaced = { 1: 0, 2: 0 };
        this.ballsPerPlayer = n;
        this.selectedBall = null;
        this.winner = null;
    }

    /**
     * Check if a position is within grid bounds
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.n && col >= 0 && col < this.n;
    }

    /**
     * Check if a position is empty
     */
    isEmpty(row, col) {
        return this.isValidPosition(row, col) && this.grid[row][col] === null;
    }

    /**
     * Check if a position is on the main diagonal (top-left to bottom-right)
     */
    isOnMainDiagonal(row, col) {
        return row === col;
    }

    /**
     * Check if a position is on the anti-diagonal (top-right to bottom-left)
     */
    isOnAntiDiagonal(row, col) {
        return row + col === this.n - 1;
    }

    /**
     * Get all adjacent positions based on diagonal mode
     */
    getAdjacentPositions(row, col) {
        let directions = [];

        // Orthogonal directions (always included)
        const orthogonal = [
            [-1, 0], // up
            [0, -1], // left
            [0, 1],  // right
            [1, 0]   // down
        ];

        // Short diagonal directions
        const shortDiagonal = [
            [-1, -1], // up-left
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [1, 1]    // down-right
        ];

        // Add directions based on diagonal mode
        if (this.diagonalMode === 'none') {
            // Only orthogonal (4-way)
            directions = orthogonal;
        } else if (this.diagonalMode === 'main') {
            // Orthogonal + main diagonals only
            directions = [...orthogonal];

            // Add diagonal directions only if both current and adjacent positions are on main diagonals
            const onMainDiag = this.isOnMainDiagonal(row, col);
            const onAntiDiag = this.isOnAntiDiagonal(row, col);

            if (onMainDiag) {
                // Can move along main diagonal: up-left or down-right
                if (this.isValidPosition(row - 1, col - 1)) {
                    directions.push([-1, -1]);
                }
                if (this.isValidPosition(row + 1, col + 1)) {
                    directions.push([1, 1]);
                }
            }

            if (onAntiDiag) {
                // Can move along anti-diagonal: up-right or down-left
                if (this.isValidPosition(row - 1, col + 1)) {
                    directions.push([-1, 1]);
                }
                if (this.isValidPosition(row + 1, col - 1)) {
                    directions.push([1, -1]);
                }
            }
        } else if (this.diagonalMode === 'short') {
            // Orthogonal + short diagonals (8-way movement everywhere)
            directions = [...orthogonal, ...shortDiagonal];
        }

        return directions
            .map(([dr, dc]) => [row + dr, col + dc])
            .filter(([r, c]) => this.isValidPosition(r, c));
    }

    /**
     * Place a ball during placement phase
     */
    placeBall(row, col) {
        if (this.phase !== "placement") {
            return { success: false, error: "Not in placement phase" };
        }

        if (!this.isEmpty(row, col)) {
            return { success: false, error: "Position is already occupied" };
        }

        this.grid[row][col] = this.currentPlayer;
        this.ballsPlaced[this.currentPlayer]++;

        // Check if placement phase is complete
        if (this.ballsPlaced[1] === this.ballsPerPlayer &&
            this.ballsPlaced[2] === this.ballsPerPlayer) {
            this.phase = "movement";
        }

        return { success: true };
    }

    /**
     * Select a ball for movement
     */
    selectBall(row, col) {
        if (this.phase !== "movement") {
            return { success: false, error: "Not in movement phase" };
        }

        if (!this.isValidPosition(row, col)) {
            return { success: false, error: "Invalid position" };
        }

        if (this.grid[row][col] !== this.currentPlayer) {
            return { success: false, error: "You don't have a ball at that position" };
        }

        this.selectedBall = { row, col };
        return { success: true };
    }

    /**
     * Get valid moves for the currently selected ball
     */
    getValidMoves() {
        if (!this.selectedBall) {
            return [];
        }

        const { row, col } = this.selectedBall;
        return this.getAdjacentPositions(row, col)
            .filter(([r, c]) => this.isEmpty(r, c));
    }

    /**
     * Check if a player has any valid moves
     * Returns true if the player has at least one legal move available
     * Only applicable in movement phase
     */
    hasValidMoves(player) {
        if (this.phase !== 'movement') {
            // During placement, always have moves if empty cells exist
            return this.grid.some(row => row.some(cell => cell === null));
        }

        const n = this.n;
        const grid = this.grid;

        // Find all balls belonging to the player
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (grid[row][col] === player) {
                    // Check if this ball has any valid moves
                    const adjacent = this.getAdjacentPositions(row, col);
                    const hasMove = adjacent.some(([r, c]) => this.isEmpty(r, c));

                    if (hasMove) {
                        return true; // Found at least one valid move
                    }
                }
            }
        }

        return false; // No valid moves found
    }

    /**
     * Move the selected ball to a new position
     */
    moveBall(toRow, toCol) {
        if (this.phase !== "movement") {
            return { success: false, error: "Not in movement phase" };
        }

        if (!this.selectedBall) {
            return { success: false, error: "No ball selected" };
        }

        const { row: fromRow, col: fromCol } = this.selectedBall;

        // Check if destination is valid and empty
        if (!this.isEmpty(toRow, toCol)) {
            return { success: false, error: "Destination is not empty" };
        }

        // Check if destination is adjacent
        const validMoves = this.getValidMoves();
        const isValidMove = validMoves.some(([r, c]) => r === toRow && c === toCol);

        if (!isValidMove) {
            return { success: false, error: "Destination is not adjacent" };
        }

        // Make the move
        this.grid[toRow][toCol] = this.currentPlayer;
        this.grid[fromRow][fromCol] = null;
        this.selectedBall = null;

        return { success: true };
    }

    /**
     * Cancel ball selection
     */
    cancelSelection() {
        this.selectedBall = null;
    }

    /**
     * Check if K consecutive positions in a line contain the player's ball
     * Uses sliding window algorithm to check all possible K-length subsequences
     */
    checkLineForKConsecutive(positions, player, k) {
        // Check each K-length subsequence for consecutive player balls
        for (let start = 0; start <= positions.length - k; start++) {
            const window = positions.slice(start, start + k);
            const hasKConsecutive = window.every(([r, c]) =>
                this.isValidPosition(r, c) && this.grid[r][c] === player
            );
            if (hasKConsecutive) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if all positions contain the player's ball
     * @deprecated Use checkLineForKConsecutive() instead
     */
    checkLine(positions, player) {
        return positions.every(([r, c]) =>
            this.isValidPosition(r, c) && this.grid[r][c] === player
        );
    }

    /**
     * Check if there's a winner
     * Checks for K consecutive balls in a row (K = winLineLength)
     */
    checkWinner() {
        const k = this.winLineLength;

        for (let player of [1, 2]) {
            // Check horizontal lines (each row)
            for (let row = 0; row < this.n; row++) {
                const positions = Array.from({ length: this.n }, (_, col) => [row, col]);
                if (this.checkLineForKConsecutive(positions, player, k)) {
                    return player;
                }
            }

            // Check vertical lines (each column)
            for (let col = 0; col < this.n; col++) {
                const positions = Array.from({ length: this.n }, (_, row) => [row, col]);
                if (this.checkLineForKConsecutive(positions, player, k)) {
                    return player;
                }
            }

            // Check main diagonal (top-left to bottom-right)
            const diagonal1 = Array.from({ length: this.n }, (_, i) => [i, i]);
            if (this.checkLineForKConsecutive(diagonal1, player, k)) {
                return player;
            }

            // Check anti-diagonal (top-right to bottom-left)
            const diagonal2 = Array.from({ length: this.n }, (_, i) => [i, this.n - 1 - i]);
            if (this.checkLineForKConsecutive(diagonal2, player, k)) {
                return player;
            }
        }

        return null;
    }

    /**
     * Switch to the other player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    /**
     * Get player name
     */
    getPlayerName(player) {
        return `Player ${player} (${player === 1 ? 'X' : 'O'})`;
    }

    /**
     * Get current game state
     */
    getState() {
        return {
            n: this.n,
            grid: this.grid.map(row => [...row]),
            currentPlayer: this.currentPlayer,
            phase: this.phase,
            ballsPlaced: { ...this.ballsPlaced },
            ballsPerPlayer: this.ballsPerPlayer,
            selectedBall: this.selectedBall ? { ...this.selectedBall } : null,
            winner: this.winner,
            diagonalMode: this.diagonalMode,
            winLineLength: this.winLineLength
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaperballsGame;
}
