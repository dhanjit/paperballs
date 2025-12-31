# Paperballs - Detailed Rules

## Game Components

### Grid
- Square grid with N×N vertices (intersection points)
- Minimum size: 3×3 (9 vertices)
- Recommended size: 5×5 (25 vertices)
- Vertices are connected by horizontal, vertical, and optionally diagonal lines
- **Diagonal Configuration:** The number and type of diagonal connections can be configured

### Paperballs
- Each player receives N paperballs (where N = grid dimension)
- Paperballs are distinguishable by player (e.g., different colors)
- For a 5×5 grid, each player has 5 paperballs

## Setup

1. Draw or create an N×N grid
2. Choose diagonal configuration (see Diagonal Options below)
3. Mark all vertices clearly
4. Decide who goes first (coin flip, mutual agreement, etc.)
5. Each player takes their N paperballs

### Diagonal Options

The grid can be configured with different diagonal connections:

**Option 1: No Diagonals**
- Only horizontal and vertical lines connect vertices
- Balls can only move up, down, left, right
- Simplest configuration, good for beginners

**Option 2: Short Diagonals (Standard)**
- Horizontal, vertical, AND diagonal lines in each unit square
- Each vertex connects to up to 8 neighbors (orthogonal + diagonal)
- Most common configuration, balanced gameplay

**Option 3: All Diagonals**
- Includes short diagonals PLUS long diagonals across the entire grid
- More movement options and strategic complexity
- Example: In a 5×5 grid, corners connect diagonally across the whole board

**Option 4: Custom**
- Select specific diagonal connections
- Advanced configuration for experienced players

**Recommendation:** Start with **Short Diagonals (Standard)** for your first games.

## Gameplay

### Phase 1: Placement Phase

**Objective:** Place all paperballs onto the grid

**Rules:**
1. Players alternate turns
2. On your turn, place exactly one paperball on any empty vertex
3. Once placed, the ball stays there until Phase 2
4. Continue until all paperballs (from both players) are on the grid

**Example (3×3 grid):**
```
Turn 1: Player 1 places ball at center
Turn 2: Player 2 places ball at top-left corner
Turn 3: Player 1 places ball at bottom-right
...and so on
```

### Phase 2: Movement Phase

**Objective:** Move your paperballs to form a winning line

**Rules:**
1. Players continue to alternate turns
2. On your turn, you **must** move exactly one of your paperballs
3. Move to an adjacent empty vertex only

**Adjacency:**
Two vertices are adjacent if:
- They are connected by a grid line (horizontal, vertical, or diagonal)
- There are no other vertices between them

**Example of adjacent vertices on a grid:**
```
For vertex at position (2,2) on a 5×5 grid:
Adjacent vertices are at:
(1,1), (1,2), (1,3)
(2,1),  [X],  (2,3)
(3,1), (3,2), (3,3)
```

**Movement Restrictions:**
- ❌ Cannot move to an occupied vertex
- ❌ Cannot jump over any ball (yours or opponent's)
- ❌ Cannot capture or remove opponent's balls
- ❌ Cannot skip your turn (must move if possible)

**What "cannot jump" means:**
If there's a ball between your current position and the target position, you cannot move there, even if the target is empty.

Example:
```
. - O - .

If 'O' is in the middle, you cannot move from left dot to right dot
because you would have to "jump over" the ball.
```

## Victory Condition

**A player wins by forming a straight line of their paperballs.**

Valid winning lines:
- **Horizontal:** N paperballs in a row
- **Vertical:** N paperballs in a column
- **Diagonal:** N paperballs in a diagonal line

The line must use all N of your paperballs.

**Example winning positions (3×3 grid, each player has 3 balls):**

Horizontal win:
```
X - X - X
. - O - .
O - . - O
```

Vertical win:
```
X - O - .
X - O - .
X - . - .
```

Diagonal win:
```
X - . - O
O - X - .
. - . - X
```

## Special Cases & Clarifications

### Stalemate
If a player cannot make any legal move (all their paperballs are completely blocked), the game may be declared a draw, or that player loses. **[TODO: Clarify from childhood rules]**

### Three Players
The original game may have supported three players, but the exact rules for 3-player mode are not yet recalled. **[TODO: Remember 3-player variant]**

### Questions Still Being Remembered

1. What happens if a player cannot move?
2. Can the game end in a draw?
3. Are there any other special rules or variations?
4. How exactly did 3-player mode work?

## Strategy Tips

- During placement, think about both your formation and blocking opponents
- Corner and edge positions can be harder to move from
- Center positions offer more movement flexibility
- Plan ahead - every move should work toward forming your line

## Game Duration

- **3×3 grid:** Quick games (5-10 minutes)
- **5×5 grid:** Medium games (10-20 minutes)
- **Larger grids:** Longer, more strategic games

## Variations to Consider

- Different grid sizes (4×4, 6×6, etc.)
- Different diagonal configurations (no diagonals, short, all, custom)
- Different winning conditions (e.g., 4 in a row instead of N)
- Timed moves
- Allow passing under certain conditions

## Grid Configuration Examples

### 3×3 Grid with Short Diagonals
```
● ─ ● ─ ●
│╲ │ ╱│
│ ╲│╱ │
● ─ ● ─ ●
│╱ │ ╲│
│ ╱│╲ │
● ─ ● ─ ●
```
Each vertex connects to 8 neighbors (or fewer at edges)

### 3×3 Grid with All Diagonals
```
● ═ ● ═ ●
║╲╳╱║
║ ╳ ║
● ═ ● ═ ●
║╱╳╲║
║ ╳ ║
● ═ ● ═ ●
```
Includes long diagonals connecting opposite corners

### 3×3 Grid with No Diagonals
```
● ─ ● ─ ●
│   │   │
│   │   │
● ─ ● ─ ●
│   │   │
│   │   │
● ─ ● ─ ●
```
Only horizontal and vertical connections
