# Paperballs - Web Version

An interactive browser-based version of Paperballs.

## Features

- ✅ Fully playable in any modern web browser
- ✅ Interactive grid with visual feedback
- ✅ Configurable grid sizes (3×3 to 7×7)
- ✅ Clear game phases (placement and movement)
- ✅ Move validation and highlighting
- ✅ Winner detection and announcement
- ✅ Responsive design for mobile and desktop

## Technology Stack

- **HTML5:** Semantic markup
- **CSS3:** Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+):** No frameworks needed
- **SVG:** Scalable game board graphics

## Files

- `index.html` - Main HTML structure
- `css/style.css` - Styling and animations
- `js/game.js` - Core game logic
- `js/ui.js` - UI rendering and management
- `js/main.js` - Application entry point and event handling

## How to Use

### Local Development

1. Open `index.html` in a web browser
2. No build process or server needed!

### Deployment

#### Option 1: GitHub Pages
```bash
# Just push to GitHub and enable GitHub Pages
git add .
git commit -m "Add web version"
git push
# Enable GitHub Pages in repository settings
```

#### Option 2: Simple HTTP Server
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# Then visit http://localhost:8000
```

#### Option 3: Deploy to dhanjit.me
Simply copy all files in the `web/` directory to your web server.

### Hosting on dhanjit.me

To host on your website:

1. **Upload files:**
   ```bash
   # Copy to your web server
   scp -r web/* user@dhanjit.me:/var/www/html/paperballs/
   ```

2. **Access the game:**
   Visit `https://dhanjit.me/paperballs/`

3. **Optional - Add to your main site:**
   Add a link from your homepage:
   ```html
   <a href="/paperballs/">Play Paperballs</a>
   ```

## Game Structure

### Classes

**PaperballsGame** (`game.js`)
- Core game logic
- State management
- Move validation
- Win detection

**PaperballsUI** (`ui.js`)
- SVG board rendering
- Visual feedback
- User interface updates
- Winner announcement

**Main Application** (`main.js`)
- Event handling
- Game initialization
- User interaction

## Customization

### Changing Colors

Edit `css/style.css` CSS variables:
```css
:root {
    --player1-color: #e74c3c; /* Player 1 ball color */
    --player2-color: #3498db; /* Player 2 ball color */
    /* ... other colors */
}
```

### Adding Grid Sizes

Edit `index.html`:
```html
<select id="gridSize">
    <option value="3">3×3</option>
    <!-- Add more options -->
    <option value="10">10×10</option>
</select>
```

### Adjusting Board Size

Edit `ui.js`:
```javascript
constructor(game) {
    this.cellSize = 80;  // Distance between vertices
    this.margin = 50;    // Margin around board
    this.vertexRadius = 10; // Size of vertex circles
}
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Animations for piece movement
- [ ] Sound effects
- [ ] Undo/redo functionality
- [ ] Game history/replay
- [ ] AI opponent
- [ ] Online multiplayer
- [ ] Touch gestures for mobile
- [ ] Save game state to localStorage
- [ ] Game statistics tracking
- [ ] Themes/skins

## Performance

The web version is optimized for smooth performance:
- Minimal DOM manipulation
- SVG for scalable graphics
- Efficient event handling
- No external dependencies

## Accessibility

- Keyboard navigation support (planned)
- Screen reader compatibility (planned)
- High contrast mode (planned)
- Customizable colors

## License

MIT License - See main LICENSE file
