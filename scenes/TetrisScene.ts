import Phaser from 'phaser';
import BaseScene from './BaseScene';

// Define tetromino shapes
const SHAPES = [
  [ // I
    [1, 1, 1, 1]
  ],
  [ // O
    [1, 1],
    [1, 1]
  ],
  [ // T
    [0, 1, 0],
    [1, 1, 1]
  ],
  [ // L
    [1, 0, 0],
    [1, 1, 1]
  ],
  [ // J
    [0, 0, 1],
    [1, 1, 1]
  ],
  [ // S
    [0, 1, 1],
    [1, 1, 0]
  ],
  [ // Z
    [1, 1, 0],
    [0, 1, 1]
  ]
];

// Colors for each tetromino
const COLORS = [0x00ffff, 0xffff00, 0x800080, 0xff7f00, 0x0000ff, 0x00ff00, 0xff0000];

export default class TetrisScene extends BaseScene {
  private board: number[][] = [];
  private currentShape: number[][] = [];
  private currentColor: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private cellSize: number = 30;
  private boardWidth: number = 10;
  private boardHeight: number = 20;
  private graphics: Phaser.GameObjects.Graphics | null = null;
  private dropTimer: Phaser.Time.TimerEvent | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private linesCleared: number = 0;
  private requiredLines: number = 0;
  private lineText: Phaser.GameObjects.Text | null = null;
  private dropDelay: number = 1000; // Base drop delay in ms
  
  constructor() {
    super('TetrisScene');
  }
  
  init() {
    // Initialize an empty board
    this.board = Array(this.boardHeight).fill(0).map(() => Array(this.boardWidth).fill(0));
    
    // Set required lines based on level
    this.requiredLines = 5 + ((this.level - 1) * 2);
    
    // Reset lines cleared
    this.linesCleared = 0;
    
    // Set drop speed based on level
    this.dropDelay = Math.max(1000 - (this.level * 75), 200);
  }
  
  preload() {
    // No need to preload assets as we're using primitive shapes
    this.load.audio('lineClear', '/sounds/line_clear.wav');
    this.load.audio('rotate', '/sounds/rotate.wav');
    this.load.audio('drop', '/sounds/drop.wav');
  }
  
