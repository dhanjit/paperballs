# Paperballs: Recreating a Childhood Game

A development blog documenting the journey from childhood memories to a playable digital game.

---

## Introduction: Rediscovering Lost Games

We've all had them - those games we invented as children, played endlessly with friends, and then forgot as we grew older. **Paperballs** is one such game for me. A simple yet strategic two-player game played on a grid with, you guessed it, paperballs.

Recently, I decided to recreate this game and share it with the world. This blog post documents the entire process, from recovering half-forgotten rules to building playable versions across multiple platforms.

---

## Phase 1: Remembering the Rules

### The Challenge of Memory

The first challenge wasn't technical - it was archaeological. I had to dig through decades-old memories to reconstruct the game rules. Some details came back clearly, others required educated guesses.

### What I Remembered

**The basics were clear:**
- Two players (possibly three?)
- Each player gets N paperballs
- Played on an N×N square grid
- The goal: form a straight line

**The mechanics emerged gradually:**
- The game has two phases: placement and movement
- During placement, players alternate placing balls on grid vertices
- During movement, players move balls to adjacent vertices
- "Adjacent" means connected by a grid line (horizontal, vertical, or diagonal)
- You can't jump over balls or capture them

**What I'm still unsure about:**
- Three-player variant (did it exist?)
- Stalemate rules (what if no one can move?)
- Were there any special rules I forgot?

### Documentation First

Before writing any code, I documented everything I remembered in `RULES.md`. This served two purposes:
1. Created a reference for implementation
2. Preserved the game rules for others to learn and potentially help me remember more

Key insight: **Documentation is not separate from development - it's the foundation.**

---

## Phase 2: Terminal Version - Proving the Concept

### Why Start with CLI?

I chose to build a terminal version first for several reasons:

1. **Fast iteration** - No UI complications
2. **Rule validation** - Quickly test if the rules actually make a fun game
3. **Logic foundation** - Core game engine that can be ported to other platforms
4. **Nostalgia** - Command-line games have a charm of their own

### Technology Choice: Python

Python was the obvious choice for the CLI version:
- Quick to write
- Excellent for terminal interfaces
- Readable code (important for a game that needs clear logic)
- No compilation step

### Implementation Highlights

**Game State Management**
```python
class Paperballs:
    def __init__(self, n: int = 5):
        self.n = n
        self.grid = [[None for _ in range(n)] for _ in range(n)]
        self.current_player = 1
        self.phase = "placement"  # or "movement"
```

**Move Validation**
The trickiest part was validating moves. A move is valid if:
1. It's to an adjacent vertex
2. The destination is empty
3. You don't jump over any balls

**Win Detection**
Check all possible lines:
- N horizontal lines
- N vertical lines
- 2 diagonal lines

### Lessons Learned

