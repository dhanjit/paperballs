# Paperballs Test Suite

Comprehensive test suite for the Paperballs game, providing 90%+ coverage of core game logic.

## Overview

- **100 tests** across all game mechanics
- **90%+ code coverage** on game logic
- **Parameterized tests** for multiple grid sizes and diagonal modes
- **CI integration** - tests run automatically on every push

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

### Test Output

```
Test Suites: 1 passed, 1 total
Tests:       100 passed, 100 total
Time:        ~0.15s
```

## Test Organization

### 1. Basic Tests (5 tests)
- Game initialization
- Ball placement
- Duplicate placement prevention
- Phase transitions
- Movement validation

### 2. Win Detection Tests (24 tests)
**Parameterized across 3 grid sizes (3×3, 4×4, 5×5)**

For each grid size:
- Horizontal win detection (top row, middle row)
- Vertical win detection (left column, right column)
- Main diagonal win (top-left to bottom-right)
- Anti-diagonal win (top-right to bottom-left)
- No winner scenarios
- Partial line detection (one short of winning)

### 3. Diagonal Mode Tests (14 tests)
**Parameterized across 3 diagonal modes ('none', 'short', 'all')**

Tests for each mode:
- Correct number of adjacent positions
- Orthogonal moves always allowed
- Mode-specific diagonal behavior
- Grid boundary respect

**Modes:**
- `none`: 4 directions (orthogonal only)
- `short`: 8 directions (orthogonal + short diagonals)
- `all`: Many directions (all diagonal lines)

### 4. Boundary Tests (40 tests)
**Parameterized across 5 grid sizes (3×3, 4×4, 5×5, 6×6, 7×7)**

For each grid size:
- Corner position validation
- Negative coordinate rejection
- Grid boundary validation
- Empty grid initialization
- Correct balls-per-player count

### 5. Invalid Move Tests (5 tests)
- Moving to occupied cell
- Moving without ball selection
- Selecting opponent's ball
- Phase-specific operation restrictions

### 6. State Transition Tests (9 tests)
**Parameterized across 3 grid sizes (3×3, 4×4, 5×5)**

For each grid size:
- Initial state verification
- Placement → movement transition
- Ball placement tracking

### 7. Integration Tests (3 tests)
- Full game flow: placement → movement → win
- Multi-turn movement sequences
- Error recovery and state consistency

## Code Coverage

### Current Coverage (game.js only)

| Metric     | Coverage | Threshold | Status |
|------------|----------|-----------|--------|
| Statements | 90.9%    | 85%       | ✅ Pass |
| Branches   | 79.03%   | 75%       | ✅ Pass |
| Functions  | 84%      | 80%       | ✅ Pass |
| Lines      | 90%      | 85%       | ✅ Pass |

### Coverage Details

**Tested:**
- ✅ Game initialization and configuration
- ✅ Grid management and validation
- ✅ Ball placement logic
- ✅ Ball selection and movement
- ✅ Adjacent position calculation (all 3 modes)
- ✅ Win detection (all 4 win types)
- ✅ Player switching
- ✅ Phase transitions
- ✅ Error handling

**Not tested (uncovered lines):**
- Error constructor (line 8) - edge case
- Some conditional branches in adjacency logic
- getPlayerName function (lines 237-246) - utility function
- UI and rendering code (ui.js, main.js) - requires DOM

### Why UI Code Isn't Tested

The test suite focuses on **core game logic** (`game.js`) which is:
- Pure JavaScript functions
- Framework-independent
- Testable in Node.js environment

**UI code** (`ui.js`, `main.js`) is excluded because:
- Requires DOM/browser environment
- Primarily rendering/visual code
- Would require browser testing tools (Playwright, Puppeteer)
- Core logic is sufficiently tested

## CI Integration

Tests run automatically in GitHub Actions:

### Workflow Triggers
- Every push to `main`, `develop`, or `claude/*` branches
- All pull requests to `main` or `develop`

### CI Steps
1. Install dependencies (`npm install`)
2. Run full test suite (`npm test`)
3. Lint JavaScript code (JSHint)
4. Validate file structure