  create() {
    super.create();
    
    // Create graphics object for drawing
    this.graphics = this.add.graphics();
    
    // Setup line counter text
    this.lineText = this.add.text(
      20, 
      80, 
      `Lines: ${this.linesCleared}/${this.requiredLines}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Spawn initial tetromino
    this.spawnTetromino();
    
    // Create drop timer
    this.dropTimer = this.time.addEvent({
      delay: this.dropDelay,
      callback: this.dropTetromino,
      callbackScope: this,
      loop: true
    });
    
    // Add input handlers for keyboard
    this.input.keyboard.on('keydown-LEFT', this.moveLeft, this);
    this.input.keyboard.on('keydown-RIGHT', this.moveRight, this);
    this.input.keyboard.on('keydown-DOWN', this.moveDown, this);
    this.input.keyboard.on('keydown-UP', this.rotate, this);
    this.input.keyboard.on('keydown-SPACE', this.hardDrop, this);
  }
  
  spawnTetromino() {
    // Select a random tetromino shape
    const shapeIndex = Phaser.Math.Between(0, SHAPES.length - 1);
    this.currentShape = JSON.parse(JSON.stringify(SHAPES[shapeIndex]));
    this.currentColor = COLORS[shapeIndex];
    
    // Position at top center
    this.currentX = Math.floor(this.boardWidth / 2) - Math.floor(this.currentShape[0].length / 2);
    this.currentY = 0;
    
    // Game over check
    if (!this.isValidMove(this.currentX, this.currentY, this.currentShape)) {
      this.gameOverHandler();
    }
  }
  
  dropTetromino() {
    if (this.isValidMove(this.currentX, this.currentY + 1, this.currentShape)) {
      this.currentY++;
    } else {
      // Lock the tetromino in place
      this.lockTetromino();
      
      // Check for completed lines
      this.checkLines();
      
      // Spawn a new tetromino
      this.spawnTetromino();
    }
  }
  
  moveLeft() {
    if (this.isValidMove(this.currentX - 1, this.currentY, this.currentShape)) {
      this.currentX--;
    }
  }
  
  moveRight() {
    if (this.isValidMove(this.currentX + 1, this.currentY, this.currentShape)) {
      this.currentX++;
    }
  }
  
  moveDown() {
    if (this.isValidMove(this.currentX, this.currentY + 1, this.currentShape)) {
      this.currentY++;
    }
  }
  
  rotate() {
    // Create a rotated shape matrix
    const rows = this.currentShape.length;
    const cols = this.currentShape[0].length;
    const rotated: number[][] = Array(cols).fill(0).map(() => Array(rows).fill(0));
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = this.currentShape[y][x];
      }
    }
    
    // Check if the rotation is valid
    if (this.isValidMove(this.currentX, this.currentY, rotated)) {
      this.playSound('rotate');
      this.currentShape = rotated;
    }
  }
  
  hardDrop() {
    // Move down until hitting bottom
    while (this.isValidMove(this.currentX, this.currentY + 1, this.currentShape)) {
      this.currentY++;
    }
    // Lock the tetromino
    this.lockTetromino();
    this.playSound('drop');
    // Check for completed lines
    this.checkLines();
    // Spawn a new tetromino
    this.spawnTetromino();
  }
  
  isValidMove(x: number, y: number, shape: number[][]) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardX = x + col;
          const boardY = y + row;
          
          // Check borders
          if (boardX < 0 || boardX >= this.boardWidth || boardY >= this.boardHeight) {
            return false;
          }
          
          // Check collision with existing blocks
          if (boardY >= 0 && this.board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  lockTetromino() {
    for (let row = 0; row < this.currentShape.length; row++) {
      for (let col = 0; col < this.currentShape[row].length; col++) {
        if (this.currentShape[row][col]) {
          const boardX = this.currentX + col;
          const boardY = this.currentY + row;
          
          if (boardY >= 0) {
            // Store color value in the board (non-zero = filled)
            this.board[boardY][boardX] = this.currentColor;
          }
        }
      }
    }
  }
  
  checkLines() {
    let linesCleared = 0;
    
    for (let y = this.boardHeight - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        // Clear the line
        this.board.splice(y, 1);
        // Add a new empty line at the top
        this.board.unshift(Array(this.boardWidth).fill(0));
        // Increment lines cleared
        linesCleared++;
        // Move check position up one line as we removed a line
        y++;
      }
    }
    
    if (linesCleared > 0) {
      // Play sound
      this.playSound('lineClear');
      
      // Update lines cleared counter
      this.linesCleared += linesCleared;
      if (this.lineText) {
        this.lineText.setText(`Lines: ${this.linesCleared}/${this.requiredLines}`);
      }
      
      // Check win condition
      if (this.linesCleared >= this.requiredLines) {
        this.levelComplete();
      }
    }
  }
  
  update() {
    if (this.graphics) {
      this.graphics.clear();
      
      // Draw the game board background
      this.graphics.fillStyle(0x000000);
      this.graphics.fillRect(
        this.cameras.main.width / 2 - ((this.boardWidth * this.cellSize) / 2),
        this.cameras.main.height / 2 - ((this.boardHeight * this.cellSize) / 2),
        this.boardWidth * this.cellSize,
        this.boardHeight * this.cellSize
      );
      
      // Draw the board grid
      this.graphics.lineStyle(1, 0x333333);
      
      const boardX = this.cameras.main.width / 2 - ((this.boardWidth * this.cellSize) / 2);
      const boardY = this.cameras.main.height / 2 - ((this.boardHeight * this.cellSize) / 2);
      
      // Draw horizontal lines
      for (let y = 0; y <= this.boardHeight; y++) {
        this.graphics.moveTo(boardX, boardY + y * this.cellSize);
        this.graphics.lineTo(boardX + this.boardWidth * this.cellSize, boardY + y * this.cellSize);
      }
      
      // Draw vertical lines
      for (let x = 0; x <= this.boardWidth; x++) {
        this.graphics.moveTo(boardX + x * this.cellSize, boardY);
        this.graphics.lineTo(boardX + x * this.cellSize, boardY + this.boardHeight * this.cellSize);
      }
      
      this.graphics.strokePath();
      
      // Draw placed blocks
      for (let y = 0; y < this.boardHeight; y++) {
        for (let x = 0; x < this.boardWidth; x++) {
          if (this.board[y][x]) {
            this.graphics.fillStyle(this.board[y][x]);
            this.graphics.fillRect(
              boardX + x * this.cellSize + 1,
              boardY + y * this.cellSize + 1,
              this.cellSize - 2,
              this.cellSize - 2
            );
          }
        }
      }
      
      // Draw current tetromino
      this.graphics.fillStyle(this.currentColor);
      for (let row = 0; row < this.currentShape.length; row++) {
        for (let col = 0; col < this.currentShape[row].length; col++) {
          if (this.currentShape[row][col]) {
            this.graphics.fillRect(
              boardX + (this.currentX + col) * this.cellSize + 1,
              boardY + (this.currentY + row) * this.cellSize + 1,
              this.cellSize - 2,
              this.cellSize - 2
            );
          }
        }
      }
    }
  }
  
  levelComplete() {
    // Stop the drop timer
    if (this.dropTimer) {
      this.dropTimer.remove();
    }
    
    // Remove input handlers
    this.input.keyboard.off('keydown-LEFT', this.moveLeft);
    this.input.keyboard.off('keydown-RIGHT', this.moveRight);
    this.input.keyboard.off('keydown-DOWN', this.moveDown);
    this.input.keyboard.off('keydown-UP', this.rotate);
    this.input.keyboard.off('keydown-SPACE', this.hardDrop);
    
    // Move to next level
    this.nextLevel();
    
    // Restart the scene with the new level
    this.scene.restart();
  }
  
  gameOverHandler() {
    // Stop the drop timer
    if (this.dropTimer) {
      this.dropTimer.remove();
    }
    
    // Remove input handlers
    this.input.keyboard.off('keydown-LEFT', this.moveLeft);
    this.input.keyboard.off('keydown-RIGHT', this.moveRight);
    this.input.keyboard.off('keydown-DOWN', this.moveDown);
    this.input.keyboard.off('keydown-UP', this.rotate);
    this.input.keyboard.off('keydown-SPACE', this.hardDrop);
    
    // Lose a life
    this.updateLives(-1);
    
    // Check if still have lives
    if (this.lives > 0) {
      // Restart the scene
      this.scene.restart();
    } else {
      // Game over
      this.gameOver();
    }
  }
} 