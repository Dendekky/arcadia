import Phaser from 'phaser';
import BaseScene from './BaseScene';

export default class ShootingGameScene extends BaseScene {
  private ship: Phaser.GameObjects.Sprite | null = null;
  private bullets: Phaser.GameObjects.Group | null = null;
  private enemies: Phaser.GameObjects.Group | null = null;
  private enemyBullets: Phaser.GameObjects.Group | null = null;
  private boss: Phaser.Physics.Arcade.Sprite | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private fireKey: Phaser.Input.Keyboard.Key | null = null;
  private enemyCount: number = 0;
  private totalEnemies: number = 0;
  private bossHealth: number = 0;
  private maxBossHealth: number = 0;
  private bossHealthBar: Phaser.GameObjects.Graphics | null = null;
  private scoreText: Phaser.GameObjects.Text | null = null;
  private enemiesDefeated: number = 0;
  private isBossLevel: boolean = false;
  private shipSpeed: number = 300;
  private enemySpawnTimer: Phaser.Time.TimerEvent | null = null;
  private lastFired: number = 0;
  private fireRate: number = 200; // milliseconds between shots
  
  constructor() {
    super('ShootingGameScene');
  }
  
  init() {
    // Reset counters
    this.enemiesDefeated = 0;
    this.enemyCount = 0;
    
    // Determine if this is a boss level
    this.isBossLevel = this.level === 3 || this.level === 7 || this.level === 12;
    
    // Set total enemies or boss health based on level
    if (this.isBossLevel) {
      // Boss level
      this.totalEnemies = 1; // Just the boss
      
      if (this.level === 3) {
        this.bossHealth = this.maxBossHealth = 20;
      } else if (this.level === 7) {
        this.bossHealth = this.maxBossHealth = 35;
      } else if (this.level === 12) {
        this.bossHealth = this.maxBossHealth = 50;
      }
    } else {
      // Regular level
      this.totalEnemies = 10 + ((this.level - 1) * 2); // 10 to 30 enemies
    }
  }
  
  preload() {
    // Load assets
    this.load.image('ship', '/sprites/ship.png');
    this.load.image('bullet', '/sprites/bullet.png');
    this.load.image('enemy', '/sprites/enemy.png');
    this.load.image('enemyBullet', '/sprites/enemy_bullet.png');
    this.load.image('boss', '/sprites/boss.png');
    
    // Load sounds
    this.load.audio('shoot', '/sounds/shoot.wav');
    this.load.audio('explosion', '/sounds/explosion.wav');
    this.load.audio('hit', '/sounds/hit.wav');
  }
  
