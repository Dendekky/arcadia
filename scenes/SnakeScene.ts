import Phaser from 'phaser';
import BaseScene from './BaseScene';

export default class SnakeScene extends BaseScene {
  private gridSize: number = 15; // 15x15 grid
  private cellSize: number = 30;
  private snake: {x: number, y: number}[] = [];
  private food: {x: number, y: number} | null = null;
  private direction: {x: number, y: number} = {x: 1, y: 0}; // Start moving right
  private nextDirection: {x: number, y: number} = {x: 1, y: 0};
  private moveTimer: Phaser.Time.TimerEvent | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private graphics: Phaser.GameObjects.Graphics | null = null;
  private obstacles: {x: number, y: number}[] = [];
  private lengthText: Phaser.GameObjects.Text | null = null;
  private currentLength: number = 3;
  private targetLength: number = 0;
  private moveDelay: number = 150; // Base delay in ms
  
  constructor() {
    super('SnakeScene');
  }
  
  init() {
    // Reset snake
    this.snake = [
      {x: 3, y: 7},
      {x: 2, y: 7},
      {x: 1, y: 7}
    ];
    
    this.currentLength = 3;
    
    // Set direction to right
    this.direction = {x: 1, y: 0};
    this.nextDirection = {x: 1, y: 0};
    
    // Clear obstacles
    this.obstacles = [];
    
    // Set target length based on level
    this.targetLength = 10 + ((this.level - 1) * 2);
    
    // Set snake speed based on level
    this.moveDelay = Math.max(150 - (this.level * 10), 50);
    
    // Add obstacles based on level
    if (this.level > 1) {
      this.addObstacles();
    }
  }
  
  preload() {
    this.load.audio('eat', '/sounds/eat.wav');
    this.load.audio('crash', '/sounds/crash.wav');
  }
  
