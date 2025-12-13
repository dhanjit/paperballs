# Paperballs - Project Structure

## Directory Layout

```
paperballs/
├── README.md                 # Main project documentation
├── RULES.md                  # Detailed game rules
├── PROJECT_STRUCTURE.md      # This file
├── LICENSE                   # MIT License
│
├── cli/                      # Terminal/CLI version
│   ├── paperballs.py        # Python implementation
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # CLI-specific documentation
│
├── web/                      # Web browser version
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── style.css        # Styling
│   ├── js/
│   │   ├── game.js          # Core game logic
│   │   ├── ui.js            # UI rendering
│   │   └── main.js          # Entry point
│   └── README.md            # Web version documentation
│
├── mobile/                   # Mobile app (future)
│   └── README.md            # Mobile development plans
│
└── docs/                     # Blog posts and documentation
    └── development-log.md   # Development process blog
```

## Technology Stack

### CLI Version
- **Language:** Python 3.x
- **Why:** Simple, readable, great for terminal interfaces
- **Dependencies:** Minimal (possibly just standard library)

### Web Version
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Why:** No build step needed, easy to host on dhanjit.me
- **Future:** Could migrate to React if needed for more complex features

### Mobile Version (Planned)
- **Framework:** React Native (TBD)
- **Why:** Code sharing with web version, cross-platform support
- **Alternative:** Native development (Swift/Kotlin) for best performance

## Development Phases

### Phase 1: Core Game Logic ✅
- [x] Document rules
- [ ] Implement game logic (CLI version)
- [ ] Test gameplay mechanics

### Phase 2: Terminal Version
- [ ] Create playable CLI version
- [ ] Add input validation
- [ ] Polish user experience

### Phase 3: Web Version
- [ ] Design UI/UX
- [ ] Implement interactive grid
- [ ] Add animations and visual feedback
- [ ] Deploy to dhanjit.me

### Phase 4: Mobile Apps
- [ ] Choose framework
- [ ] Port game logic
- [ ] Design mobile UI
- [ ] Publish to app stores

### Phase 5: Documentation
- [ ] Write development blog post
- [ ] Create video walkthrough
- [ ] Document lessons learned

## Code Sharing Strategy

The core game logic (grid management, move validation, win detection) should be:
1. First implemented in Python (CLI)
2. Then ported to JavaScript (for web)
3. Shared between web and mobile versions

Key modules to implement:
- `GameState`: Track current board state
- `MoveValidator`: Check if moves are legal
- `WinDetector`: Check for victory conditions
- `GridManager`: Handle grid operations
