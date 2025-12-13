# Paperballs - Mobile Apps

Planning and development for native mobile applications.

## Overview

This directory will contain mobile applications for Paperballs, bringing the game to iOS and Android platforms.

## Planned Platforms

### iOS
- **Target:** iOS 14.0+
- **Development:** Swift + SwiftUI
- **Distribution:** App Store

### Android
- **Target:** Android 8.0+ (API Level 26)
- **Development:** Kotlin + Jetpack Compose
- **Distribution:** Google Play Store

## Technology Options

### Option 1: React Native (Recommended)
**Pros:**
- Code sharing with web version
- Single codebase for iOS and Android
- Fast development
- Large community and ecosystem
- Can reuse game logic from web version

**Cons:**
- Slightly larger app size
- Performance overhead (minimal for this game)
- Need to maintain native modules if required

**Tech Stack:**
- React Native
- TypeScript
- React Navigation
- Async Storage (for game saves)

### Option 2: Native Development
**Pros:**
- Best performance
- Full access to platform features
- Best user experience
- Smaller app size

**Cons:**
- Separate codebases for iOS and Android
- Longer development time
- Need to maintain two apps

**Tech Stack:**
- **iOS:** Swift, SwiftUI, Combine
- **Android:** Kotlin, Jetpack Compose, Coroutines

### Option 3: Flutter
**Pros:**
- Single codebase
- Fast performance (compiled to native)
- Beautiful UI out of the box
- Growing ecosystem

**Cons:**
- Different language (Dart)
- Cannot share code with web version
- Need to rewrite game logic

## Recommended Approach

**Phase 1:** React Native prototype
- Quick to develop
- Code sharing with web
- Validate mobile UX

**Phase 2:** Consider native if needed
- Only if performance issues arise
- Or if platform-specific features required

## Features

### Core Features (MVP)
- [ ] Interactive game board
- [ ] Touch controls optimized for mobile
- [ ] Two-player local gameplay
- [ ] Win detection and celebration
- [ ] Game state persistence
- [ ] Settings (grid size, etc.)

### Enhanced Features
- [ ] Single-player vs AI
- [ ] Multiple difficulty levels
- [ ] Game statistics and history
- [ ] Achievements
- [ ] Tutorial/onboarding
- [ ] Haptic feedback
- [ ] Sound effects and music
- [ ] Themes/skins

### Social Features
- [ ] Online multiplayer
- [ ] Friend challenges
- [ ] Leaderboards
- [ ] Share game results
- [ ] Replay sharing

## Development Plan

### 1. Setup (Week 1)
- [ ] Initialize React Native project
- [ ] Setup development environment
- [ ] Configure iOS and Android builds
- [ ] Setup version control

### 2. Core Game (Week 2-3)
- [ ] Port game logic from web version
- [ ] Create game board UI
- [ ] Implement touch controls
- [ ] Add game phases (placement/movement)
- [ ] Implement win detection

### 3. Polish (Week 4)
- [ ] Add animations
- [ ] Improve UX/UI
- [ ] Add sound effects
- [ ] Handle edge cases
- [ ] Test on different devices

### 4. Additional Features (Week 5)
- [ ] Game persistence
- [ ] Settings screen
- [ ] Tutorial/help
- [ ] App icons and splash screen

### 5. Testing & Deployment (Week 6)
- [ ] Beta testing
- [ ] Bug fixes
- [ ] App Store submission (iOS)
- [ ] Play Store submission (Android)

## Mobile-Specific Considerations

### UI/UX Differences from Web

**Touch Targets:**
- Larger touch areas (minimum 44×44 points)
- Visual feedback on touch
- Gesture support (tap, long-press)

**Screen Sizes:**
- Support various screen sizes
- Portrait and landscape orientations
- Safe area handling (notches, etc.)

**Performance:**
- Smooth 60fps animations
- Efficient rendering
- Battery-friendly

**Platform Conventions:**
- iOS: Navigation bar, modals, haptics
- Android: Material Design, back button, FABs

### Game Controls on Mobile

**Placement Phase:**
```
Tap empty vertex → Place ball
```

**Movement Phase:**
```
Tap your ball → Select (highlight valid moves)
Tap valid move → Move ball there
Tap selected ball again → Deselect
```

**Additional Gestures:**
- Pinch to zoom (for larger grids)
- Pan to scroll (for larger grids)
- Long-press for help/info

## File Structure (React Native)

```
mobile/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx
│   │   ├── Vertex.tsx
│   │   ├── GameInfo.tsx
│   │   └── WinnerModal.tsx
│   ├── game/
│   │   ├── Game.ts          # Port from web
│   │   └── AI.ts            # AI opponent
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── GameScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── utils/
│       ├── storage.ts
│       └── constants.ts
├── assets/
│   ├── images/
│   ├── sounds/
│   └── fonts/
├── ios/
├── android/
├── package.json
└── README.md
```

## Monetization (Optional)

If you decide to monetize:

### Free Version
- Full game functionality
- Ad-supported (banner or interstitial)
- Limited features

### Premium Features (IAP)
- Ad removal ($1.99)
- Additional themes ($0.99 each)
- Advanced AI opponent ($1.99)
- Statistics and analytics ($0.99)

### Or: Completely Free
- No ads, fully featured
- Built for fun and portfolio

## App Store Requirements

### iOS App Store
- [ ] App icons (various sizes)
- [ ] Screenshots (iPhone, iPad)
- [ ] Privacy policy
- [ ] App description
- [ ] Keywords for ASO
- [ ] Age rating

### Google Play Store
- [ ] Feature graphic
- [ ] Screenshots (phone, tablet)
- [ ] App description
- [ ] Privacy policy
- [ ] Content rating

## Resources

### Learning React Native
- [React Native Documentation](https://reactnative.dev/)
- [React Native Express](https://www.reactnative.express/)

### Design
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)

### Testing
- [Expo Go](https://expo.dev/client) - Quick testing on device
- [TestFlight](https://developer.apple.com/testflight/) - iOS beta testing
- [Google Play Console](https://play.google.com/console) - Android beta testing

## Next Steps

1. Decide on technology (React Native recommended)
2. Setup development environment
3. Create new React Native project
4. Port game logic from web version
5. Build mobile-optimized UI
6. Test on actual devices
7. Submit to app stores

## Timeline Estimate

- **React Native:** 4-6 weeks (part-time)
- **Native (both platforms):** 8-12 weeks (part-time)

## Questions to Consider

- [ ] Do we need offline play? (Yes - should work without internet)
- [ ] Do we want online multiplayer? (Future enhancement)
- [ ] Should we support tablets? (Yes, responsive design)
- [ ] Do we need cloud sync? (Optional future feature)
- [ ] What's the minimum supported OS version?