  create() {
    super.create();
    
    // Create graphics object
    this.graphics = this.add.graphics();
    
    // Setup length counter text
    this.lengthText = this.add.text(
      20, 
      80, 
      `Length: ${this.currentLength}/${this.targetLength}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    // Set up keyboard controls
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    // Create first food
    this.createFood();
    
    // Start snake movement
    this.moveTimer = this.time.addEvent({
      delay: this.moveDelay,
      callback: this.moveSnake,
      callbackScope: this,
      loop: true
    });
  }
  
  addObstacles() {
    // Add obstacles based on level (more obstacles at higher levels)
    const numObstacles = Math.min(5 + (this.level * 2), 30);
    
    for (let i = 0; i < numObstacles; i++) {
      const obstacle = this.getRandomPosition();
      
      // Make sure obstacle is not on snake or food
      if (!this.isPositionOccupied(obstacle.x, obstacle.y)) {
        this.obstacles.push(obstacle);
      }
    }
    
    // Add moving obstacles at higher levels (after level 6)
    if (this.level > 6) {
      // Add event for moving obstacles
      this.time.addEvent({
        delay: 2000,
        callback: this.moveObstacles,
        callbackScope: this,
        loop: true
      });
    }
  }
  
  moveObstacles() {
    // Only move a few obstacles at a time
    const numToMove = Math.min(this.obstacles.length, Math.floor(this.level / 2));
    
    for (let i = 0; i < numToMove; i++) {
      const obstacle = this.obstacles[i];
      const directions = [
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 0, y: -1}
      ];
      
      // Try to move in a random direction
      const randomDir = directions[Phaser.Math.Between(0, 3)];
      const newX = obstacle.x + randomDir.x;
      const newY = obstacle.y + randomDir.y;
      
      // Check if the new position is valid
      if (newX >= 0 && newX < this.gridSize && newY >= 0 && newY < this.gridSize) {
        // Don't move if it would collide with the snake head
        if (!(newX === this.snake[0].x && newY === this.snake[0].y)) {
          obstacle.x = newX;
          obstacle.y = newY;
        }
      }
    }
  }
  
  createFood() {
    // Create food at random position
    const foodPosition = this.getRandomPosition();
    
    // Make sure food is not on snake or obstacle
    while (this.isPositionOccupied(foodPosition.x, foodPosition.y)) {
      const newPosition = this.getRandomPosition();
      foodPosition.x = newPosition.x;
      foodPosition.y = newPosition.y;
    }
    
    this.food = foodPosition;
  }
  
  getRandomPosition() {
    return {
      x: Phaser.Math.Between(0, this.gridSize - 1),
      y: Phaser.Math.Between(0, this.gridSize - 1)
    };
  }
  
  isPositionOccupied(x: number, y: number) {
    // Check if position is occupied by snake
    for (const segment of this.snake) {
      if (segment.x === x && segment.y === y) {
        return true;
      }
    }
    
    // Check if position is occupied by obstacle
    for (const obstacle of this.obstacles) {
      if (obstacle.x === x && obstacle.y === y) {
        return true;
      }
    }
    
    return false;
  }
  
  update() {
    // Update direction based on keyboard input
    if (this.cursors) {
      if (this.cursors.left.isDown && this.direction.x !== 1) {
        this.nextDirection = {x: -1, y: 0};
      } else if (this.cursors.right.isDown && this.direction.x !== -1) {
        this.nextDirection = {x: 1, y: 0};
      } else if (this.cursors.up.isDown && this.direction.y !== 1) {
        this.nextDirection = {x: 0, y: -1};
      } else if (this.cursors.down.isDown && this.direction.y !== -1) {
        this.nextDirection = {x: 0, y: 1};
      }
    }
    
    // Render game
    this.render();
  }
  
  moveSnake() {
    // Update direction
    this.direction = this.nextDirection;
    
    // Get current head position
    const head = {...this.snake[0]};
    
    // Calculate new head position
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };
    
    // Check for collision with wall
    if (newHead.x < 0 || newHead.x >= this.gridSize || 
        newHead.y < 0 || newHead.y >= this.gridSize) {
      this.gameOverHandler();
      return;
    }
    
    // Check for collision with self (except when moving away from tail)
    for (let i = 0; i < this.snake.length - 1; i++) {
      if (newHead.x === this.snake[i].x && newHead.y === this.snake[i].y) {
        this.gameOverHandler();
        return;
      }
    }
    
    // Check for collision with obstacles
    for (const obstacle of this.obstacles) {
      if (newHead.x === obstacle.x && newHead.y === obstacle.y) {
        this.gameOverHandler();
        return;
      }
    }
    
    // Move snake by adding new head
    this.snake.unshift(newHead);
    
    // Check if snake ate food
    if (this.food && newHead.x === this.food.x && newHead.y === this.food.y) {
      // Play eat sound
      this.playSound('eat');
      
      // Increase length counter
      this.currentLength++;
      if (this.lengthText) {
        this.lengthText.setText(`Length: ${this.currentLength}/${this.targetLength}`);
      }
      
      // Create new food
      this.createFood();
      
      // Check win condition
      if (this.currentLength >= this.targetLength) {
        this.levelComplete();
      }
    } else {
      // Remove tail if didn't eat food
      this.snake.pop();
    }
  }
  
  render() {
    if (this.graphics) {
      this.graphics.clear();
      
      // Calculate board position
      const boardX = (this.cameras.main.width - (this.gridSize * this.cellSize)) / 2;
      const boardY = (this.cameras.main.height - (this.gridSize * this.cellSize)) / 2;
      
      // Draw board background
      this.graphics.fillStyle(0x000000);
      this.graphics.fillRect(boardX, boardY, this.gridSize * this.cellSize, this.gridSize * this.cellSize);
      
      // Draw grid
      this.graphics.lineStyle(1, 0x333333);
      for (let x = 0; x <= this.gridSize; x++) {
        this.graphics.moveTo(boardX + x * this.cellSize, boardY);
        this.graphics.lineTo(boardX + x * this.cellSize, boardY + this.gridSize * this.cellSize);
      }
      for (let y = 0; y <= this.gridSize; y++) {
        this.graphics.moveTo(boardX, boardY + y * this.cellSize);
        this.graphics.lineTo(boardX + this.gridSize * this.cellSize, boardY + y * this.cellSize);
      }
      this.graphics.strokePath();
      
      // Draw snake
      this.graphics.fillStyle(0x00ff00);
      for (let i = 0; i < this.snake.length; i++) {
        const segment = this.snake[i];
        
        // Head is a different color
        if (i === 0) {
          this.graphics.fillStyle(0x00ff99);
        } else {
          this.graphics.fillStyle(0x00ff00);
        }
        
        this.graphics.fillRect(
          boardX + segment.x * this.cellSize + 1,
          boardY + segment.y * this.cellSize + 1,
          this.cellSize - 2,
          this.cellSize - 2
        );
      }
      
      // Draw food
      if (this.food) {
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRect(
          boardX + this.food.x * this.cellSize + 1,
          boardY + this.food.y * this.cellSize + 1,
          this.cellSize - 2,
          this.cellSize - 2
        );
      }
      
      // Draw obstacles
      this.graphics.fillStyle(0x666666);
      for (const obstacle of this.obstacles) {
        this.graphics.fillRect(
          boardX + obstacle.x * this.cellSize + 1,
          boardY + obstacle.y * this.cellSize + 1,
          this.cellSize - 2,
          this.cellSize - 2
        );
      }
    }
  }
  
  levelComplete() {
    // Stop the movement timer
    if (this.moveTimer) {
      this.moveTimer.remove();
    }
    
    // Move to next level
    this.nextLevel();
    
    // Restart the scene with new level
    this.scene.restart();
  }
  
  gameOverHandler() {
    // Play crash sound
    this.playSound('crash');
    
    // Stop the movement timer
    if (this.moveTimer) {
      this.moveTimer.remove();
    }
    
    // Lose a life
    this.updateLives(-1);
    
    // Restart the scene if still have lives
    if (this.lives > 0) {
      this.scene.restart();
    } else {
      // Game over
      this.gameOver();
    }
  }
} 