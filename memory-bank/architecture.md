# Project Architecture: Arcade Throwback Collection

## Project Structure

```
arcade-throwback/
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   │   └── button.tsx      # Customizable button component
│   ├── dialog.tsx          # Modular dialog component
│   ├── GameMenu.tsx        # Game selection menu component
│   └── PhaserGame.tsx      # Container for mounting Phaser games
├── lib/                    # Utility functions
│   └── utils.ts            # Common utilities (e.g., className merging)
├── pages/                  # Next.js pages (routes)
│   ├── index.tsx           # Homepage with game menu and game display
│   └── test-game.tsx       # Test page for Phaser integration
├── public/                 # Static assets
│   ├── sprites/            # Game sprites and images
│   └── sounds/             # Game audio files
├── scenes/                 # Phaser game scenes
│   ├── BaseScene.ts        # Common base scene with shared functionality
│   ├── WhackAMoleScene.ts  # Whack-a-Mole game implementation
│   ├── TetrisScene.ts      # Tetris game implementation
│   ├── SnakeScene.ts       # Snake game implementation
│   ├── PingPongScene.ts    # Ping Pong game implementation
│   ├── ShootingGameScene.ts # Shooting game implementation
│   └── TestScene.ts        # Basic test scene for Phaser
├── styles/                 # CSS styles
│   └── globals.css         # Global styles with Tailwind directives
└── configuration files     # Various config files (next.config.js, etc.)
```

## Component Breakdown

### UI Components

- **button.tsx**: Reusable button component with multiple variants (default, outline, destructive, etc.) and sizes, built using class-variance-authority for style composition.

- **dialog.tsx**: Modular dialog component built with Radix UI that provides accessible modal dialogs. Styled with a retro arcade aesthetic using border styling and green monospace text.

### Game Components

- **GameMenu.tsx**: Displays a grid of game options for user selection. Uses shadcn/ui Button components styled with Tailwind CSS for a retro arcade look. Each game button features an emoji icon, game title, and "Press Start" prompt.

- **PhaserGame.tsx**: React component that initializes and mounts a Phaser game instance. Handles the game lifecycle, configuration, and proper cleanup when unmounting. Manages dialog state for game over and level completion, and provides callbacks to the game scenes.

- **GameDialog.tsx**: Specialized dialog component that displays contextual information for game over and level completion scenarios. Features different buttons based on the game state (Try Again for game over, Next Level for level completion). Uses the base dialog component with custom styling.

### Game Scenes

- **BaseScene.ts**: A base class for all game scenes that implements common functionality like life and level tracking, UI elements, and game state management methods. Provides consistent methods such as updateLives(), updateLevel(), nextLevel(), and gameOver() that are used across all game implementations.

- **WhackAMoleScene.ts**: Implementation of the Whack-a-Mole game. Features a grid of holes where moles randomly appear, click detection for whacking moles, score tracking, and dynamic difficulty scaling based on level (more moles, faster pop-ups, less time).

- **TetrisScene.ts**: Classic Tetris implementation with 7 tetromino shapes, rotation mechanics, collision detection, line clearing, and progressive difficulty. Uses Phaser's graphics rendering for drawing the game board and tetrominoes.

- **SnakeScene.ts**: Snake game implementation featuring snake movement and growth mechanics, food spawning, collision detection, and obstacles. Difficulty increases with level, introducing more obstacles that begin to move at higher levels.

- **PingPongScene.ts**: Pong-style game with player-controlled paddle, AI opponent, ball physics, and scoring system. The AI's difficulty scales with level, with a smaller paddle and better prediction at higher levels.

- **ShootingGameScene.ts**: Vertical shooter game with player ship, enemy waves, and boss levels. Features different enemy types, bullet patterns, and boss mechanics that vary based on level. Includes special boss fights at levels 3, 7, and 12.

- **TestScene.ts**: A basic scene for testing Phaser integration with Next.js and verifying proper game initialization.

## Data Flow

1. **URL Parsing**: On initial load, the app checks for a game slug in the URL path.
2. **Game Selection**: User clicks a game in the `GameMenu` component or navigates directly to a game URL.
3. **State & URL Updates**: The selection triggers a state update in `index.tsx` and updates the browser URL.
4. **Game Loading**: The selected game is passed to the `PhaserGame` component.
5. **Scene Configuration**: The `PhaserGame` component creates a Phaser game with the appropriate scene based on the selection.
6. **Game State Management**: Each game scene inherits from BaseScene and implements specific game mechanics while maintaining consistent life and level tracking.

## Game Scene Architecture

### Common Scene Elements
All game scenes inherit from BaseScene and implement the following:

1. **State Management**:
   - Lives (3 by default, lose 1 on failure, game over at 0)
   - Level (1-12, with increasing difficulty)
   - Score/progress tracking specific to each game
   - Dialog callbacks for game over and level completion

