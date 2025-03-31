import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
  private selectedGame: string = 'Test';
  
  constructor() {
    super('TestScene');
  }

  init() {
    // Listen for the setGame event from PhaserGame component
    this.events.on('setGame', (game: string) => {
      this.selectedGame = game;
      this.updateGameDisplay();
    });
  }

  preload() {
    // Preload assets
  }

  create() {
    // Add game objects
    this.updateGameDisplay();
  }

  updateGameDisplay() {
    // Clear existing text if it exists
    this.children.each(child => {
      if (child instanceof Phaser.GameObjects.Text) {
        child.destroy();
      }
    });

    // Add game selection text
    const text = this.add.text(
      this.cameras.main.centerX, 
      this.cameras.main.centerY, 
      `Selected Game: ${this.selectedGame}`, 
      { 
        font: '24px monospace',
        color: '#00ff00'
      }
    );
    text.setOrigin(0.5);

    // Add placeholder text
    const placeholderText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 40,
      'Game implementation coming soon...',
      {
        font: '16px monospace',
        color: '#00ff00'
      }
    );
    placeholderText.setOrigin(0.5);
  }

  update() {
    // Game loop
  }
} 