### CI Status
Tests must pass before PRs can be merged. See `.github/workflows/ci.yml:58-61` for configuration.

## Adding New Tests

### 1. Add to Existing Test Suite

```javascript
test('your test description', () => {
    const game = new PaperballsGame(5, 'short');
    // Setup
    game.placeBall(0, 0);
    // Assert
    expect(game.grid[0][0]).toBe(1);
});
```

### 2. Add Parameterized Test

```javascript
describe.each([
    [3], [4], [5]
])('Test name for grid=%i', (n) => {
    test('specific test', () => {
        const game = new PaperballsGame(n, 'short');
        expect(game.n).toBe(n);
    });
});
```

### 3. Test Organization Guidelines

- **Group related tests** in `describe` blocks
- **Use clear, descriptive names** - "detects horizontal win (top row)"
- **Keep tests independent** - each test should work in isolation
- **Use `beforeEach`** for common setup
- **Test one thing** - each test should verify one specific behavior

### 4. Coverage Goals

- Aim for **85%+ coverage** on new game logic
- Don't test UI rendering code
- Focus on:
  - Happy paths (expected behavior)
  - Error cases (invalid inputs)
  - Edge cases (boundaries, empty states)
  - Integration (complete flows)

## Test Best Practices

### ✅ Do's

- **Test behavior, not implementation** - verify what the function does, not how
- **Use descriptive test names** - should read like documentation
- **Keep tests simple** - easy to understand and maintain
- **Test edge cases** - boundaries, empty inputs, invalid data
- **Use parameterized tests** - avoid code duplication

### ❌ Don'ts

- **Don't test private implementation details** - test public API only
- **Don't share state between tests** - each test should be independent
- **Don't write brittle tests** - tests should be resilient to refactoring
- **Don't skip error testing** - error cases are as important as happy paths
- **Don't duplicate logic** - use helper functions and parameterization

## Example Test Patterns

### Basic Test
```javascript
test('places balls correctly', () => {
    const game = new PaperballsGame(5, 'short');
    const result = game.placeBall(0, 0);

    expect(result.success).toBe(true);
    expect(game.grid[0][0]).toBe(1);
    expect(game.ballsPlaced[1]).toBe(1);
});
```

### Parameterized Test
```javascript
describe.each([
    [3, 'none'],
    [4, 'short'],
    [5, 'all'],
])('Grid=%i, Mode=%s', (n, mode) => {
    test('initializes correctly', () => {
        const game = new PaperballsGame(n, mode);
        expect(game.n).toBe(n);
        expect(game.diagonalMode).toBe(mode);
    });
});
```

### Error Testing
```javascript
test('rejects invalid moves', () => {
    const game = new PaperballsGame(3, 'short');
    game.phase = 'movement';

    const result = game.moveBall(0, 0);

    expect(result.success).toBe(false);
    expect(result.error).toContain('No ball selected');
});
```

## Troubleshooting

### Tests Failing Locally

```bash
# Clear Jest cache
npx jest --clearCache

# Run specific test file
npm test tests/game.test.js

# Run tests matching pattern
npm test -- --testNamePattern="win detection"
```

### Coverage Below Threshold

```bash
# See detailed coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

### CI Tests Failing But Local Tests Pass

- Ensure `package.json` is committed
- Check Node.js version (CI uses Node 18)
- Verify all dependencies are in `devDependencies`
- Check for file path case sensitivity issues

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Parameterized Tests](https://jestjs.io/docs/api#testeachtablename-fn-timeout)
- [Coverage Configuration](https://jestjs.io/docs/configuration#collectcoveragefrom-array)

## Test Statistics

- **Total Tests:** 100
- **Test Suites:** 1
- **Parameterized Test Groups:** 5
- **Grid Sizes Tested:** 3×3, 4×4, 5×5, 6×6, 7×7
- **Diagonal Modes Tested:** none, short, all
- **Average Test Runtime:** ~0.15 seconds
- **Coverage:** 90% of game.js

---

**Last Updated:** December 2025
**Framework:** Jest 30.2.0
**Test File:** `tests/game.test.js`
