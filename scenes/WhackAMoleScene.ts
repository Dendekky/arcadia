import Phaser from 'phaser';
import BaseScene from './BaseScene';

type DialogCallbacks = {
  onGameOver?: (score?: number) => void;
  onLevelComplete?: (level: number, score?: number) => void;
};

export default class WhackAMoleScene extends BaseScene {
  private holes: Phaser.GameObjects.Sprite[] = [];
  private moles: Phaser.GameObjects.Sprite[] = [];
  private hammer: Phaser.GameObjects.Sprite | null = null;
  private moleScore: number = 0;
  private targetScore: number = 0;
  protected scoreText: Phaser.GameObjects.Text | null = null;
  private timeText: Phaser.GameObjects.Text | null = null;
  private timeLeft: number = 0;
  private timer: Phaser.Time.TimerEvent | null = null;
  private molePopUpEvent: Phaser.Time.TimerEvent | null = null;
  
  constructor() {
    super('WhackAMoleScene');
  }
  
  init(data: { dialogCallbacks?: DialogCallbacks } = {}) {
    super.init(data);
    this.moleScore = 0;
    // Set difficulty based on level
    this.targetScore = 3 + this.level;
    this.timeLeft = Math.max(20 - this.level, 9); // 20s for level 1, minimum 9s
  }
  
  preload() {
    // Load sprites and audio
    this.load.image('hole', '/sprites/hole.png');
    this.load.image('mole', '/sprites/mole.png');
    this.load.image('hammer', '/sprites/hammer.png');
    this.load.audio('bonk', '/sounds/bonk.wav');
  }
  
  create() {
    super.create(); // Create UI from BaseScene
    
    // Setup the game field
    this.createGameField();
    
    // Setup score and timer text
    this.scoreText = this.add.text(
      20, 
      80, 
      `Score: ${this.moleScore}/${this.targetScore}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    this.timeText = this.add.text(
      20, 
      110, 
      `Time: ${this.timeLeft}s`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    // Setup timer
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
    
    // Setup mole pop up timer - rate increases with level
    const popUpDelay = Math.max(1000 - (this.level * 50), 500); // 1000ms at level 1, min 500ms
    this.molePopUpEvent = this.time.addEvent({
      delay: popUpDelay,
      callback: this.popUpRandomMole,
      callbackScope: this,
      loop: true
    });
    
    // Create hammer cursor
    this.hammer = this.add.sprite(0, 0, 'hammer');
    this.hammer.setOrigin(0.5, 1);
    this.hammer.setScale(0.8);
    this.hammer.setVisible(false);
    
    // Setup input
    if (this.input) {
      this.input.on('pointerdown', this.hammerDown, this);
      this.input.on('pointermove', this.moveHammer, this);
    }
  }
  
  createGameField() {
    // Calculate positions for a 3x2 grid of holes
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    const holeSpacing = 120;
    const startX = (gameWidth - (holeSpacing * 2)) / 2;
    const startY = (gameHeight - (holeSpacing * 1)) / 2;
    
    // Create 6 holes
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * holeSpacing;
        const y = startY + row * holeSpacing;
        
        // Add hole
        const hole = this.add.sprite(x, y, 'hole');
        hole.setScale(0.7);
        this.holes.push(hole);
        
        // Add mole (initially invisible)
        const mole = this.add.sprite(x, y, 'mole');
        mole.setScale(0.65);
        mole.setVisible(false);
        mole.setInteractive();
        mole.setData('index', this.moles.length);
        mole.on('pointerdown', () => this.whackMole(mole.getData('index')));
        this.moles.push(mole);
      }
    }
  }
  
  moveHammer(pointer: Phaser.Input.Pointer) {
    if (this.hammer && pointer) {
      this.hammer.x = pointer.x;
      this.hammer.y = pointer.y;
    }
  }
  
  hammerDown(_: Phaser.Input.Pointer) {
    if (this.hammer) {
      this.hammer.setVisible(true);
      this.hammer.setScale(0.7);
      
      // Hammer animation
      this.tweens.add({
        targets: this.hammer,
        scaleX: 0.8,
        scaleY: 0.8,
        angle: 20,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          if (this.hammer) {
            this.hammer.setVisible(false);
            this.hammer.angle = 0;
          }
        }
      });
    }
  }
  
  whackMole(index: number) {
    const mole = this.moles[index];
    
    if (mole && mole.visible) {
      // Play bonk sound
      this.playSound('bonk');
      
      // Hide the mole
      mole.setVisible(false);
      
      // Update score
      this.moleScore++;
      if (this.scoreText) {
        this.scoreText.setText(`Score: ${this.moleScore}/${this.targetScore}`);
      }
      
      // Check win condition
      if (this.moleScore >= this.targetScore) {
        this.levelComplete();
      }
    }
  }
  
  popUpRandomMole() {
    // Get all currently hidden moles
    const hiddenMoles = this.moles.filter(mole => !mole.visible);
    
    // If there are hidden moles, pop up a random one
    if (hiddenMoles.length > 0) {
      const randomIndex = Phaser.Math.Between(0, hiddenMoles.length - 1);
      const mole = hiddenMoles[randomIndex];
      
      mole.setVisible(true);
      
      // Auto-hide mole after a delay (quicker at higher levels)
      const hideDelay = Math.max(2000 - (this.level * 100), 800); // 2000ms at level 1, min 800ms
      this.time.delayedCall(hideDelay, () => {
        if (mole.visible) {
          mole.setVisible(false);
        }
      });
    }
  }
  
  updateTimer() {
    this.timeLeft--;
    
    if (this.timeText) {
      this.timeText.setText(`Time: ${this.timeLeft}s`);
    }
    
    if (this.timeLeft <= 0) {
      // Time's up
      this.levelFailed();
    }
  }
  
  levelComplete() {
    // Stop timers
    if (this.timer) this.timer.remove();
    if (this.molePopUpEvent) this.molePopUpEvent.remove();
    
    // Hide all moles
    this.moles.forEach(mole => mole.setVisible(false));
    
    // Next level
    this.nextLevel();
    
    // Restart the scene with the new level
    this.scene.restart();
  }
  
  levelFailed() {
    // Stop timers
    if (this.timer) this.timer.remove();
    if (this.molePopUpEvent) this.molePopUpEvent.remove();
    
    // Hide all moles
    this.moles.forEach(mole => mole.setVisible(false));
    
    // Lose a life
    this.updateLives(-1);
    
    // Restart the scene if still have lives
    if (this.lives > 0) {
      this.scene.restart();
    }
  }
} 