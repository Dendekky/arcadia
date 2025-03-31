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
  
  constructor(key: string) {
    super(key);
  }

  init(data: { dialogCallbacks?: DialogCallbacks } = {}) {
    if (data.dialogCallbacks) {
      this.dialogCallbacks = data.dialogCallbacks;
    }
  }

  create() {
    this.createUI();
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
    
    // Call level complete dialog callback
    if (this.dialogCallbacks?.onLevelComplete) {
      // Pause the game while dialog is shown
      this.scene.pause();
      this.dialogCallbacks.onLevelComplete(this.level, this.score);
    }
  }

  gameOver() {
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