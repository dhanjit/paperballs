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

        // Horizontal lines
        for (let row = 0; row < n; row++) {
            const y = this.margin + row * this.cellSize;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', this.margin);
            line.setAttribute('y1', y);
            line.setAttribute('x2', this.margin + (n - 1) * this.cellSize);
            line.setAttribute('y2', y);
            line.setAttribute('class', 'grid-line');
            this.svg.appendChild(line);
        }

        // Vertical lines
        for (let col = 0; col < n; col++) {
            const x = this.margin + col * this.cellSize;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', this.margin);
            line.setAttribute('x2', x);
            line.setAttribute('y2', this.margin + (n - 1) * this.cellSize);
            line.setAttribute('class', 'grid-line');
            this.svg.appendChild(line);
        }

        // Diagonal lines (top-left to bottom-right)
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1; j++) {
                const { x: x1, y: y1 } = this.gridToSvg(i, j);
                const { x: x2, y: y2 } = this.gridToSvg(i + 1, j + 1);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('class', 'grid-line');
                this.svg.appendChild(line);
            }
        }

        // Diagonal lines (top-right to bottom-left)
        for (let i = 0; i < n - 1; i++) {
            for (let j = 1; j < n; j++) {
                const { x: x1, y: y1 } = this.gridToSvg(i, j);
                const { x: x2, y: y2 } = this.gridToSvg(i + 1, j - 1);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('class', 'grid-line');
                this.svg.appendChild(line);
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

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', this.vertexRadius);

        group.appendChild(circle);
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
     * Refresh the entire display
     */
    refresh() {
        this.drawBoard();
        this.updateGameInfo();
    }
}
