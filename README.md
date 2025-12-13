# Paperballs

![CI](https://github.com/dhanjit/paperballs/workflows/CI/badge.svg)
![Release](https://github.com/dhanjit/paperballs/workflows/Release/badge.svg)
![GitHub Pages](https://github.com/dhanjit/paperballs/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)

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
2. ✅ Create a playable web version (hosted on dhanjit.me)
3. ✅ Develop a terminal/CLI version
4. ⬜ Create mobile apps
5. ✅ Write a blog post documenting the development process

## Versions

- **Terminal/CLI:** Play in your command line
- **Web:** Browser-based version with interactive UI
- **Mobile:** Native apps for iOS and Android (planned)

## Getting Started

### Play the Web Version

**Option 1: GitHub Pages (Live)**
```
https://dhanjit.github.io/paperballs/
```

**Option 2: Local**
```bash
# Clone the repository
git clone https://github.com/dhanjit/paperballs.git
cd paperballs/web

# Open in browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### Play the Terminal Version

```bash
# Navigate to CLI directory
cd paperballs/cli

# Run the game (requires Python 3.7+)
python3 paperballs.py
```

## CI/CD & Automation

This project uses GitHub Actions for:
- **Continuous Integration**: Automated code validation on every push
- **Releases**: Automatic package creation when tags are pushed
- **Deployment**: Auto-deploy web version to GitHub Pages
- **Health Checks**: Weekly project monitoring

See [.github/workflows/README.md](.github/workflows/README.md) for details.

## Release Process

Creating a new release is fully automated. Just push a version tag and GitHub Actions handles the rest!

### Quick Release

```bash
# 1. Ensure all changes are committed
git add .
git commit -m "Prepare for release v1.0.0"
git push

# 2. Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial public release"
git push origin v1.0.0

# 3. Wait ~2 minutes for GitHub Actions to complete
# 4. Check https://github.com/dhanjit/paperballs/releases for your release!
```

### What Gets Created

When you push a version tag (e.g., `v1.0.0`), the release workflow automatically:

1. **Creates 5 downloadable packages:**
   - `paperballs-cli-v1.0.0.zip` - Terminal version (zip)
   - `paperballs-cli-v1.0.0.tar.gz` - Terminal version (tar.gz)
   - `paperballs-web-v1.0.0.zip` - Web version (zip)
   - `paperballs-web-v1.0.0.tar.gz` - Web version (tar.gz)
   - `paperballs-complete-v1.0.0.zip` - Complete source code

2. **Generates release notes** with:
   - Download instructions
   - Feature highlights
   - How to play guide
   - Documentation links

3. **Publishes to GitHub Releases** at:
   ```
   https://github.com/dhanjit/paperballs/releases
   ```

### Version Numbering

Follow [Semantic Versioning](https://semver.org/) guidelines:

- **Major version** (`v2.0.0`): Breaking changes or major new features
- **Minor version** (`v1.1.0`): New features, backward compatible
- **Patch version** (`v1.0.1`): Bug fixes, backward compatible

Examples:
```bash
# Initial release
git tag -a v1.0.0 -m "Initial public release"

# Bug fix
git tag -a v1.0.1 -m "Fix movement validation bug"

# New feature
git tag -a v1.1.0 -m "Add AI opponent feature"

# Breaking change
git tag -a v2.0.0 -m "Redesign game API"
```

### Pre-releases

For beta or alpha versions:

```bash
# Beta release
git tag -a v1.0.0-beta.1 -m "Beta release for testing"
git push origin v1.0.0-beta.1

# Alpha release
git tag -a v2.0.0-alpha.1 -m "Alpha preview of v2"
git push origin v2.0.0-alpha.1
```

### Managing Tags

```bash
# List all tags
git tag

# Delete a local tag
git tag -d v1.0.0

# Delete a remote tag
git push origin --delete v1.0.0

# View tag details
git show v1.0.0
```

### Workflow Monitoring

Track release progress at:
```
https://github.com/dhanjit/paperballs/actions/workflows/release.yml
```

The workflow typically completes in 1-2 minutes.

## Development

This project is a recreation of a childhood game, preserving the simple yet strategic gameplay while making it accessible across different platforms.

### Project Structure
```
paperballs/
├── cli/          # Python terminal version
├── web/          # Browser-based version
├── mobile/       # Mobile app plans
├── docs/         # Documentation and blog
└── .github/      # CI/CD workflows
```

### Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your memories of similar games

## AI Collaboration

This project was developed with assistance from Claude AI. See [CLAUDE.md](CLAUDE.md) for full transparency about the AI's role in development.

## License

MIT License - See LICENSE file for details
