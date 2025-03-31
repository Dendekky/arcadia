import Phaser from 'phaser';
import BaseScene from './BaseScene';

export default class PingPongScene extends BaseScene {
  private playerPaddle: Phaser.GameObjects.Rectangle | null = null;
  private aiPaddle: Phaser.GameObjects.Rectangle | null = null;
  private ball: Phaser.GameObjects.Rectangle | null = null;
  private ballVelocity: {x: number, y: number} = {x: 0, y: 0};
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private paddleSpeed: number = 400;
  private ballSpeed: number = 300;
  private matchScoreText: Phaser.GameObjects.Text | null = null;
  private playerScore: number = 0;
  private aiScore: number = 0;
  private targetScore: number = 0;
  private aiPaddleHeight: number = 100;
  private playerPaddleWidth: number = 15;
  private playerPaddleHeight: number = 100;
  private ballSize: number = 15;
  
  constructor() {
    super('PingPongScene');
  }
  
  init() {
    // Reset scores
    this.playerScore = 0;
    this.aiScore = 0;
    
    // Set target score based on level
    this.targetScore = 5 + ((this.level - 1) * 2);
    
    // Set ball speed based on level
    this.ballSpeed = 300 + (this.level * 20);
    
    // Shrink AI paddle at higher levels
    this.aiPaddleHeight = Math.max(100 - (this.level * 5), 30);
  }
  
  preload() {
    this.load.audio('hit', '/sounds/hit.wav');
    this.load.audio('score', '/sounds/score.wav');
  }
  
