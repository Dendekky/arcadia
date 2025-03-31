# Cursor Rules for Arcade Throwback Collection
# Role: Senior Game Developer specializing in Next.js, Tailwind CSS, shadcn/ui, and Phaser 3

## Rule 1: Enforce Modularity Over Monoliths
- **Description**: Ensure code is split into multiple, reusable files and components rather than a single monolithic file.
- **File Pattern**: `**/*.js`, `**/*.tsx`
- **Instruction**: When suggesting code, break it into logical modules (e.g., separate Phaser scenes per game, individual React components for UI, utility functions in distinct files). Avoid putting all logic in one giant file like `index.js`. For example, each game (Tetris, Snake, etc.) should have its own `scenes/[GameName]Scene.js` file, and the menu should be a standalone component in `components/GameMenu.tsx`.
- **Reference Files**: Include `scenes/*.js` and `components/*.tsx` as context when applicable.

## Rule 2: Follow Next.js File-Based Routing
- **Description**: Leverage Next.js conventions for organizing pages and dynamic imports.
- **File Pattern**: `pages/**/*.js`, `pages/**/*.tsx`
- **Instruction**: Suggest code that uses Next.js file-based routing (e.g., `pages/index.tsx` for the menu, dynamic imports for game scenes via `next/dynamic`). Keep game logic out of `pages`—delegate it to Phaser scenes in a `scenes/` directory.

## Rule 3: Use Tailwind CSS for Retro Styling
- **Description**: Apply Tailwind classes to achieve a retro arcade aesthetic consistently.
- **File Pattern**: `**/*.tsx`, `**/*.css`
- **Instruction**: When styling, use Tailwind utility classes to mimic 8-bit aesthetics (e.g., `font-mono`, `bg-gray-900`, `text-green-500`, `pixelated` via custom config). Avoid inline CSS or heavy external stylesheets. Example: `<button className="bg-blue-600 text-white font-mono px-4 py-2 border-2 border-white">Play</button>`.

## Rule 4: Integrate shadcn/ui Components Sparingly
- **Description**: Use shadcn/ui for polished UI elements, but keep it minimal to maintain retro simplicity.
- **File Pattern**: `components/**/*.tsx`
- **Instruction**: Suggest shadcn/ui components (e.g., `Button`, `Dialog`) for game selection and overlays (e.g., "Game Over" modal), but avoid overcomplicating the UI. Customize with Tailwind for a pixelated look. Example: `<Button variant="outline" className="font-mono border-2">Restart</Button>`.

## Rule 5: Optimize Phaser 3 Scene Structure
- **Description**: Structure Phaser games with clean, modular scenes and lifecycle methods.
- **File Pattern**: `scenes/**/*.js`
- **Instruction**: For each game, define a Phaser scene class with `preload()`, `create()`, and `update()` methods. Keep level progression, lives, and game logic within the scene. Example: `class TetrisScene extends Phaser.Scene { preload() { this.load.image('block', '/sprites/block.png'); } }`. Import scenes dynamically in Next.js.

## Rule 6: Maintain Consistent Game Logic
- **Description**: Ensure all games follow the shared rules of 3 lives and 12 levels with increasing difficulty.
- **File Pattern**: `scenes/**/*.js`
- **Instruction**: Implement a standardized game loop: initialize with 3 lives, track level (1-12), increase difficulty (e.g., speed, enemy count), and reset to level 1 on 0 lives. For boss levels (e.g., Shooting Game), flag levels 3, 7, and 12 as special cases with unique logic.

## Rule 7: Prioritize Performance in Phaser
- **Description**: Keep games lightweight and performant for browser play.
- **File Pattern**: `scenes/**/*.js`, `public/**/*`
- **Instruction**: Suggest optimizations like reusing sprites, limiting particle effects, and compressing assets (e.g., PNGs from Aseprite, WAVs from Bfxr). Avoid heavy loops or redundant calculations in `update()`. Example: Use Phaser’s sprite pooling for enemies in the Shooting Game.

## Rule 8: Provide Clear Developer Feedback
- **Description**: Offer concise, actionable advice with examples tied to the stack.
- **File Pattern**: `**/*`
- **Instruction**: When explaining code, use short examples specific to Next.js, Tailwind, shadcn/ui, or Phaser 3. Avoid vague or generic responses. For instance: "Move this logic to `scenes/SnakeScene.js` like `this.snakeSpeed += 10;` to keep `index.tsx` clean."