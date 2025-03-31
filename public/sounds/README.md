# Sound Assets Directory

This directory contains placeholder files for sound effects used in the games. 

## Required Sound Files

The application expects the following sound files in MP3 format:

### Common Sounds
- `bonk.mp3` - Used for collision sounds, mole whacking, etc.
- `eat.mp3` - Used when the snake eats food
- `score.mp3` - Used when points are added to the score
- `levelup.mp3` - Played when advancing to the next level
- `gameover.mp3` - Played when the game ends
- `shoot.mp3` - Used in the shooting game

### Game-Specific Sounds
- `rotate.mp3` - Used in Tetris when rotating a piece
- `drop.mp3` - Used in Tetris when a piece is dropped
- `lineClear.mp3` - Used in Tetris when clearing lines
- `crash.mp3` - Used in Snake when crashing
- `hit.mp3` - Used in Ping Pong and Shooting Game for collisions
- `explosion.mp3` - Used in Shooting Game when defeating enemies

## Important Note

The current files are just placeholders and need to be replaced with actual sound files. You can create sound effects using tools like:

1. [Bfxr](https://www.bfxr.net/) - Browser-based sound effect generator
2. [ChipTone](https://sfbgames.itch.io/chiptone) - Retro sound effect generator
3. [Audacity](https://www.audacityteam.org/) - For editing existing sounds

After creating or finding suitable sound effects, replace these placeholder files with real MP3 files of the same name.

## Usage in Code

The BaseScene class handles loading these sound files and provides a safe way to play them:

```typescript
// To play a sound in any game scene:
this.playSound('bonk');
```

If you need to add more sound effects, update the `loadSounds()` method in `BaseScene.ts` to include them. 