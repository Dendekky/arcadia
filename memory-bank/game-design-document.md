# Arcade Throwback Collection

## Overview
A single-page web app hosting five retro-style 2D games: *Whack-a-Mole*, *Tetris*, *Snake*, *Ping Pong*, and *Shooting Game*. Players select a game from a menu, play through 12 levels of increasing difficulty, and enjoy a simple, feel-good arcade experience. Each game starts with 3 lives, lost on failure, resetting to level 1 when depleted. Some games feature boss levels for added flair.

## General Mechanics
- **Game Selection**: A homepage with five buttons (one per game) styled with shadcn/ui and Tailwind.
- **Lives**: All games start with 3 lives. Lose 1 on failure (specific per game). At 0 lives, reset to level 1.
- **Levels**: 12 levels per game, increasing in difficulty (speed, quantity, complexity). Boss levels at 3, 7, 12 where applicable.
- **UI**: Tailwind-styled overlays for lives, level number, and score. shadcn/ui dialogs for "Game Over" and "Next Level."
- **Assets**: Pixel-art sprites (Aseprite) and 8-bit sounds (Bfxr) for a throwback feel.

---

## Game 1: Whack-a-Mole

### Description
Whack moles popping out of holes to hit a target score before time runs out.

### Core Mechanics
- 6 holes on a grid; moles pop up randomly.
- Click/tap to whack with a hammer cursor.
- Lives lost if target score isn’t met.

### Level Progression
- **Level 1**: 5 moles, 20s, target: 4 whacks.
- **Level 2-11**: +1 mole, -1s, +1 target per level.
- **Level 12**: 15 moles, 9s, target: 14 whacks.
- **Difficulty**: Mole pop-up speed increases (1s to 0.5s).

### Visuals & Sound
- Sprites: Moles, hammer, dirt holes.
- Sound: "Bonk" hit, "Miss" chime, upbeat tune.

### Win/Lose
- **Win**: Hit target score.
- **Lose**: Miss target, lose a life.

---

## Game 2: Tetris

### Description
Stack falling tetrominoes to clear lines and survive levels.

### Core Mechanics
- Tetrominoes fall on a 10x20 grid.
- Rotate/move pieces to fit.
- Lives lost if grid fills up.

### Level Progression
- **Level 1**: Slow drop, clear 5 lines.
- **Level 2-11**: Faster drop, +2 lines to clear (7, 9, …).
- **Level 12**: Fastest drop, clear 27 lines.
- **Difficulty**: Speed increases, debris blocks in later levels.

### Visuals & Sound
- Sprites: Colorful tetrominoes, grid.
- Sound: Line-clear jingle, game-over buzz, 8-bit loop.

### Win/Lose
- **Win**: Clear required lines.
- **Lose**: Stack overflows, lose a life.

---

## Game 3: Snake

### Description
Grow a snake by eating food, avoiding crashes, to reach a target length.

### Core Mechanics
- Snake moves on a 15x15 grid.
- Arrow keys control direction.
- Lives lost on wall/self collision.

### Level Progression
- **Level 1**: Length 3, target 10, slow speed.
- **Level 2-11**: +2 target length, faster speed, +obstacles.
- **Level 12**: Target 32, fastest speed, moving obstacles.
- **Difficulty**: Speed and obstacle density ramp up.

### Visuals & Sound
- Sprites: Snake, food, walls.
- Sound: "Eat" beep, crash, slithery tune.

### Win/Lose
- **Win**: Reach target length.
- **Lose**: Crash, lose a life.

---

## Game 4: Ping Pong

### Description
Bounce a ball past an AI opponent to score points.

### Core Mechanics
- Player paddle (left) vs. AI paddle (right).
- Score when ball passes AI.
- Lives lost if AI scores 5 times.

### Level Progression
- **Level 1**: Slow ball, target: 5 points.
- **Level 2-11**: Faster ball, smaller AI paddle, +2 target.
- **Level 12**: Fastest ball, tiny AI paddle, target: 27.
- **Difficulty**: Ball accelerates mid-rally, AI improves.

### Visuals & Sound
- Sprites: Paddles, square ball, midline.
- Sound: "Blip" hit, "Score" chime, bouncy tune.

### Win/Lose
- **Win**: Reach target score.
- **Lose**: AI scores 5 times, lose a life.

---

## Game 5: Shooting Game

### Description
Shoot enemies and bosses in a side-scrolling shooter.

### Core Mechanics
- Ship moves left/right, shoots upward.
- Enemies spawn from top.
- Lives lost if hit by enemy/projectile.

### Level Progression
- **Level 1**: 10 weak enemies, slow.
- **Level 2**: 12 enemies, faster.
- **Level 3 (Boss)**: Giant enemy, 20 HP, shoots.
- **Level 4-6**: 15-20 enemies, some shoot.
- **Level 7 (Boss)**: Tougher boss, 30 HP, multi-shot.
- **Level 8-11**: 22-30 enemies, faster, more shooters.
- **Level 12 (Boss)**: Mega boss, 50 HP, bullet patterns.
- **Difficulty**: Enemy speed, numbers, attacks increase.

### Visuals & Sound
- Sprites: Ship, drones, bosses.
- Sound: "Pew" shots, explosions, boss track.

### Win/Lose
- **Win**: Clear enemies or boss.
- **Lose**: Hit, lose a life.

---

## Implementation Notes
- **Structure**: Next.js app with a homepage (`/`) listing games. Each game is a Phaser scene, dynamically imported when clicked.
- **UI**: Tailwind for retro styling (e.g., pixel fonts, neon colors). shadcn/ui buttons for game selection and dialogs.
- **Game Loop**: Phaser handles game logic, levels, and lives per game.
- **Assets**: Stored in `/public`, loaded by Phaser (e.g., `/sprites/mole.png`, `/sounds/bonk.wav`).