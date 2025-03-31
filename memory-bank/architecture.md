# Project Architecture: Arcade Throwback Collection

## Project Structure

```
arcade-throwback/
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   │   └── button.tsx      # Customizable button component
│   └── PhaserGame.tsx      # Container for mounting Phaser games
├── lib/                    # Utility functions
│   └── utils.ts            # Common utilities (e.g., className merging)
├── pages/                  # Next.js pages (routes)
│   ├── index.tsx           # Homepage with game menu
│   └── test-game.tsx       # Test page for Phaser integration
├── public/                 # Static assets
│   ├── sprites/            # Game sprites and images
│   └── sounds/             # Game audio files
├── scenes/                 # Phaser game scenes
│   └── TestScene.ts        # Basic test scene for Phaser
├── styles/                 # CSS styles
│   └── globals.css         # Global styles with Tailwind directives
└── configuration files     # Various config files (next.config.js, etc.)
```

## Component Breakdown

### UI Components

- **button.tsx**: Reusable button component with multiple variants (default, outline, destructive, etc.) and sizes, built using class-variance-authority for style composition.

### Game Components

- **PhaserGame.tsx**: React component that initializes and mounts a Phaser game instance. Handles the game lifecycle, configuration, and proper cleanup when unmounting.

### Game Scenes

- **TestScene.ts**: Basic Phaser scene template that demonstrates the core Phaser lifecycle methods (preload, create, update) and simple text rendering.

## Utility Functions

- **utils.ts**: Contains the `cn()` utility function that combines class-variance-authority with tailwind-merge to handle className merging and conflicts.

## Page Structure

- **index.tsx**: Main entry point that will eventually contain the game selection menu.
- **test-game.tsx**: Test page for verifying Phaser integration, dynamically loads the PhaserGame component.

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
