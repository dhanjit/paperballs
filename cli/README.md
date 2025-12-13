# Paperballs - Terminal/CLI Version

A command-line implementation of the Paperballs game.

## Requirements

- Python 3.7 or higher
- No external dependencies (uses only Python standard library)

## Installation

No installation required! Just run the Python script:

```bash
python3 paperballs.py
```

Or make it executable:

```bash
chmod +x paperballs.py
./paperballs.py
```

## How to Play

### Starting the Game

1. Run the script
2. Choose grid size (minimum 3, recommended 5)
3. The game will display an empty grid

### Grid Notation

- Player 1 is represented by `X`
- Player 2 is represented by `O`
- Empty positions are shown as `·`
- Positions are identified by row and column numbers (starting from 0)

Example 3×3 grid:
```
   0  1  2
0  ·  ·  ·
1  ·  ·  ·
2  ·  ·  ·
```

### Phase 1: Placement

Players take turns placing balls on empty grid positions.

**Input format:** `row col`

Example:
```
Enter position to place ball (row col): 2 2
```

This places a ball at row 2, column 2 (bottom-right in a 3×3 grid).

### Phase 2: Movement

After all balls are placed, players take turns moving their balls.

**Input format:** `from_row from_col to_row to_col`

Example:
```
Enter move (from_row from_col to_row to_col): 2 2 2 1
```

This moves your ball from position (2,2) to position (2,1).

**Movement Rules:**
- Can only move to adjacent empty positions
- Adjacent means connected by a grid line (horizontal, vertical, or diagonal)
- Cannot jump over any balls
- Must move one ball per turn

### Winning

Form a straight line with all your balls (horizontal, vertical, or diagonal).

### Commands

- `quit`, `exit`, or `q`: Exit the game
- `Ctrl+C`: Exit the game

## Examples

### Example Game (3×3 Grid)

**Placement Phase:**
```
   0  1  2
0  ·  ·  ·
1  ·  X  ·
2  ·  ·  ·

Player 1 placed at (1,1)
```

**Movement Phase:**
```
   0  1  2
0  X  ·  ·
1  X  O  O
2  X  ·  ·

Player 1 (X) has won with a vertical line!
```

## Tips

- Think ahead during placement - position matters!
- Corner positions are harder to move from
- Center positions offer more flexibility
- Block your opponent while building your line

## Troubleshooting

### Invalid Input
Make sure you enter numbers separated by spaces:
- Placement: `row col` (e.g., `2 3`)
- Movement: `from_row from_col to_row to_col` (e.g., `2 3 2 4`)

### Position Already Occupied
You can only place balls on empty positions (shown as `·`)

### Not Adjacent
You can only move to positions directly next to your ball (8 surrounding positions)

## Features

- ✅ Full game implementation
- ✅ Input validation
- ✅ Win detection
- ✅ Clear visual feedback
- ✅ Both placement and movement phases

## Future Enhancements

- [ ] Move validation preview
- [ ] Undo/redo moves
- [ ] Save/load games
- [ ] AI opponent
- [ ] Colorized output
- [ ] Game replay
