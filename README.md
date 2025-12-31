# Paperballs

![CI](https://github.com/dhanjit/paperballs/workflows/CI/badge.svg)
![Release](https://github.com/dhanjit/paperballs/workflows/Release/badge.svg)

A childhood game recreated - a strategic two-player game combining placement and movement mechanics.

## Overview

Paperballs is a two-player strategy game played on a square grid. Players take turns placing and then moving their paperballs, aiming to form a straight line to win.

**Play against a friend or challenge the AI!** The game features an intelligent computer opponent with three difficulty levels.

## Features

- 🎮 **Two Game Modes:**
  - Player vs Player (PvP)
  - Player vs AI (PvAI)
- 🤖 **Intelligent AI Opponent:**
  - Three difficulty levels (Easy, Medium, Hard)
  - Uses Minimax algorithm with Alpha-Beta pruning
  - Detects winning moves and blocks opponent threats
- 🎨 **Beautiful Notebook Paper Theme:**
  - Hand-drawn aesthetic with realistic paper ball graphics
  - Ruled paper background with margin line
  - Handwritten font style
- 📐 **Flexible Grid Configurations:**
  - Multiple grid sizes (3×3 to 7×7)
  - Three diagonal modes (none, short, all)
- ✅ **100% Test Coverage:**
  - 129 automated tests
  - 96%+ code coverage
  - CI/CD integration

## Quick Start

- **Players:** 1-2 (Player vs AI or Player vs Player)
- **Grid Size:** N×N vertices (minimum N=3, recommended N=5)
- **Diagonal Configuration:** Choose between no diagonals, short diagonals (standard), or all diagonals
- **Pieces:** Each player gets N paperballs
- **Objective:** Form a straight line (horizontal, vertical, or diagonal) with your paperballs

## Game Rules

### Setup
1. Create an N×N square grid (N points on each side)
2. Choose diagonal configuration:
   - **No Diagonals:** Only horizontal/vertical movement (4-way)
   - **Short Diagonals (Standard):** Includes diagonal connections in each square (8-way)
   - **All Diagonals:** Includes long diagonals across the entire grid
3. Each player receives N paperballs
4. Minimum grid size is 3×3; 5×5 is recommended for a good game

### Phase 1: Placement
- Players alternate turns placing one paperball at a time
- Paperballs can only be placed on empty grid vertices/points
- Continue until all paperballs are placed on the grid

### Phase 2: Movement
- Players continue to alternate turns
- On each turn, a player **must** move one of their paperballs
- A paperball can move to an **adjacent** empty vertex
- Adjacent vertices are connected by a grid line (horizontal, vertical, or diagonal) with no other points in between
- **Restrictions:**
  - Cannot jump over any balls (your own or opponent's)
  - Cannot replace or capture opponent's balls
  - Must make a move if one is available

### Victory Condition
A player wins by forming a straight line with their paperballs in any direction:
- Horizontal
- Vertical
- Diagonal

## Project Goals

1. ✅ Document the rules and gameplay
2. ✅ Create a playable web version (hosted on dhanjit.me)
3. ✅ Implement AI opponent with multiple difficulty levels
4. ✅ Add comprehensive test suite (129 tests, 96%+ coverage)
5. ✅ Write a blog post documenting the development process

## Getting Started

### Play the Web Version

**Live Game:**
```
https://dhanjit.me/paperballs/
```

**Local Development:**
```bash
# Clone the repository
git clone https://github.com/dhanjit/paperballs.git
cd paperballs/web

# Open in browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

## CI/CD & Automation

This project uses GitHub Actions for:
- **Continuous Integration**: Automated code validation on every push
- **Releases**: Automatic package creation when tags are pushed
- **Health Checks**: Weekly project monitoring

**Deployment**: The web version is integrated into [dhanjit.me](https://dhanjit.me) via an automated build script that copies files from this repository

See [.github/workflows/README.md](.github/workflows/README.md) for workflow details.

## Development

This project is a recreation of a childhood game, preserving the simple yet strategic gameplay in an accessible web-based format.

### Project Structure
```
paperballs/
├── web/          # Browser-based version
├── docs/         # Documentation
└── .github/      # CI/CD workflows
```

### Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your memories of similar games

**For Maintainers:** See [RELEASE.md](RELEASE.md) for the release process.

## AI Collaboration

This project was developed with assistance from Claude AI. See [CLAUDE.md](CLAUDE.md) for full transparency about the AI's role in development.

## License

MIT License - See LICENSE file for details
