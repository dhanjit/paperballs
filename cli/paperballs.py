#!/usr/bin/env python3
"""
Paperballs - A childhood game recreated
Terminal/CLI version
"""

import sys
from typing import List, Tuple, Optional, Set


class Paperballs:
    """Main game class for Paperballs"""

    def __init__(self, n: int = 5, diagonal_mode: str = 'short'):
        """
        Initialize the game with an NxN grid

        Args:
            n: Grid size (minimum 3)
            diagonal_mode: 'none', 'short', or 'all'
        """
        if n < 3:
            raise ValueError("Grid size must be at least 3")

        self.n = n
        self.diagonal_mode = diagonal_mode
        self.grid = [[None for _ in range(n)] for _ in range(n)]
        self.current_player = 1
        self.phase = "placement"  # "placement" or "movement"
        self.balls_placed = {1: 0, 2: 0}
        self.balls_per_player = n

    def display_grid(self):
        """Display the current game grid"""
        print("\n  ", end="")
        for col in range(self.n):
            print(f" {col} ", end="")
        print()

        for row in range(self.n):
            print(f"{row} ", end="")
            for col in range(self.n):
                cell = self.grid[row][col]
                if cell is None:
                    print(" · ", end="")
                elif cell == 1:
                    print(" X ", end="")
                else:
                    print(" O ", end="")
            print()
        print()

    def is_valid_position(self, row: int, col: int) -> bool:
        """Check if position is within grid bounds"""
        return 0 <= row < self.n and 0 <= col < self.n

    def is_empty(self, row: int, col: int) -> bool:
        """Check if position is empty"""
        return self.is_valid_position(row, col) and self.grid[row][col] is None

    def get_adjacent_positions(self, row: int, col: int) -> List[Tuple[int, int]]:
        """
        Get all adjacent positions based on diagonal mode

        Returns:
            List of (row, col) tuples for adjacent positions
        """
        adjacent = []

        # Orthogonal directions (always included)
        orthogonal = [
            (-1, 0),  # up
            (0, -1),  # left
            (0, 1),   # right
            (1, 0)    # down
        ]

        # Short diagonal directions
        short_diagonal = [
            (-1, -1),  # up-left
            (-1, 1),   # up-right
            (1, -1),   # down-left
            (1, 1)     # down-right
        ]

        # Add directions based on diagonal mode
        if self.diagonal_mode == 'none':
            directions = orthogonal
        elif self.diagonal_mode == 'short':
            directions = orthogonal + short_diagonal
        elif self.diagonal_mode == 'all':
            directions = orthogonal + short_diagonal
            # Add long diagonals and orthogonals
            for i in range(2, self.n):
                directions.extend([
                    (-i, -i), (-i, i), (i, -i), (i, i),  # long diagonals
                    (-i, 0), (i, 0), (0, -i), (0, i)     # long orthogonals
                ])
        else:
            directions = orthogonal + short_diagonal  # default to short

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            if self.is_valid_position(new_row, new_col):
                adjacent.append((new_row, new_col))

        return adjacent

    def place_ball(self, row: int, col: int) -> bool:
        """
        Place a ball during placement phase

        Returns:
            True if placement successful, False otherwise
        """
        if self.phase != "placement":
            print("Not in placement phase!")
            return False

        if not self.is_empty(row, col):
            print("Position is already occupied!")
            return False

        self.grid[row][col] = self.current_player
        self.balls_placed[self.current_player] += 1

        # Check if placement phase is complete
        if self.balls_placed[1] == self.balls_per_player and \
           self.balls_placed[2] == self.balls_per_player:
            self.phase = "movement"
            print("\n🎮 All balls placed! Movement phase begins.\n")

        return True

    def move_ball(self, from_row: int, from_col: int, to_row: int, to_col: int) -> bool:
        """
        Move a ball during movement phase

        Returns:
            True if move successful, False otherwise
        """
        if self.phase != "movement":
            print("Not in movement phase!")
            return False

        # Check if source position has current player's ball
        if not self.is_valid_position(from_row, from_col):
            print("Invalid source position!")
            return False

        if self.grid[from_row][from_col] != self.current_player:
            print("You don't have a ball at that position!")
            return False

        # Check if destination is valid and empty
        if not self.is_empty(to_row, to_col):
            print("Destination is not empty!")
            return False

        # Check if destination is adjacent
        adjacent = self.get_adjacent_positions(from_row, from_col)
        if (to_row, to_col) not in adjacent:
            print("Destination is not adjacent!")
            return False

        # Make the move
        self.grid[to_row][to_col] = self.current_player
        self.grid[from_row][from_col] = None

        return True

    def check_line(self, positions: List[Tuple[int, int]], player: int) -> bool:
        """Check if all positions contain the player's ball"""
        return all(
            self.is_valid_position(r, c) and self.grid[r][c] == player
            for r, c in positions
        )

    def check_winner(self) -> Optional[int]:
        """
        Check if there's a winner

        Returns:
            Player number (1 or 2) if winner found, None otherwise
        """
        for player in [1, 2]:
            # Check horizontal lines
            for row in range(self.n):
                positions = [(row, col) for col in range(self.n)]
                if self.check_line(positions, player):
                    return player

            # Check vertical lines
            for col in range(self.n):
                positions = [(row, col) for row in range(self.n)]
                if self.check_line(positions, player):
                    return player

            # Check diagonal (top-left to bottom-right)
            positions = [(i, i) for i in range(self.n)]
            if self.check_line(positions, player):
                return player

            # Check diagonal (top-right to bottom-left)
            positions = [(i, self.n - 1 - i) for i in range(self.n)]
            if self.check_line(positions, player):
                return player

        return None

    def switch_player(self):
        """Switch to the other player"""
        self.current_player = 2 if self.current_player == 1 else 1

    def get_player_name(self, player: int) -> str:
        """Get player display name"""
        return f"Player {player} ({'X' if player == 1 else 'O'})"

    def play(self):
        """Main game loop"""
        print("=" * 50)
        print("🎯 PAPERBALLS 🎯")
        print("=" * 50)
        print(f"\nGrid size: {self.n}x{self.n}")
        print(f"Each player has {self.balls_per_player} balls")
        print("\nPlayer 1: X")
        print("Player 2: O")
        print("\n" + "=" * 50)

        while True:
            self.display_grid()

            # Check for winner
            winner = self.check_winner()
            if winner:
                print("=" * 50)
                print(f"🏆 {self.get_player_name(winner)} WINS! 🏆")
                print("=" * 50)
                break

            # Display current phase and player
            print(f"Phase: {self.phase.upper()}")
            print(f"Current turn: {self.get_player_name(self.current_player)}")

            if self.phase == "placement":
                print(f"Balls placed: {self.balls_placed[self.current_player]}/{self.balls_per_player}")
                print("\nEnter position to place ball (row col): ", end="")

                try:
                    user_input = input().strip()
                    if user_input.lower() in ['quit', 'exit', 'q']:
                        print("Thanks for playing!")
                        sys.exit(0)

                    parts = user_input.split()
                    if len(parts) != 2:
                        print("Invalid input! Enter: row col (e.g., '2 3')")
                        continue

                    row, col = int(parts[0]), int(parts[1])

                    if self.place_ball(row, col):
                        self.switch_player()

                except ValueError:
                    print("Invalid input! Please enter numbers.")
                except KeyboardInterrupt:
                    print("\nThanks for playing!")
                    sys.exit(0)

            else:  # movement phase
                print("\nEnter move (from_row from_col to_row to_col): ", end="")

                try:
                    user_input = input().strip()
                    if user_input.lower() in ['quit', 'exit', 'q']:
                        print("Thanks for playing!")
                        sys.exit(0)

                    parts = user_input.split()
                    if len(parts) != 4:
                        print("Invalid input! Enter: from_row from_col to_row to_col (e.g., '2 3 2 4')")
                        continue

                    from_row, from_col, to_row, to_col = map(int, parts)

                    if self.move_ball(from_row, from_col, to_row, to_col):
                        self.switch_player()

                except ValueError:
                    print("Invalid input! Please enter numbers.")
                except KeyboardInterrupt:
                    print("\nThanks for playing!")
                    sys.exit(0)


def main():
    """Entry point for the game"""
    print("Welcome to Paperballs!")
    print("\nChoose grid size (minimum 3, recommended 5): ", end="")

    try:
        n = int(input().strip())
    except ValueError:
        print("Invalid input! Using default size 5.")
        n = 5
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)

    print("\nChoose diagonal mode:")
    print("  1. No Diagonals (4-way movement)")
    print("  2. Short Diagonals (8-way movement) [Default]")
    print("  3. All Diagonals (includes long diagonals)")
    print("Enter choice (1/2/3): ", end="")

    try:
        choice = input().strip()
        if choice == '1':
            diagonal_mode = 'none'
        elif choice == '3':
            diagonal_mode = 'all'
        else:
            diagonal_mode = 'short'  # default
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)

    try:
        game = Paperballs(n, diagonal_mode)
        game.play()
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)


if __name__ == "__main__":
    main()