**The rules needed refinement:**
- Initially, I forgot to specify that you MUST move each turn
- The "no jumping" rule needed clarification
- Edge cases emerged (What if someone can't move?)

**Playing revealed balance:**
- 3×3 is too simple
- 5×5 is the sweet spot
- Larger grids make for longer, more strategic games

---

## Phase 3: Web Version - Making it Accessible

### Design Goals

The web version needed to be:
- **Accessible** - Playable on any device
- **Visual** - Clear, attractive interface
- **Responsive** - Works on mobile and desktop
- **Hostable** - Easy to deploy to my website

### Technology Stack: Vanilla JavaScript

**Why no framework?**
- No build step required
- Easy to host anywhere
- Lightweight and fast
- Full control over every detail

**What I used:**
- HTML5 for structure
- CSS3 for styling (Grid, Flexbox, animations)
- Vanilla JavaScript (ES6+) for logic
- SVG for the game board

### Architecture

**Three-layer design:**

1. **Game Logic** (`game.js`)
   - Pure JavaScript classes
   - No DOM dependencies
   - Testable and portable

2. **UI Layer** (`ui.js`)
   - SVG rendering
   - Visual feedback
   - User interface updates

3. **Application** (`main.js`)
   - Event handling
   - Glues everything together

### SVG for the Game Board

Using SVG for the grid was a game-changer:
- Scalable to any size
- Easy to draw lines and circles
- CSS styling works great
- Responsive by default

```javascript
// Draw a vertex
const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
);
circle.setAttribute('cx', x);
circle.setAttribute('cy', y);
circle.setAttribute('r', radius);
```

### UX Enhancements

**Visual feedback everywhere:**
- Highlight valid moves when a ball is selected
- Show which player's turn it is
- Display current phase clearly
- Celebrate the winner

**Touch-friendly:**
- Large click targets
- Clear hover states
- Works on mobile devices

### Challenges Overcome

**SVG Coordinates**
Converting grid coordinates to SVG coordinates required careful math:
```javascript
gridToSvg(row, col) {
    return {
        x: margin + col * cellSize,
        y: margin + row * cellSize
    };
}
```

**Event Handling**
Handling clicks on SVG elements needed special attention - had to bubble up from circle to group to get the right data.

**Diagonal Lines**
Drawing all the diagonal grid lines correctly took some iteration - off-by-one errors everywhere!

---

## Phase 4: Mobile Planning

### The Next Frontier

Mobile apps are the natural next step. People play games on their phones, after all.

### Technology Decision: React Native

After considering native development (Swift/Kotlin) and React Native, I chose **React Native** because:

**Pros:**
- Can share game logic with web version
- Single codebase for iOS and Android
- Faster development
- Still feels native

**Trade-offs:**
- Slightly larger app size
- Some platform-specific features might need native modules
- Performance overhead (though minimal for this game)

### Mobile-Specific Considerations

**Touch Controls**
- Larger touch targets (44×44 points minimum)
- Haptic feedback on moves
- Gesture support (tap to place, tap to select, tap to move)

**Screen Sizes**
- Support portrait and landscape
- Handle different screen sizes (phones, tablets)
- Respect safe areas (notches, home indicators)

**Platform Conventions**
- iOS: Navigation patterns, modals
- Android: Material Design, back button behavior

### Feature Roadmap

**MVP:**
- Core game (same as web)
- Touch-optimized controls
- Local two-player

**Future Enhancements:**
- AI opponent
- Online multiplayer
- Game statistics
- Achievements
- Themes

---

## Technical Insights

### Code Reusability

One major win: The game logic is nearly identical across platforms.

**Python (CLI):**
```python
def check_winner(self):
    for player in [1, 2]:
        # Check all lines...
```

**JavaScript (Web):**
```javascript
checkWinner() {
    for (let player of [1, 2]) {
        // Check all lines...
    }
}
```

The algorithms are the same, just different syntax. This made porting fast and reduced bugs.

### State Management

Keeping game state simple was key:
- Grid (2D array)
- Current player
- Current phase
- Selected ball (if any)

No complex state machine needed - just clear transitions.

### Testing the Rules

Building playable versions quickly revealed rule issues:
- Can you pass your turn? (No - you must move)
- What if you can't move? (Game needs stalemate detection)
- How many balls for a 4×4 grid? (4 each - N balls for N×N grid)

**Takeaway: Play your own game early and often.**

---

## Design Decisions

### Why a Grid?

The original game used a hand-drawn grid on paper. I preserved this because:
- It's familiar to players who remember the original
- Grid-based games are naturally discrete (no physics edge cases)
- Clear, unambiguous positions

### Color Scheme

I chose a vibrant gradient background with clean white panels:
- Modern look
- Professional feel
- Game boards pop against the background
- Accessible contrast

Player colors:
- Player 1: Red (#e74c3c) - Classic, assertive
- Player 2: Blue (#3498db) - Cool, strategic

### Responsive Everything

Every version adapts to its context:
- **CLI:** Works in any terminal size
- **Web:** Responsive design, mobile-friendly
- **Mobile (planned):** Native platform conventions

---

## Challenges and Solutions

### Challenge 1: Diagonal Lines

Drawing all the diagonal grid lines correctly was surprisingly tricky.

**Problem:**
```
For an N×N grid, how many diagonals are there?
```

**Solution:**
Two nested loops - one for top-left to bottom-right, one for top-right to bottom-left:
```javascript
// Top-left to bottom-right
for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
        drawLine(i, j, i+1, j+1);
    }
}
```

### Challenge 2: Move Validation

Ensuring moves are valid required checking multiple conditions.

**The Rules:**
1. Destination must be adjacent
2. Destination must be empty
3. Can't jump over balls

**The Implementation:**
```javascript
getAdjacentPositions(row, col) {
    const directions = [
        [-1,-1], [-1,0], [-1,1],
        [0,-1],          [0,1],
        [1,-1],  [1,0],  [1,1]
    ];
    return directions
        .map(([dr,dc]) => [row+dr, col+dc])
        .filter(([r,c]) => isValid(r,c));
}
```

### Challenge 3: Win Detection

Checking for a winner means checking many possible lines.

**Approach:**
Create arrays of positions for each possible line, then check if all positions belong to the same player.

```javascript
// Check horizontal line
positions = [(row, 0), (row, 1), ..., (row, n-1)]
if (all positions are player X) → player X wins
```

---

## What I Learned

### 1. Documentation First

Writing the rules down before coding forced me to think through edge cases. Every time I wrote code and thought "wait, what happens if...", I updated the docs.

**Result:** Clear rules that can be understood without playing the game.

### 2. Start Simple

The CLI version took a few hours and proved the game worked. Trying to build the web version first would have been overwhelming.

**Result:** Quick validation, faster iteration.

### 3. Separation of Concerns

Keeping game logic separate from UI made everything easier:
- Easier to test
- Easier to port
- Easier to understand

**Result:** The web version reuses 80% of the structure from the CLI version.

### 4. Play Your Own Game

I found several rule issues by actually playing:
- Forgot "must move" rule
- Realized 3×3 is too simple
- Discovered edge cases in move validation

**Result:** Better, more balanced game.

### 5. Modern Vanilla JS is Powerful

I didn't need React or Vue for this. Modern JavaScript with ES6+ features is expressive and powerful.

**Result:** Zero build step, zero dependencies, instant loading.

---

## Future Enhancements

### Short Term
- [ ] Deploy web version to dhanjit.me
- [ ] Add animations to piece movement
- [ ] Sound effects (optional/mutable)
- [ ] Undo/redo functionality

### Medium Term
- [ ] Build React Native mobile apps
- [ ] AI opponent with difficulty levels
- [ ] Game statistics tracking
- [ ] Tutorial for new players

### Long Term
- [ ] Online multiplayer
- [ ] Leaderboards
- [ ] Tournament mode
- [ ] Game variants (different winning conditions)

---

## Reflections

### Why Recreate Old Games?

There's something special about childhood games:
- They're pure - created for fun, not profit
- They're organic - evolved through play, not designed on paper
- They're forgotten - hidden gems waiting to be rediscovered

By digitizing Paperballs, I'm preserving a piece of childhood and sharing it with others.

### The Joy of Simple Games

Paperballs doesn't have:
- Complex rules
- Fancy graphics
- Microtransactions
- Season passes

It has:
- Clear objective
- Strategic depth
- Quick gameplay
- Pure player skill

Sometimes simple is better.

### Open Source Philosophy

This project is fully open source because:
- Games should be shared
- Code should be learned from
- Communities improve everything

If you remember playing a similar game, or have suggestions for rules I might have forgotten, **please contribute!**

---

## Getting Started

### Play Now

**Terminal/CLI Version:**
```bash
git clone https://github.com/dhanjit/paperballs.git
cd paperballs/cli
python3 paperballs.py
```

**Web Version:**
```bash
# Just open web/index.html in a browser
# Or visit: https://dhanjit.me/paperballs/
```

### Contribute

Found a bug? Remember an old rule? Have an idea?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Technical Stack Summary

| Version | Language | Framework | Purpose |
|---------|----------|-----------|---------|
| CLI | Python 3 | None | Quick prototype, logic validation |
| Web | JavaScript | Vanilla | Browser play, widest reach |
| Mobile | React Native | (Planned) | Native apps, mobile-optimized |

---

## Conclusion

Recreating Paperballs has been a journey through:
- Memory and nostalgia
- Game design and balance
- Multi-platform development
- Open source collaboration

The game that started on notebook paper in childhood is now playable on any device. And the best part? **You can play it right now.**

I hope this inspires you to:
- Recreate your own childhood games
- Document forgotten rules before they're lost
- Share your creations with the world

Because every game, no matter how simple, deserves to be remembered.

---

## Links

- **Play Online:** [dhanjit.me/paperballs](https://dhanjit.me/paperballs)
- **Source Code:** [github.com/dhanjit/paperballs](https://github.com/dhanjit/paperballs)
- **My Website:** [dhanjit.me](https://dhanjit.me)

---

**Published:** December 2025
**Last Updated:** December 2025
**Author:** Dhanjit

*Have you played a game like this before? Do you remember other childhood games that should be preserved? Let me know!*

---
---

# Development Log (Append-Only)

This section contains chronological development notes for AI collaboration continuity.

---

## 2025-12-13 - Configurable Diagonal Movement Options

**Context:** User recalled that the original childhood game supported different diagonal configurations, not just the standard 8-way movement that was initially implemented.

**Changes Made:**
- `web/js/game.js`: Added `diagonalMode` parameter to PaperballsGame constructor, updated `getAdjacentPositions()` to calculate valid moves based on selected mode
- `web/js/ui.js`: Modified `drawGridLines()` to conditionally draw diagonal lines based on mode (none/short/all), added dashed lines for long diagonals
- `web/index.html`: Added diagonal mode dropdown selector to setup controls
- `web/css/style.css`: Updated setup controls layout with `.setup-option` class
- `web/js/main.js`: Updated `initGame()` to pass diagonal mode from UI to game constructor
- `cli/paperballs.py`: Added `diagonal_mode` parameter to constructor, updated `get_adjacent_positions()`, added interactive mode selection in `main()`
- `RULES.md`: Added "Diagonal Options" section documenting all three modes with ASCII visual examples
- `README.md`: Updated Quick Start and Setup sections to mention diagonal configuration

**Decisions & Rationale:**
- **Three modes chosen:** 
  - `none`: 4-way movement (orthogonal only) - simplest, good for beginners
  - `short`: 8-way movement (standard) - includes adjacent diagonals, balanced gameplay
  - `all`: Includes long diagonals across entire grid - advanced, more strategic complexity
- **Default to 'short':** Maintains backward compatibility with initial implementation and represents the "standard" game
- **Visual distinction:** Long diagonals rendered as dashed lines in web version to distinguish from short diagonals
- **Feature parity:** Both CLI and web versions support all three modes identically
- **Long diagonals in 'all' mode:** Include both diagonal (corner-to-corner) and extended orthogonal connections to allow movement across entire board

**Impact:**
- Increases gameplay variety and replayability
- Provides beginner-friendly option without diagonal complexity
- Enables advanced strategic play with all diagonals
- Maintains consistency across platform implementations
- Well-documented with visual examples in RULES.md

**Commit:** bd288d2

