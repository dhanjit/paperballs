/**
 * Paperballs - UI Management
 */

class PaperballsUI {
    constructor(game) {
        this.game = game;
        this.svg = document.getElementById('gameSvg');
        this.cellSize = 80;
        this.margin = 50;
        this.vertexRadius = 10;

        this.updateBoardSize();
    }

    /**
     * Update SVG board size based on grid size
     */
    updateBoardSize() {
        const totalSize = (this.game.n - 1) * this.cellSize + this.margin * 2;
        this.svg.setAttribute('width', totalSize);
        this.svg.setAttribute('height', totalSize);
    }

    addFilters() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Filter for pencil lines (roughness) - Adjusted for better visibility
        const pencilFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        pencilFilter.setAttribute('id', 'pencil');
        // Large buffer to prevent clipping of displaced lines (esp for thin horizontal/vertical lines)
        pencilFilter.setAttribute('x', '-500%');
        pencilFilter.setAttribute('y', '-500%');
        pencilFilter.setAttribute('width', '1100%');
        pencilFilter.setAttribute('height', '1100%');
        pencilFilter.innerHTML = `
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        `;
        defs.appendChild(pencilFilter);

        this.svg.appendChild(defs);
    }

    /**
     * Convert grid coordinates to SVG coordinates
     */
    gridToSvg(row, col) {
        return {
            x: this.margin + col * this.cellSize,
            y: this.margin + row * this.cellSize
        };
    }

    /**
     * Draw the game board
     */
    drawBoard() {
        // Clear existing content
        this.svg.innerHTML = '';

        // Add filters
        this.addFilters();

        // Draw grid lines
        this.drawGridLines();

        // Draw vertices
        this.drawVertices();
    }

    /**
     * Draw grid lines
     */
    drawGridLines() {
        const n = this.game.n;

        // Group for all grid lines to apply single filter (fixes clipping/disappearance)
        const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        linesGroup.setAttribute('class', 'grid-lines-group');
        linesGroup.style.filter = 'url(#pencil)';
        this.svg.appendChild(linesGroup);

        // Helper to create line
        const createLine = (x1, y1, x2, y2) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('class', 'grid-line');
            line.setAttribute('stroke-width', '2.5');
            // Filter is now on parent group
            linesGroup.appendChild(line);
        };

        // Horizontal lines
        for (let row = 0; row < n; row++) {
            const y = this.margin + row * this.cellSize;
            createLine(this.margin, y, this.margin + (n - 1) * this.cellSize, y);
        }

        // Vertical lines
        for (let col = 0; col < n; col++) {
            const x = this.margin + col * this.cellSize;
            createLine(x, this.margin, x, this.margin + (n - 1) * this.cellSize);
        }

        // Draw intersection dots
        const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        dotsGroup.style.filter = 'url(#pencil)';
        this.svg.appendChild(dotsGroup);

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                const { x, y } = this.gridToSvg(row, col);
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', x);
                dot.setAttribute('cy', y);
                dot.setAttribute('r', '3');
                dot.setAttribute('class', 'grid-intersection');
                dot.style.fill = 'var(--grid-color)';
                dot.style.opacity = '0.6';
                dotsGroup.appendChild(dot);
            }
        }

        // Diagonal lines - only draw based on diagonal mode
        const diagonalMode = this.game.diagonalMode;

        if (diagonalMode === 'main') {
            // Only draw the two main diagonal lines
            // Main diagonal: top-left to bottom-right
            const { x: x1, y: y1 } = this.gridToSvg(0, 0);
            const { x: x2, y: y2 } = this.gridToSvg(n - 1, n - 1);
            createLine(x1, y1, x2, y2);

            // Anti-diagonal: top-right to bottom-left
            const { x: x3, y: y3 } = this.gridToSvg(0, n - 1);
            const { x: x4, y: y4 } = this.gridToSvg(n - 1, 0);
            createLine(x3, y3, x4, y4);
        } else if (diagonalMode === 'short') {
            // Short diagonal lines (8-way movement everywhere)
            // Draw all diagonal connections between adjacent vertices

            // Top-left to bottom-right diagonals
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - 1; j++) {
                    const { x: x1, y: y1 } = this.gridToSvg(i, j);
                    const { x: x2, y: y2 } = this.gridToSvg(i + 1, j + 1);
                    createLine(x1, y1, x2, y2);
                }
            }

            // Top-right to bottom-left diagonals
            for (let i = 0; i < n - 1; i++) {
                for (let j = 1; j < n; j++) {
                    const { x: x1, y: y1 } = this.gridToSvg(i, j);
                    const { x: x2, y: y2 } = this.gridToSvg(i + 1, j - 1);
                    createLine(x1, y1, x2, y2);
                }
            }
        }
    }

    /**
     * Draw vertices
     */
    drawVertices() {
        const n = this.game.n;
        const state = this.game.getState();

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                this.drawVertex(row, col, state.grid[row][col]);
            }
        }

        // Highlight valid moves if a ball is selected
        if (state.selectedBall) {
            const validMoves = this.game.getValidMoves();
            validMoves.forEach(([row, col]) => {
                this.highlightValidMove(row, col);
            });
        }
    }

    /**
     * Draw a single vertex
     */
    drawVertex(row, col, player) {
        const { x, y } = this.gridToSvg(row, col);
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'vertex');
        group.setAttribute('data-row', row);
        group.setAttribute('data-col', col);

        if (player) {
            group.classList.add(`player-${player}`);
            group.classList.add('occupied');
        }

        // Check if this is the selected ball
        const state = this.game.getState();
        if (state.selectedBall &&
            state.selectedBall.row === row &&
            state.selectedBall.col === col) {
            group.classList.add('selected');
        }

        // Invisible circle for hit area / hover effect on empty spots
        const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hitArea.setAttribute('cx', x);
        hitArea.setAttribute('cy', y);
        hitArea.setAttribute('r', this.vertexRadius); // Standard hit radius
        hitArea.setAttribute('class', 'hit-area');
        group.appendChild(hitArea);

        // If player is present, draw the paper ball image
        if (player) {
            const size = this.cellSize * 0.8; // 80% of cell size
            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttribute('x', x - size / 2);
            img.setAttribute('y', y - size / 2);
            img.setAttribute('width', size);
            img.setAttribute('height', size);

            // Player 1 = White, Player 2 = Brown
            let imgSrc;
            if (player === 1) {
                // Deterministic random selection for white balls (1-5) based on position
                const randomIdx = ((row * 11 + col * 17) % 5) + 1;
                imgSrc = `img/ball-white-${randomIdx}.png`;
            } else {
                // Deterministic random selection for brown balls (1-5) based on position
                // Using different primes/offsets to ensure different distribution than white
                const randomIdx = ((row * 13 + col * 19) % 5) + 1;
                imgSrc = `img/ball-brown-${randomIdx}.png`;
            }
            img.setAttribute('href', imgSrc);

            // Add slight random rotation for variety
            // Deterministic random based on position so it doesn't jitter on redraw
            const rotation = ((row * 7 + col * 13) % 90) - 45;
            img.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);

            group.appendChild(img);
        }

        this.svg.appendChild(group);

        return group;
    }

    /**
     * Highlight a valid move position
     */
    highlightValidMove(row, col) {
        const vertex = this.svg.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (vertex) {
            vertex.classList.add('valid-move');
        }
    }

    /**
     * Update game info display
     */
    updateGameInfo() {
        const state = this.game.getState();

        // Update phase
        const phaseDisplay = document.getElementById('phaseDisplay');
        phaseDisplay.textContent = `Phase: ${state.phase.charAt(0).toUpperCase() + state.phase.slice(1)}`;

        // Update turn
        const turnDisplay = document.getElementById('turnDisplay');
        turnDisplay.textContent = `${this.game.getPlayerName(state.currentPlayer)}'s turn`;

        // Update instructions
        const instructionDisplay = document.getElementById('instructionDisplay');
        if (state.phase === 'placement') {
            instructionDisplay.textContent = 'Click any empty vertex to place your ball';
        } else if (state.selectedBall) {
            instructionDisplay.textContent = 'Click a highlighted vertex to move, or click your ball again to cancel';
        } else {
            instructionDisplay.textContent = 'Click one of your balls to select it';
        }

        // Update player status
        const player1Status = document.getElementById('player1Status');
        const player2Status = document.getElementById('player2Status');

        if (state.phase === 'placement') {
            player1Status.textContent = `Balls placed: ${state.ballsPlaced[1]}/${state.ballsPerPlayer}`;
            player2Status.textContent = `Balls placed: ${state.ballsPlaced[2]}/${state.ballsPerPlayer}`;
        } else {
            player1Status.textContent = `${state.ballsPerPlayer} balls in play`;
            player2Status.textContent = `${state.ballsPerPlayer} balls in play`;
        }

        // Highlight active player
        const player1Info = document.querySelector('.player-info.player-1');
        const player2Info = document.querySelector('.player-info.player-2');

        player1Info.classList.toggle('active', state.currentPlayer === 1);
        player2Info.classList.toggle('active', state.currentPlayer === 2);
    }

    /**
     * Show winner announcement
     */
    showWinner(player) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const announcement = document.createElement('div');
        announcement.className = 'winner-announcement';
        announcement.innerHTML = `
            <h2>🏆 ${this.game.getPlayerName(player)} Wins! 🏆</h2>
            <p>Congratulations on forming a complete line!</p>
            <button class="btn btn-primary" onclick="location.reload()">Play Again</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(announcement);
    }

    /**
     * Show winner by immobilization (opponent has no valid moves)
     */
    showWinnerByImmobilization(player) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const announcement = document.createElement('div');
        announcement.className = 'winner-announcement';
        announcement.innerHTML = `
            <h2>🏆 ${this.game.getPlayerName(player)} Wins! 🏆</h2>
            <p>Opponent has no valid moves!</p>
            <button class="btn btn-primary" onclick="location.reload()">Play Again</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(announcement);
    }

    /**
     * Refresh the entire display
     */
    refresh() {
        this.drawBoard();
        this.updateGameInfo();
    }
}
