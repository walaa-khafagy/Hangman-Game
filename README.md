# Hangman Game (Vanilla JavaScript)

A fully interactive Hangman game built using HTML, CSS, and Vanilla JavaScript.  
The game supports multiple difficulty levels, categories, hints, visual feedback, and a final result modal with animations.

---

## Features

- Dynamic alphabet buttons (A–Z)
- Difficulty levels (Easy, Medium, Hard)
- Word categories loaded from JSON
- Random word selection
- Hint system with limited hints per difficulty
- Visual hangman drawing for wrong guesses
- Win and Lose modal popup
- Success GIF on win
- Hangman display and revealed word on loss
- Restart / Play Again functionality

---

## How to Play

1. Choose a difficulty level
2. Choose a category
3. Guess letters by clicking the alphabet buttons
4. Use hints if available
5. Avoid making 6 wrong guesses
6. Win by guessing all letters correctly

--- 

## Game Logic Overview

- Alphabet buttons are generated dynamically at the start of the game.

- Word data is loaded from an external JSON file.

- The player selects a difficulty level, which sets the number of hints and available categories.

- The player selects a category, and a random word is chosen.

- Empty letter boxes are created based on the selected word length.

- The game tracks correct letter positions internally.

- Correct guesses reveal all matching letters and disable the selected button.

- Wrong guesses reveal hangman body parts and increase the mistake counter.

- Hints reveal a random unrevealed letter and reduce remaining hints.

- The game ends when:
  - All letters are revealed (win)
  - All hangman parts are revealed (loss)

- A modal popup displays the final result and allows the player to restart.



