# Development Log (Technical)

Append-only chronicle of development decisions and changes for AI collaboration continuity.

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
