import Phaser from 'phaser';

type DialogCallbacks = {
  onGameOver?: (score?: number) => void;
  onLevelComplete?: (level: number, score?: number) => void;
};

export default class BaseScene extends Phaser.Scene {
  protected lives: number = 3;
  protected level: number = 1;
  protected score: number = 0;
  protected livesText: Phaser.GameObjects.Text | null = null;
  protected levelText: Phaser.GameObjects.Text | null = null;
  protected scoreText: Phaser.GameObjects.Text | null = null;
  protected dialogCallbacks: DialogCallbacks | null = null;
  protected soundsLoaded: boolean = false;
  
  constructor(key: string) {
    super(key);
  }

  init(data: { dialogCallbacks?: DialogCallbacks } = {}) {
    if (data.dialogCallbacks) {
      this.dialogCallbacks = data.dialogCallbacks;
    }
  }

  preload() {
    // Load common sound assets
    this.loadSounds();
  }

  create() {
    this.createUI();
  }

  loadSounds() {
    // Common sound effects
    this.load.audio('bonk', 'sounds/bonk.mp3');
    this.load.audio('eat', 'sounds/eat.mp3');
    this.load.audio('score', 'sounds/score.mp3');
    this.load.audio('levelup', 'sounds/levelup.mp3');
    this.load.audio('gameover', 'sounds/gameover.mp3');
    this.load.audio('shoot', 'sounds/shoot.mp3');
    
    // Additional game-specific sounds
    this.load.audio('rotate', 'sounds/rotate.mp3');
    this.load.audio('drop', 'sounds/drop.mp3');
    this.load.audio('lineClear', 'sounds/lineClear.mp3');
    this.load.audio('crash', 'sounds/crash.mp3');
    this.load.audio('hit', 'sounds/hit.mp3');
    this.load.audio('explosion', 'sounds/explosion.mp3');
    
    // Mark sounds as loaded to avoid duplicating load calls
    this.soundsLoaded = true;

    // Handle load errors gracefully
    this.load.on('loaderror', (fileObj: Phaser.Loader.File) => {
      console.warn(`Error loading audio: ${fileObj.key}`);
    });
  }

  // Safe method to play sounds that avoids errors if sound isn't loaded
  playSound(key: string) {
    try {
      if (this.cache.audio.exists(key)) {
        this.sound.play(key);
      } else {
        console.warn(`Sound "${key}" not found in cache`);
      }
    } catch (err) {
      console.warn(`Cannot play sound "${key}": ${err}`);
    }
  }

  createUI() {
    // Add lives counter
    this.livesText = this.add.text(
      20, 
      20, 
      `Lives: ${this.lives}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    // Add level counter
    this.levelText = this.add.text(
      20, 
      50, 
      `Level: ${this.level}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );

    // Add score counter
    this.scoreText = this.add.text(
      20, 
      80, 
      `Score: ${this.score}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
  }

  updateLives(change: number) {
    this.lives += change;
    if (this.livesText) {
      this.livesText.setText(`Lives: ${this.lives}`);
    }

    // Game over check
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  updateLevel(newLevel: number) {
    this.level = newLevel;
    if (this.levelText) {
      this.levelText.setText(`Level: ${this.level}`);
    }
  }

  updateScore(points: number) {
    this.score += points;
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    }
    
    // Play score sound effect
    this.playSound('score');
  }

  resetGame() {
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    
    if (this.livesText) {
      this.livesText.setText(`Lives: ${this.lives}`);
    }
    
    if (this.levelText) {
      this.levelText.setText(`Level: ${this.level}`);
    }
    
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }

  nextLevel() {
    this.updateLevel(this.level + 1);
    
    // Play level up sound
    this.playSound('levelup');
    
    // Call level complete dialog callback
    if (this.dialogCallbacks?.onLevelComplete) {
      // Pause the game while dialog is shown
      this.scene.pause();
      this.dialogCallbacks.onLevelComplete(this.level, this.score);
    }
  }

  gameOver() {
    // Play game over sound
    this.playSound('gameover');
    
    // Call game over dialog callback
    if (this.dialogCallbacks?.onGameOver) {
      // Pause the game while dialog is shown
      this.scene.pause();
      this.dialogCallbacks.onGameOver(this.score);
    } else {
      // If no callback, just reset the game
      this.resetGame();
    }
  }

  resumeGame() {
    this.scene.resume();
  }
} 