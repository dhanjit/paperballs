/**
 * Paperballs AI - Minimax with Alpha-Beta Pruning
 *
 * Implements an AI opponent that can play Paperballs strategically using
 * the Minimax algorithm with Alpha-Beta pruning for optimization.
 */

class PaperballsAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.maxDepth = this.getDepthForDifficulty(difficulty);
        this.aiPlayer = 2; // AI is always Player 2
        this.opponent = 1;  // Human is Player 1
    }

    /**
     * Get search depth based on difficulty level
     */
    getDepthForDifficulty(difficulty) {
        const depths = {
            'easy': 2,
            'medium': 4,
            'hard': 6
        };
        return depths[difficulty] || 4;
    }

    /**
     * Main entry point - get best move for current game state
     */
    getMove(gameState) {
        if (gameState.phase === 'placement') {
            return this.getBestPlacement(gameState);
        } else {
            return this.getBestMovement(gameState);
        }
    }

    /**
     * Get best ball placement during placement phase
     */
    getBestPlacement(gameState) {
        const possiblePlacements = [];

        // Find all empty positions
        for (let row = 0; row < gameState.n; row++) {
            for (let col = 0; col < gameState.n; col++) {
                if (gameState.grid[row][col] === null) {
                    possiblePlacements.push({ row, col });
                }
            }
        }

        // If no placements available, return null
        if (possiblePlacements.length === 0) {
            return null;
        }

        // Use Minimax to evaluate each possible placement
        let bestScore = -Infinity;
        let bestMove = possiblePlacements[0];

        for (const placement of possiblePlacements) {
            const simulated = this.simulatePlacement(gameState, placement.row, placement.col, this.aiPlayer);
            const score = this.minimax(simulated, this.maxDepth - 1, -Infinity, Infinity, false);

            if (score > bestScore) {
                bestScore = score;
                bestMove = placement;
            }
        }

        return {
            type: 'place',
            row: bestMove.row,
            col: bestMove.col
        };
    }

    /**
     * Get best ball movement during movement phase
     */
    getBestMovement(gameState) {
        const possibleMoves = this.getAllPossibleMoves(gameState, this.aiPlayer);

        // If no moves available, return null
        if (possibleMoves.length === 0) {
            return null;
        }

        // Use Minimax to evaluate each possible move
        let bestScore = -Infinity;
        let bestMove = possibleMoves[0];

        for (const move of possibleMoves) {
            const simulated = this.simulateMovement(
                gameState,
                move.fromRow,
                move.fromCol,
                move.toRow,
                move.toCol
            );

            // Check if this move immediately wins
            const immediateWin = this.checkWinnerFromState(simulated);
            if (immediateWin === this.aiPlayer) {
                // Immediate win - return this move right away
                return {
                    type: 'move',
                    fromRow: move.fromRow,
                    fromCol: move.fromCol,
                    toRow: move.toRow,
                    toCol: move.toCol
                };
            }

            const score = this.minimax(simulated, this.maxDepth - 1, -Infinity, Infinity, false);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return {
            type: 'move',
            fromRow: bestMove.fromRow,
            fromCol: bestMove.fromCol,
            toRow: bestMove.toRow,
            toCol: bestMove.toCol
        };
    }

    /**
     * Minimax algorithm with Alpha-Beta pruning
     *
     * @param {Object} gameState - Current game state
     * @param {number} depth - Remaining search depth
     * @param {number} alpha - Alpha value for pruning
     * @param {number} beta - Beta value for pruning
     * @param {boolean} maximizingPlayer - True if AI's turn, false if opponent's turn
     * @returns {number} Evaluation score
     */
    minimax(gameState, depth, alpha, beta, maximizingPlayer) {
        // Check terminal conditions
        const winner = this.checkWinnerFromState(gameState);
        if (winner === this.aiPlayer) return 1000000;
        if (winner === this.opponent) return -1000000;

        // Check for no-moves condition (immobilization) in movement phase
        if (gameState.phase === 'movement') {
            const currentPlayer = maximizingPlayer ? this.aiPlayer : this.opponent;
            const moves = this.getAllPossibleMoves(gameState, currentPlayer);
            if (moves.length === 0) {
                // Current player has no moves - they lose
                return maximizingPlayer ? -1000000 : 1000000;
            }
        }

        if (depth === 0) return this.evaluate(gameState);

        const currentPlayer = maximizingPlayer ? this.aiPlayer : this.opponent;

        if (gameState.phase === 'placement') {
            // Placement phase minimax
            const placements = [];
            for (let row = 0; row < gameState.n; row++) {
                for (let col = 0; col < gameState.n; col++) {
                    if (gameState.grid[row][col] === null) {
                        placements.push({ row, col });
                    }
                }
            }

            if (placements.length === 0) {
                // Phase should transition - evaluate current position
                return this.evaluate(gameState);
            }

            if (maximizingPlayer) {
                let maxEval = -Infinity;
                for (const placement of placements) {
                    const simulated = this.simulatePlacement(gameState, placement.row, placement.col, currentPlayer);
                    const evaluation = this.minimax(simulated, depth - 1, alpha, beta, false);
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    if (beta <= alpha) break; // Alpha-Beta pruning
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (const placement of placements) {
                    const simulated = this.simulatePlacement(gameState, placement.row, placement.col, currentPlayer);
                    const evaluation = this.minimax(simulated, depth - 1, alpha, beta, true);
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    if (beta <= alpha) break; // Alpha-Beta pruning
                }
                return minEval;
            }
        } else {
            // Movement phase minimax
            const moves = this.getAllPossibleMoves(gameState, currentPlayer);

            if (moves.length === 0) {
                // No moves available - stalemate or end of game
                return this.evaluate(gameState);
            }

            if (maximizingPlayer) {
                let maxEval = -Infinity;
                for (const move of moves) {
                    const simulated = this.simulateMovement(
                        gameState,
                        move.fromRow,
                        move.fromCol,
                        move.toRow,
                        move.toCol
                    );
                    const evaluation = this.minimax(simulated, depth - 1, alpha, beta, false);
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    if (beta <= alpha) break; // Alpha-Beta pruning
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (const move of moves) {
                    const simulated = this.simulateMovement(
                        gameState,
                        move.fromRow,
                        move.fromCol,
                        move.toRow,
                        move.toCol
                    );
                    const evaluation = this.minimax(simulated, depth - 1, alpha, beta, true);
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    if (beta <= alpha) break; // Alpha-Beta pruning
                }
                return minEval;
            }
        }
    }

    /**
     * Evaluate a game state using heuristic scoring
     */
    evaluate(gameState) {
        let score = 0;

        // Check for winning/losing positions
        const winner = this.checkWinnerFromState(gameState);
        if (winner === this.aiPlayer) return 1000000;
        if (winner === this.opponent) return -1000000;

        // Evaluate all lines for threats and opportunities
        const n = gameState.n;
        const grid = gameState.grid;
        const k = gameState.winLineLength || n;

        // Check all horizontal lines
        for (let row = 0; row < n; row++) {
            const positions = Array.from({ length: n }, (_, col) => [row, col]);
            score += this.evaluateLine(grid, positions, this.aiPlayer, k);
            score -= this.evaluateLine(grid, positions, this.opponent, k);
        }

        // Check all vertical lines
        for (let col = 0; col < n; col++) {
            const positions = Array.from({ length: n }, (_, row) => [row, col]);
            score += this.evaluateLine(grid, positions, this.aiPlayer, k);
            score -= this.evaluateLine(grid, positions, this.opponent, k);
        }

        // Check main diagonal
        const diagonal1 = Array.from({ length: n }, (_, i) => [i, i]);
        score += this.evaluateLine(grid, diagonal1, this.aiPlayer, k);
        score -= this.evaluateLine(grid, diagonal1, this.opponent, k);

        // Check anti-diagonal
        const diagonal2 = Array.from({ length: n }, (_, i) => [i, n - 1 - i]);
        score += this.evaluateLine(grid, diagonal2, this.aiPlayer, k);
        score -= this.evaluateLine(grid, diagonal2, this.opponent, k);

        // Add positional bonuses
        score += this.evaluatePosition(gameState);

        return score;
    }

    /**
     * Evaluate a single line for a player using sliding window for K-in-a-row
     */
    evaluateLine(grid, positions, player, winLineLength) {
        let maxScore = 0;

        // Check each possible K-length window
        for (let start = 0; start <= positions.length - winLineLength; start++) {
            const window = positions.slice(start, start + winLineLength);

            let count = 0;
            let emptyCount = 0;
            let blocked = false;

            for (const [row, col] of window) {
                if (grid[row][col] === player) {
                    count++;
                } else if (grid[row][col] === null) {
                    emptyCount++;
                } else {
                    // Window is blocked by opponent
                    blocked = true;
                    break;
                }
            }

            if (blocked) continue;

            // Score this window based on progress toward K-in-a-row
            let windowScore = 0;
            const k = winLineLength;

            if (count === k) {
                // Actual win (should never happen as it would be terminal)
                windowScore = 1000000;
            } else if (count === k - 1 && emptyCount === 1) {
                // One move away from winning
                windowScore = 50000;
            } else if (count === k - 2 && emptyCount === 2) {
                // Two moves away from winning
                windowScore = 1000;
            } else if (count === k - 3 && emptyCount === 3) {
                // Three moves away
                windowScore = 100;
            } else if (count > 0 && emptyCount + count === k) {
                // Some progress in this window
                windowScore = count * 10;
            }

            maxScore = Math.max(maxScore, windowScore);
        }

        return maxScore;
    }

    /**
     * Evaluate positional advantages
     */
    evaluatePosition(gameState) {
        let score = 0;
        const n = gameState.n;
        const grid = gameState.grid;
        const center = Math.floor(n / 2);

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (grid[row][col] === this.aiPlayer) {
                    // Center control
                    const distanceFromCenter = Math.abs(row - center) + Math.abs(col - center);
                    score += Math.max(0, 100 - distanceFromCenter * 20);

                    // Mobility bonus (number of adjacent empty spaces)
                    const mobility = this.countMobility(gameState, row, col);
                    score += mobility * 10;
                } else if (grid[row][col] === this.opponent) {
                    // Penalize opponent's good positions
                    const distanceFromCenter = Math.abs(row - center) + Math.abs(col - center);
                    score -= Math.max(0, 50 - distanceFromCenter * 10);
                }
            }
        }

        return score;
    }

    /**
     * Count number of valid moves for a ball
     */
    countMobility(gameState, row, col) {
        if (gameState.phase !== 'movement') return 0;

        const adjacent = this.getAdjacentPositions(gameState, row, col);
        let count = 0;

        for (const [adjRow, adjCol] of adjacent) {
            if (gameState.grid[adjRow][adjCol] === null) {
                count++;
            }
        }

        return count;
    }

    /**
     * Get all possible moves for a player in current state
     */
    getAllPossibleMoves(gameState, player) {
        const moves = [];
        const grid = gameState.grid;
        const n = gameState.n;

        // Find all balls belonging to the player
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (grid[row][col] === player) {
                    // Get valid moves for this ball
                    const adjacent = this.getAdjacentPositions(gameState, row, col);
                    for (const [adjRow, adjCol] of adjacent) {
                        if (grid[adjRow][adjCol] === null) {
                            moves.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: adjRow,
                                toCol: adjCol
                            });
                        }
                    }
                }
            }
        }

        return moves;
    }

    /**
     * Get adjacent positions based on diagonal mode
     */
    getAdjacentPositions(gameState, row, col) {
        const n = gameState.n;
        const diagonalMode = gameState.diagonalMode || 'short';
        const orthogonal = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const shortDiagonal = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

        let directions = [];

        if (diagonalMode === 'none') {
            directions = orthogonal;
        } else if (diagonalMode === 'main') {
            // Orthogonal + main diagonals only
            directions = [...orthogonal];

            // Check if position is on main diagonal or anti-diagonal
            const onMainDiag = row === col;
            const onAntiDiag = row + col === n - 1;

            if (onMainDiag) {
                // Can move along main diagonal
                if (row - 1 >= 0 && col - 1 >= 0) {
                    directions.push([-1, -1]);
                }
                if (row + 1 < n && col + 1 < n) {
                    directions.push([1, 1]);
                }
            }

            if (onAntiDiag) {
                // Can move along anti-diagonal
                if (row - 1 >= 0 && col + 1 < n) {
                    directions.push([-1, 1]);
                }
                if (row + 1 < n && col - 1 >= 0) {
                    directions.push([1, -1]);
                }
            }
        } else if (diagonalMode === 'short') {
            directions = [...orthogonal, ...shortDiagonal];
        }

        return directions
            .map(([dr, dc]) => [row + dr, col + dc])
            .filter(([r, c]) => r >= 0 && r < n && c >= 0 && c < n);
    }

    /**
     * Simulate a ball placement
     */
    simulatePlacement(gameState, row, col, player) {
        const simulated = this.cloneGameState(gameState);
        simulated.grid[row][col] = player;
        simulated.ballsPlaced[player]++;

        // Check if phase should transition
        if (simulated.ballsPlaced[1] === simulated.ballsPerPlayer &&
            simulated.ballsPlaced[2] === simulated.ballsPerPlayer) {
            simulated.phase = 'movement';
        }

        return simulated;
    }

    /**
     * Simulate a ball movement
     */
    simulateMovement(gameState, fromRow, fromCol, toRow, toCol) {
        const simulated = this.cloneGameState(gameState);
        const player = simulated.grid[fromRow][fromCol];
        simulated.grid[fromRow][fromCol] = null;
        simulated.grid[toRow][toCol] = player;
        return simulated;
    }

    /**
     * Clone game state for simulation
     */
    cloneGameState(gameState) {
        return {
            n: gameState.n,
            grid: gameState.grid.map(row => [...row]),
            phase: gameState.phase,
            ballsPlaced: { ...gameState.ballsPlaced },
            ballsPerPlayer: gameState.ballsPerPlayer,
            diagonalMode: gameState.diagonalMode,
            winLineLength: gameState.winLineLength
        };
    }

    /**
     * Check if K consecutive positions in a line contain the player's ball
     * Uses sliding window algorithm to check all possible K-length subsequences
     */
    checkLineForKConsecutive(grid, positions, player, k) {
        // Check each K-length subsequence for consecutive player balls
        for (let start = 0; start <= positions.length - k; start++) {
            const window = positions.slice(start, start + k);
            const hasKConsecutive = window.every(([r, c]) => grid[r][c] === player);
            if (hasKConsecutive) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check winner from a game state
     * Checks for K consecutive balls in a row (K = winLineLength)
     */
    checkWinnerFromState(gameState) {
        const n = gameState.n;
        const grid = gameState.grid;
        const k = gameState.winLineLength || n; // Default to N if not specified

        for (let player of [1, 2]) {
            // Check horizontal lines (each row)
            for (let row = 0; row < n; row++) {
                const positions = Array.from({ length: n }, (_, col) => [row, col]);
                if (this.checkLineForKConsecutive(grid, positions, player, k)) {
                    return player;
                }
            }

            // Check vertical lines (each column)
            for (let col = 0; col < n; col++) {
                const positions = Array.from({ length: n }, (_, row) => [row, col]);
                if (this.checkLineForKConsecutive(grid, positions, player, k)) {
                    return player;
                }
            }

            // Check main diagonal (top-left to bottom-right)
            const diagonal1 = Array.from({ length: n }, (_, i) => [i, i]);
            if (this.checkLineForKConsecutive(grid, diagonal1, player, k)) {
                return player;
            }

            // Check anti-diagonal (top-right to bottom-left)
            const diagonal2 = Array.from({ length: n }, (_, i) => [i, n - 1 - i]);
            if (this.checkLineForKConsecutive(grid, diagonal2, player, k)) {
                return player;
            }
        }

        return null;
    }

    /**
     * Check if all positions in a line contain the player's ball
     * @deprecated Use checkLineForKConsecutive() instead
     */
    checkLine(grid, positions, player) {
        return positions.every(([r, c]) => grid[r][c] === player);
    }
}

// Export for Node.js (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaperballsAI;
}
