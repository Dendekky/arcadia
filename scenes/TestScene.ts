import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene');
  }

  preload() {
    // Preload assets
  }

  create() {
    // Add game objects
    const text = this.add.text(
      this.cameras.main.centerX, 
      this.cameras.main.centerY, 
      'Phaser is working!', 
      { 
        font: '24px Arial',
        color: '#ffffff'
      }
    );
    text.setOrigin(0.5);
  }

  update() {
    // Game loop
  }
} 