# Tech Stack: Arcade Throwback Collection

## Overview
This tech stack powers a browser-based application hosting five retro 2D games (*Whack-a-Mole*, *Tetris*, *Snake*, *Ping Pong*, *Shooting Game*). It’s designed to be modern, lightweight, and easy to develop while delivering a nostalgic arcade feel. All components are client-side, with no backend included.

---

## Core Technologies

### Framework: Next.js
- **Purpose**: Full-stack React framework for building the app structure, routing, and dynamic game loading.
- **Details**: Uses TypeScript for type safety. Leverages file-based routing (`pages/`) and dynamic imports (`next/dynamic`) to load Phaser scenes on demand.
- **Why Chosen**: Simplifies project setup, supports static site generation for easy deployment, and integrates seamlessly with Tailwind and Phaser.

### Styling: Tailwind CSS
- **Purpose**: Utility-first CSS framework for styling the game menu and in-game overlays.
- **Details**: Provides rapid, responsive design with classes like `bg-gray-900`, `text-green-500`, and `font-mono` to achieve a retro aesthetic.
- **Why Chosen**: Lightweight, customizable, and pairs well with shadcn/ui for a modern yet simple styling solution.

### UI Components: shadcn/ui
- **Purpose**: Pre-built, customizable React components for polished UI elements.
- **Details**: Uses components like `Button` and `Dialog` for game selection and overlays (e.g., "Game Over"). Styled with Tailwind for consistency.
- **Why Chosen**: Offers flexibility without the overhead of a full library—just copy-paste code. Keeps UI minimal and retro-friendly.

### Game Engine: Phaser 3
- **Purpose**: HTML5 game framework for implementing 2D game logic and rendering.
- **Details**: Handles game scenes, sprites, physics, and audio. Each game is a modular `Phaser.Scene` class (e.g., `TetrisScene`).
- **Why Chosen**: Ideal for lightweight 2D games, browser-native, and supports the arcade throwback vibe with pixel-art and 8-bit sounds.

---

## Supporting Tools

### Asset Creation
- **Sprites: Aseprite**
  - **Purpose**: Create pixel-art sprites for game objects (e.g., moles, tetrominoes, ships).
  - **Details**: Outputs PNG files stored in `public/sprites/`.
  - **Why Chosen**: Industry-standard for retro-style graphics, simple to use.

- **Sounds: Bfxr**
  - **Purpose**: Generate 8-bit sound effects (e.g., "bonk," "pew," explosions).
  - **Details**: Outputs WAV files stored in `public/sounds/`.
  - **Why Chosen**: Free, easy, and perfect for arcade nostalgia.

### Deployment: Vercel
- **Purpose**: Host the static Next.js app online.
- **Details**: Deploys directly from a GitHub repo with zero-config setup.
- **Why Chosen**: Free tier, seamless integration with Next.js, and fast deployment for a client-side app.

---

## Project Structure
- **`pages/`**: Next.js routing (e.g., `index.tsx` for the menu).
- **`components/`**: React components (e.g., `GameMenu.tsx`, shadcn/ui elements).
- **`scenes/`**: Phaser game scenes (e.g., `WhackAMoleScene.ts`).
- **`public/`**: Static assets (`sprites/`, `sounds/`).
- **`styles/`**: Global CSS with Tailwind directives.

---

## Notes
- No backend is included; all logic is client-side for simplicity.
- The stack ensures modularity (separate scenes/components), a retro feel (Tailwind + assets), and easy deployment (Vercel).
- Built with developer experience in mind, following Cursor rules like avoiding monoliths.