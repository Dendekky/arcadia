import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
  protected lives: number = 3;
  protected level: number = 1;
  protected livesText: Phaser.GameObjects.Text | null = null;
  protected levelText: Phaser.GameObjects.Text | null = null;
  
  constructor(key: string) {
    super(key);
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

  nextLevel() {
    this.updateLevel(this.level + 1);
    // Emit event for level transition UI
    this.events.emit('levelCompleted', this.level);
  }

  gameOver() {
    // Reset to level 1
    this.level = 1;
    this.lives = 3;

    // Emit event for game over UI
    this.events.emit('gameOver');
  }
} 