  create() {
    super.create();
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create ship
    this.ship = this.physics.add.sprite(width / 2, height - 50, 'ship');
    this.ship.setCollideWorldBounds(true);
    this.ship.setScale(0.7);
    
    // Create bullets group
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      defaultKey: 'bullet',
      maxSize: 30
    });
    
    // Create enemies group
    this.enemies = this.physics.add.group();
    
    // Create enemy bullets group
    this.enemyBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      defaultKey: 'enemyBullet',
      maxSize: 50
    });
    
    // Setup collision detection
    if (this.ship && this.bullets && this.enemies && this.enemyBullets) {
      // Bullet hits enemy
      this.physics.add.collider(this.bullets, this.enemies, this.bulletHitEnemy, undefined, this);
      
      // Enemy bullet hits player
      this.physics.add.collider(this.ship, this.enemyBullets, this.enemyBulletHitPlayer, undefined, this);
      
      // Player collides with enemy
      this.physics.add.collider(this.ship, this.enemies, this.playerHitEnemy, undefined, this);
    }
    
    // Setup keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Setup score counter
    this.scoreText = this.add.text(
      20, 
      80, 
      `Enemies: ${this.enemiesDefeated}/${this.totalEnemies}`, 
      { 
        font: '18px monospace',
        color: '#00ff00'
      }
    );
    
    // Create boss or spawn regular enemies
    if (this.isBossLevel) {
      this.createBoss();
    } else {
      this.startEnemySpawner();
    }
  }
  
  createBoss() {
    if (!this.enemies) return;
    
    // Create boss sprite
    this.boss = this.physics.add.sprite(this.cameras.main.width / 2, 100, 'boss');
    this.boss.setScale(1.5);
    this.boss.setImmovable(true);
    
    // Add boss to enemies group
    this.enemies.add(this.boss);
    this.enemyCount = 1;
    
    // Create boss health bar
    this.bossHealthBar = this.add.graphics();
    this.updateBossHealthBar();
    
    // Setup boss movement
    this.tweens.add({
      targets: this.boss,
      x: '+=200',
      ease: 'Sine.easeInOut',
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
    
    // Boss firing pattern based on level
    let fireRate = 0;
    if (this.level === 3) {
      fireRate = 2000; // Fire every 2 seconds
    } else if (this.level === 7) {
      fireRate = 1500; // Fire every 1.5 seconds
    } else if (this.level === 12) {
      fireRate = 1000; // Fire every 1 second
    }
    
    // Boss firing timer
    this.time.addEvent({
      delay: fireRate,
      callback: this.bossFire,
      callbackScope: this,
      loop: true
    });
  }
  
  updateBossHealthBar() {
    if (!this.bossHealthBar || !this.boss) return;
    
    this.bossHealthBar.clear();
    
    // Draw background
    this.bossHealthBar.fillStyle(0x666666);
    this.bossHealthBar.fillRect(this.cameras.main.width / 2 - 100, 30, 200, 20);
    
    // Draw health
    const healthPercentage = this.bossHealth / this.maxBossHealth;
    if (healthPercentage > 0.6) {
      this.bossHealthBar.fillStyle(0x00ff00);
    } else if (healthPercentage > 0.3) {
      this.bossHealthBar.fillStyle(0xffff00);
    } else {
      this.bossHealthBar.fillStyle(0xff0000);
    }
    this.bossHealthBar.fillRect(this.cameras.main.width / 2 - 100, 30, 200 * healthPercentage, 20);
  }
  
  startEnemySpawner() {
    // Spawn rate based on level
    const spawnRate = Math.max(1000 - (this.level * 50), 500);
    
    // Start spawner
    this.enemySpawnTimer = this.time.addEvent({
      delay: spawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }
  
  spawnEnemy() {
    if (!this.enemies || this.enemyCount >= this.totalEnemies) return;
    
    // Spawn position
    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
    const enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setScale(0.6);
    
    this.enemyCount++;
    
    // Set enemy velocity
    const speed = 50 + (this.level * 10);
    enemy.setVelocityY(speed);
    
    // Enemy shooting (only in higher levels)
    if (this.level > 3) {
      // Chance to shoot increases with level
      const shootChance = 0.01 * this.level;
      
      if (Math.random() < shootChance) {
        this.enemyFire(enemy);
      }
    }
  }
  
  enemyFire(enemy: Phaser.Physics.Arcade.Sprite) {
    if (!this.enemyBullets) return;
    
    const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(200);
      
      // Auto destroy when off screen
      bullet.setData('lifespan', 0);
    }
  }
  
  bossFire() {
    if (!this.boss || !this.enemyBullets) return;
    
    // Different firing patterns based on level
    if (this.level === 3) {
      // Single shot
      const bullet = this.enemyBullets.get(this.boss.x, this.boss.y + 30);
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(250);
      }
    } else if (this.level === 7) {
      // Triple shot
      for (let i = -1; i <= 1; i++) {
        const bullet = this.enemyBullets.get(this.boss.x + (i * 30), this.boss.y + 30);
        if (bullet) {
          bullet.setActive(true);
          bullet.setVisible(true);
          bullet.setVelocityY(250);
          bullet.setVelocityX(i * 50);
        }
      }
    } else if (this.level === 12) {
      // Circle shot (8 directions)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const vx = Math.cos(angle) * 200;
        const vy = Math.sin(angle) * 200;
        
        const bullet = this.enemyBullets.get(this.boss.x, this.boss.y);
        if (bullet) {
          bullet.setActive(true);
          bullet.setVisible(true);
          bullet.setVelocity(vx, vy);
        }
      }
    }
  }
  
  bulletHitEnemy(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    // Deactivate bullet
    (bullet as Phaser.Physics.Arcade.Image).setActive(false);
    (bullet as Phaser.Physics.Arcade.Image).setVisible(false);
    
    // Check if this is a boss
    if (enemy === this.boss) {
      // Reduce boss health
      this.bossHealth--;
      this.updateBossHealthBar();
      this.sound.play('hit');
      
      // Check if boss is defeated
      if (this.bossHealth <= 0) {
        this.enemies?.remove(this.boss, true, true);
        this.sound.play('explosion');
        this.enemiesDefeated++;
        this.updateScoreText();
        this.checkLevelComplete();
      }
    } else {
      // Destroy regular enemy
      (enemy as Phaser.Physics.Arcade.Sprite).destroy();
      this.sound.play('explosion');
      
      // Update score
      this.enemiesDefeated++;
      this.updateScoreText();
      
      // Check if level is complete
      this.checkLevelComplete();
    }
  }
  
  enemyBulletHitPlayer(ship: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    // Deactivate bullet
    (bullet as Phaser.Physics.Arcade.Image).setActive(false);
    (bullet as Phaser.Physics.Arcade.Image).setVisible(false);
    
    // Player hit, lose a life
    this.sound.play('hit');
    this.updateLives(-1);
    
    // Check if game over
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Flash player to indicate damage
      this.tweens.add({
        targets: ship,
        alpha: 0,
        duration: 100,
        ease: 'Power1',
        yoyo: true,
        repeat: 3
      });
    }
  }
  
  playerHitEnemy(ship: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    // Only if enemy isn't the boss
    if (enemy !== this.boss) {
      (enemy as Phaser.Physics.Arcade.Sprite).destroy();
      this.sound.play('explosion');
      
      // Lose a life
      this.updateLives(-1);
      
      // Check if game over
      if (this.lives <= 0) {
        this.gameOver();
      } else {
        // Flash player to indicate damage
        this.tweens.add({
          targets: ship,
          alpha: 0,
          duration: 100,
          ease: 'Power1',
          yoyo: true,
          repeat: 3
        });
      }
    }
  }
  
  updateScoreText() {
    if (this.scoreText) {
      this.scoreText.setText(`Enemies: ${this.enemiesDefeated}/${this.totalEnemies}`);
    }
  }
  
  checkLevelComplete() {
    if (this.enemiesDefeated >= this.totalEnemies) {
      this.levelComplete();
    }
  }
  
  update(time: number) {
    // Player movement
    if (this.ship && this.cursors) {
      if (this.cursors.left.isDown) {
        this.ship.setVelocityX(-this.shipSpeed);
      } else if (this.cursors.right.isDown) {
        this.ship.setVelocityX(this.shipSpeed);
      } else {
        this.ship.setVelocityX(0);
      }
      
      // Firing
      if (this.fireKey?.isDown && time > this.lastFired) {
        this.fireBullet();
        this.lastFired = time + this.fireRate;
      }
    }
    
    // Update enemy bullets lifespan
    if (this.enemyBullets) {
      this.enemyBullets.getChildren().forEach((bullet) => {
        const b = bullet as Phaser.Physics.Arcade.Image;
        const lifespan = b.getData('lifespan') || 0;
        
        if (lifespan > 1000) {
          b.setActive(false);
          b.setVisible(false);
        } else {
          b.setData('lifespan', lifespan + 16);
        }
      });
    }
    
    // Clean up offscreen enemies
    if (this.enemies && !this.isBossLevel) {
      this.enemies.getChildren().forEach((enemy) => {
        const e = enemy as Phaser.Physics.Arcade.Sprite;
        if (e.y > this.cameras.main.height + 50) {
          e.destroy();
        }
      });
    }
  }
  
  fireBullet() {
    if (!this.bullets || !this.ship) return;
    
    const bullet = this.bullets.get(this.ship.x, this.ship.y - 20);
    if (bullet) {
      this.sound.play('shoot');
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(-500);
      
      // Auto destroy when off screen
      this.time.delayedCall(1000, () => {
        bullet.setActive(false);
        bullet.setVisible(false);
      });
    }
  }
  
  levelComplete() {
    // Clean up
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.remove();
    }
    
    // Next level
    this.nextLevel();
    
    // Restart scene
    this.scene.restart();
  }
} 