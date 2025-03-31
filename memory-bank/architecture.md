# Project Architecture: Arcade Throwback Collection

## Project Structure

```
arcade-throwback/
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   │   └── button.tsx      # Customizable button component
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
│   └── TestScene.ts        # Basic test scene for Phaser
├── styles/                 # CSS styles
│   └── globals.css         # Global styles with Tailwind directives
└── configuration files     # Various config files (next.config.js, etc.)
```

## Component Breakdown

### UI Components

- **button.tsx**: Reusable button component with multiple variants (default, outline, destructive, etc.) and sizes, built using class-variance-authority for style composition.

### Game Components

- **GameMenu.tsx**: Displays a grid of game options for user selection. Uses shadcn/ui Button components styled with Tailwind CSS for a retro arcade look.

- **PhaserGame.tsx**: React component that initializes and mounts a Phaser game instance. Handles the game lifecycle, configuration, and proper cleanup when unmounting. Accepts a `game` prop to determine which game to display.

### Game Scenes

- **BaseScene.ts**: A base class for all game scenes that implements common functionality like life and level tracking, UI elements, and game state management methods.

- **TestScene.ts**: A test scene that demonstrates how to receive and display the selected game. Will be replaced by actual game scenes.

## Utility Functions

- **utils.ts**: Contains the `cn()` utility function that combines class-variance-authority with tailwind-merge to handle className merging and conflicts.

## Page Structure

- **index.tsx**: Main entry point that contains the game selection menu and game display. Uses state management to switch between the menu and the selected game. Handles URL-based game selection via Next.js router.

- **[gameSlug].tsx**: Dynamic route that handles direct access to game URLs. Redirects to the index page while preserving the game slug in the URL.

- **test-game.tsx**: Test page for verifying Phaser integration, dynamically loads the PhaserGame component.

## Data Flow

1. **URL Parsing**: On initial load, the app checks for a game slug in the URL path.
2. **Game Selection**: User clicks a game in the `GameMenu` component or navigates directly to a game URL.
3. **State & URL Updates**: The selection triggers a state update in `index.tsx` and updates the browser URL.
4. **Game Loading**: The selected game is passed to the `PhaserGame` component.
5. **Scene Configuration**: The `PhaserGame` component creates a Phaser game with the appropriate scene.
6. **Game State Communication**: The selected game information is passed to the scene via Phaser events.

## Technologies Integration

1. **Next.js & React**: Provides the application framework, routing, and component structure.
2. **Tailwind CSS**: Supplies utility-first styling for rapid development.
3. **shadcn/ui**: Offers customizable, accessible UI components built on Tailwind.
4. **Phaser 3**: Powers the game logic, rendering, physics, and animation.

## Architectural Decisions

1. **Dynamic Imports**: Phaser is imported dynamically to avoid SSR issues, as it requires browser APIs.
2. **Component Modularity**: Each game will be encapsulated in its own Phaser scene, allowing for independent development and maintenance.
3. **Styling Approach**: Using Tailwind for UI elements and shadcn/ui for complex components, providing a balanced approach to styling.
4. **Asset Organization**: Sprites and sounds are separated for easier asset management.

## Planned Extensions

1. **Game State Management**: Will be added to track player progress, lives, and level state.
2. **Common Base Scene**: Will be implemented to share functionality across all games.
3. **Responsive Design**: All UI elements will be responsive, while games will maintain aspect ratios to ensure gameplay quality.