2. **Scene Lifecycle Methods**:
   - `init()`: Resets and initializes the game state, receives dialog callbacks
   - `preload()`: Loads assets (sprites, sounds)
   - `create()`: Sets up game objects and input handling
   - `update()`: Handles game logic on each frame

3. **Level Progression**:
   - Difficulty parameters adjusted based on level
   - Win condition check (progress to next level)
   - Failure condition check (lose a life)
   - Dialog display and game pausing

4. **User Interface**:
   - Lives counter (top left)
   - Level counter (below lives)
   - Score display (below level)
   - Modal dialogs for game events

### Specific Game Implementations

1. **WhackAMoleScene**:
   - Uses a grid-based approach for mole positions
   - Timer-based mole appearance and disappearance
   - Click/tap detection for interaction
   - Increasing difficulty: more moles, faster pop-ups, less time

2. **TetrisScene**:
   - Matrix-based board representation
   - Shape rotation and collision detection
   - Line clearing and scoring
   - Increasing difficulty: faster drop speed

3. **SnakeScene**:
   - Array-based snake representation
   - Direction-based movement
   - Collision detection with walls, self, obstacles
   - Increasing difficulty: faster movement, more obstacles

4. **PingPongScene**:
   - Physics-based ball movement
   - Keyboard-controlled player paddle
   - AI-controlled opponent
   - Increasing difficulty: faster ball, smaller AI paddle

5. **ShootingGameScene**:
   - Player movement and shooting
   - Enemy wave spawning
   - Boss mechanics with health tracking
   - Increasing difficulty: more enemies, complex bullet patterns

## Technologies Integration

1. **Next.js & React**: Provides the application framework, routing, and component structure.
2. **Tailwind CSS**: Supplies utility-first styling for rapid development.
3. **shadcn/ui**: Offers customizable, accessible UI components built on Tailwind.
4. **Phaser 3**: Powers the game logic, rendering, physics, and animation.

## Architectural Decisions

1. **Dynamic Imports**: Phaser is imported dynamically to avoid SSR issues, as it requires browser APIs.
2. **Component Modularity**: Each game is encapsulated in its own Phaser scene, allowing for independent development and maintenance.
3. **Styling Approach**: Using Tailwind for UI elements and shadcn/ui for complex components, providing a balanced approach to styling.
4. **Asset Organization**: Sprites and sounds are separated for easier asset management.
5. **Inheritance Pattern**: All game scenes inherit from BaseScene to maintain consistent UI elements and game state management.
6. **Level-Based Difficulty**: Each game implements a progressive difficulty system based on the current level, providing a balanced gameplay experience.

## Implementation Insights

1. **Graphics Rendering**: Most games use Phaser's Graphics object for rendering, avoiding the need for complex sprite assets in early development.
2. **Collision Detection**: Games leverage Phaser's physics system for collision detection and object interactions.
3. **Input Handling**: A mix of mouse/touch input (Whack-a-Mole) and keyboard controls (other games) to demonstrate Phaser's input flexibility.
4. **Timers and Events**: Extensive use of Phaser's timer and event system for game mechanics like enemy spawning and automated movements.
5. **Progressive Difficulty**: Each game implements a custom approach to increasing difficulty based on level, creating a balanced gameplay experience.

## Planned Extensions

1. **Game State Management**: Will be added to track player progress, lives, and level state.
2. **Common Base Scene**: Will be implemented to share functionality across all games.
3. **Responsive Design**: All UI elements will be responsive, while games will maintain aspect ratios to ensure gameplay quality.

## Assets Architecture

All game assets are organized in the public directory with a consistent SVG-based approach:

1. **Sprite Assets**:
   - `mole.svg`: Character for the Whack-a-Mole game
   - `tetromino.svg`: Block for the Tetris game
   - `snake.svg`: Head sprite for the Snake game
   - `food.svg`: Food item for the Snake game
   - `paddle.svg`: Player and AI paddles for Ping Pong
   - `ball.svg`: Ball for Ping Pong
   - `ship.svg`: Player ship for Shooting Game
   - `enemy.svg`: Enemy ship for Shooting Game
   - `boss.svg`: Boss enemy for level 3, 7, and 12 in Shooting Game

2. **Sound Assets** (planned for Phase 5):
   - Game background music
   - Action sound effects (whack, collision, etc.)
   - UI interaction sounds
   - Win/lose effect sounds

## Data Flow and User Interaction

1. **Game Selection Flow**:
   - User selects a game from the GameMenu component
   - Selection updates state in index.tsx and updates the URL
   - PhaserGame component loads with the selected game
   - Game scene is initialized with dialog callbacks

2. **Game Interaction Flow**:
   - User plays the game using keyboard/mouse
   - BaseScene tracks lives, level, and score
   - On game over: scene pauses, GameDialog shows with retry option
   - On level complete: scene pauses, GameDialog shows with next level option

3. **Dialog Interaction Flow**:
   - GameDialog displays with context-specific options
   - "Try Again" resets the game via resetGame() method
   - "Next Level" resumes the game via resumeGame() method
   - "Back to Menu" returns to the game selection screen
