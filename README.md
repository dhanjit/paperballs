# Paperballs

A childhood game recreated - a strategic two-player game combining placement and movement mechanics.

## Overview

Paperballs is a two-player strategy game played on a square grid. Players take turns placing and then moving their paperballs, aiming to form a straight line to win.

## Quick Start

- **Players:** 2 (possibly 3)
- **Grid Size:** N×N vertices (minimum N=3, recommended N=5)
- **Pieces:** Each player gets N paperballs
- **Objective:** Form a straight line (horizontal, vertical, or diagonal) with your paperballs

## Game Rules

### Setup
1. Create an N×N square grid (N points on each side)
2. Each player receives N paperballs
3. Minimum grid size is 3×3; 5×5 is recommended for a good game

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
2. ⬜ Create a playable web version (hosted on dhanjit.me)
3. ⬜ Develop a terminal/CLI version
4. ⬜ Create mobile apps
5. ⬜ Write a blog post documenting the development process

## Versions

- **Terminal/CLI:** Play in your command line
- **Web:** Browser-based version with interactive UI
- **Mobile:** Native apps for iOS and Android (planned)

## Development

This project is a recreation of a childhood game, preserving the simple yet strategic gameplay while making it accessible across different platforms.

## License

MIT License - See LICENSE file for details