  create() {
    super.create();
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create paddles
    this.playerPaddle = this.add.rectangle(
      40, 
      height / 2, 
      this.playerPaddleWidth, 
      this.playerPaddleHeight, 
      0x00ff00
    );
    
    this.aiPaddle = this.add.rectangle(
      width - 40, 
      height / 2, 
      this.playerPaddleWidth, 
      this.aiPaddleHeight, 
      0xff0000
    );
    
    // Create ball
    this.ball = this.add.rectangle(
      width / 2, 
      height / 2, 
      this.ballSize, 
      this.ballSize, 
      0xffffff
    );
    
    // Setup match score text (positioned below the base score text)
    this.matchScoreText = this.add.text(
      20, 
      110, 
      `Match: ${this.playerScore}/${this.targetScore}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    // Create center line
    const centerLine = this.add.graphics();
    centerLine.lineStyle(2, 0x666666, 1);
    centerLine.beginPath();
    centerLine.moveTo(width / 2, 0);
    centerLine.lineTo(width / 2, height);
    centerLine.strokePath();
    
    // Setup keyboard controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    // Launch the ball
    this.launchBall();
    
    // Enable physics for objects
    if (this.physics && this.playerPaddle && this.aiPaddle && this.ball) {
      this.physics.add.existing(this.playerPaddle, false);
      this.physics.add.existing(this.aiPaddle, false);
      this.physics.add.existing(this.ball, false);
      
      // Set collision properties
      const playerPaddleBody = this.playerPaddle.body as Phaser.Physics.Arcade.Body;
      const aiPaddleBody = this.aiPaddle.body as Phaser.Physics.Arcade.Body;
      const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
      
      playerPaddleBody.setImmovable(true);
      playerPaddleBody.setCollideWorldBounds(true);
      
      aiPaddleBody.setImmovable(true);
      aiPaddleBody.setCollideWorldBounds(true);
      
      ballBody.setCollideWorldBounds(true);
      ballBody.setBounce(1, 1);
      ballBody.setVelocity(this.ballVelocity.x, this.ballVelocity.y);
      
      // Setup collision detection - intentionally using any type for collider callback
      // to avoid complex Phaser type system issues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.physics.add.collider(this.ball, this.playerPaddle, this.hitPaddle, undefined, this);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.physics.add.collider(this.ball, this.aiPaddle, this.hitPaddle, undefined, this);
      
      // Setup bounce event
      ballBody.onWorldBounds = true;
      this.physics.world.on('worldbounds', this.hitWall, this);
    }
  }
  
  launchBall() {
    // Reset ball position
    if (this.ball) {
      this.ball.x = this.cameras.main.width / 2;
      this.ball.y = this.cameras.main.height / 2;
      
      // Random direction (left or right)
      const dirX = Math.random() > 0.5 ? 1 : -1;
      // Random angle
      const dirY = (Math.random() * 2 - 1) * 0.7;
      
      // Normalize and set speed
      const length = Math.sqrt(dirX * dirX + dirY * dirY);
      this.ballVelocity.x = (dirX / length) * this.ballSpeed;
      this.ballVelocity.y = (dirY / length) * this.ballSpeed;
      
      // Apply velocity if physics is ready
      if (this.ball.body) {
        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
        ballBody.setVelocity(this.ballVelocity.x, this.ballVelocity.y);
      }
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hitPaddle(ball: any, paddle: any) {
    // Play hit sound
    this.playSound('hit');
    
    // Get ball body
    const ballBody = ball.body as Phaser.Physics.Arcade.Body;
    
    // Increase speed slightly with each hit (scaled by level)
    const speedIncrease = 1.05 + (this.level * 0.01);
    ballBody.velocity.x *= speedIncrease;
    ballBody.velocity.y *= speedIncrease;
    
    // Adjust y velocity based on where the ball hit the paddle
    const diff = (ball.y - paddle.y) / (paddle.height / 2);
    ballBody.velocity.y = diff * 300;
  }
  
  hitWall(body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean, left: boolean, right: boolean) {
    // Only play sound for top/bottom hits
    if (up || down) {
      this.playSound('hit');
    }
    
    // Check if ball went past paddles (left/right bounds)
    if (left) {
      // AI scores
      this.aiScore++;
      this.playSound('score');
      this.checkAiWin();
      this.launchBall();
    } else if (right) {
      // Player scores
      this.playerScore++;
      if (this.matchScoreText) {
        this.matchScoreText.setText(`Match: ${this.playerScore}/${this.targetScore}`);
      }
      this.playSound('score');
      this.checkPlayerWin();
      this.launchBall();
    }
  }
  
  checkPlayerWin() {
    if (this.playerScore >= this.targetScore) {
      this.levelComplete();
    }
  }
  
  checkAiWin() {
    if (this.aiScore >= 5) {
      this.levelFailed();
    }
  }
  
  update() {
    // Player paddle movement
    if (this.cursors && this.playerPaddle) {
      const playerPaddleBody = this.playerPaddle.body as Phaser.Physics.Arcade.Body;
      
      if (this.cursors.up.isDown) {
        playerPaddleBody.setVelocityY(-this.paddleSpeed);
      } else if (this.cursors.down.isDown) {
        playerPaddleBody.setVelocityY(this.paddleSpeed);
      } else {
        playerPaddleBody.setVelocityY(0);
      }
    }
    
    // AI paddle movement
    if (this.aiPaddle && this.ball) {
      const aiPaddleBody = this.aiPaddle.body as Phaser.Physics.Arcade.Body;
      const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
      
      // AI difficulty based on level
      let aiDifficulty = 0.05 + (this.level * 0.01); // 0.05 to 0.17
      aiDifficulty = Math.min(aiDifficulty, 0.17); // Cap at 0.17
      
      // Only move if ball is moving towards AI
      if (ballBody.velocity.x > 0) {
        // Calculate ideal position
        const idealY = this.ball.y;
        
        // Add some prediction based on ball velocity
        const predictY = idealY + (ballBody.velocity.y * 0.3);
        
        // Move towards the predicted position with some lag
        if (this.aiPaddle.y < predictY - this.aiPaddleHeight / 4) {
          aiPaddleBody.setVelocityY(this.paddleSpeed * aiDifficulty);
        } else if (this.aiPaddle.y > predictY + this.aiPaddleHeight / 4) {
          aiPaddleBody.setVelocityY(-this.paddleSpeed * aiDifficulty);
        } else {
          aiPaddleBody.setVelocityY(0);
        }
      } else {
        // Move towards center when ball is moving away
        if (this.aiPaddle.y < this.cameras.main.height / 2 - 10) {
          aiPaddleBody.setVelocityY(this.paddleSpeed * 0.03);
        } else if (this.aiPaddle.y > this.cameras.main.height / 2 + 10) {
          aiPaddleBody.setVelocityY(-this.paddleSpeed * 0.03);
        } else {
          aiPaddleBody.setVelocityY(0);
        }
      }
    }
  }
  
  levelComplete() {
    // Move to next level
    this.nextLevel();
    
    // Restart the scene
    this.scene.restart();
  }
  
  levelFailed() {
    // Lose a life
    this.updateLives(-1);
    
    // Check if game over
    if (this.lives > 0) {
      // Restart the scene if still have lives
      this.scene.restart();
    } else {
      // Game over
      this.gameOver();
    }
  }
} 