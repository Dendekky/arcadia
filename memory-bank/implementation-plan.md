# Implementation Plan: Arcade Throwback Collection

## Overview
This plan outlines the step-by-step process to build a browser-based app with five retro 2D games (*Whack-a-Mole*, *Tetris*, *Snake*, *Ping Pong*, *Shooting Game*) using Next.js, Tailwind CSS, shadcn/ui, and Phaser 3. Each game has 12 levels, 3 lives, and increasing difficulty, with boss levels where applicable. The app features a modular structure, a retro-styled menu, and simple gameplay.

## Prerequisites
- Node.js and npm installed on your machine.
- A text editor (e.g., VS Code).
- Basic familiarity with the terminal and Git.

---

## Phase 1: Project Setup

### Step 1: Initialize Next.js Project
- **Instruction**: Run `npx create-next-app@latest arcade-throwback --typescript` in the terminal to create a new Next.js project with TypeScript.
- **Test**: Run `npm run dev`, and open `http://localhost:3000` in a browser. Verify a default Next.js welcome page loads.

### Step 2: Install Tailwind CSS
- **Instruction**: In the project folder, run `npm install -D tailwindcss postcss autoprefixer`, then `npx tailwindcss init -p` to generate config files. Update `tailwind.config.js` to include `content: ["./pages/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"]`. Add Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) to `styles/globals.css`.
- **Test**: Add `<div className="bg-blue-500 text-white p-4">Test</div>` to `pages/index.tsx`. Run `npm run dev` and check `http://localhost:3000`. Verify a blue box with white text appears.

### Step 3: Install shadcn/ui Dependencies
- **Instruction**: Run `npm install class-variance-authority clsx tailwind-merge` to add shadcn/ui dependencies. Create a `components/ui/` folder.
- **Test**: Manually copy the `Button` component from shadcn/ui docs into `components/ui/button.tsx`. Import and add `<Button>Test Button</Button>` to `pages/index.tsx`. Run `npm run dev` and verify a styled button appears on `http://localhost:3000`.

### Step 4: Install Phaser 3
- **Instruction**: Run `npm install phaser` to add Phaser 3 to the project.
- **Test**: Create `scenes/TestScene.ts` with a basic Phaser scene class (empty for now). Import it in `pages/index.tsx` using `dynamic` from `next/dynamic` with `{ ssr: false }`. Run `npm run dev` and check the console (`F12`). Verify no errors about Phaser occur.

### Step 5: Set Up Project Structure
- **Instruction**: Create folders: `scenes/` for Phaser game scenes, `components/` for React components, `public/sprites/` and `public/sounds/` for assets. Delete unused boilerplate (e.g., `pages/api/`).
- **Test**: Run `ls dir` (or `dir` on Windows) in the terminal. Verify the folder structure: `components/`, `scenes/`, `public/sprites/`, `public/sounds/`. Open `pages/index.tsx` and ensure it still loads at `http://localhost:3000`.

---

## Phase 2: Game Menu UI

### Step 6: Create GameMenu Component
- **Instruction**: In `components/`, create `GameMenu.tsx`. Add a grid layout with five shadcn/ui `Button` components (one per game: Whack-a-Mole, Tetris, Snake, Ping Pong, Shooting Game). Use Tailwind classes (e.g., `grid grid-cols-2 gap-4 p-4 bg-gray-900 text-green-500 font-mono`).
- **Test**: Import `GameMenu` into `pages/index.tsx` and render it. Run `npm run dev`. Verify `http://localhost:3000` shows a retro-styled grid with five clickable buttons labeled with game names.

### Step 7: Add Game Selection State
- **Instruction**: In `pages/index.tsx`, add a `useState` hook to track the selected game (e.g., `null` or a game name). Pass a setter to `GameMenu` and update it on button clicks.
- **Test**: Click each button in the browser. Open the React DevTools (`F12`) and check that the state updates to the clicked game's name (e.g., "Tetris").

### Step 8: Implement URL-Based Navigation
- **Instruction**: Add mappings between game names and URL slugs. Use Next.js `useRouter` to update the URL when a game is selected (e.g., `/tetris`). Create a dynamic `[gameSlug].tsx` route file to handle direct URL access. On page load, check the URL and set the initial game state based on the slug.
- **Test**: Select a game and verify the URL updates accordingly (e.g., `http://localhost:3000/tetris`). Refresh the page and verify the same game loads. Try entering game URLs directly and check that the correct game loads.

---

## Phase 3: Game Scene Foundations

### Step 9: Create Base Phaser Scene
- **Instruction**: In `scenes/`, create `BaseScene.ts`. Define a Phaser scene class with properties for lives (3), level (1), and methods `preload()`, `create()`, `update()`. Add a simple text overlay for lives and level using Phaser's text object.
- **Test**: Extend `BaseScene` in a new `scenes/TestScene.ts`. Load it dynamically in `pages/index.tsx` when a game is selected. Run `npm run dev`, select a game, and verify a canvas appears with "Lives: 3" and "Level: 1" text.

### Step 10: Add Asset Folders and Test Assets
- **Instruction**: Download or create a sample sprite (e.g., `mole.png`) with Aseprite and a sound (e.g., `bonk.wav`) with Bfxr. Place them in `public/sprites/` and `public/sounds/`.
- **Test**: In `TestScene.ts`, preload the sprite and sound (`this.load.image`, `this.load.audio`), then add the sprite and play the sound in `create()`. Run `npm run dev`, select a game, and verify the sprite appears and sound plays on load.

---

## Phase 4: Implement Individual Games

### Step 11: Build Whack-a-Mole Scene
- **Instruction**: Create `scenes/WhackAMoleScene.ts`. Extend `BaseScene`. Add 6 holes, random mole pop-ups, click detection, and level logic (5-15 moles, 20-9s, target scores). Decrease lives on failure, reset to level 1 at 0 lives.
- **Test**: Load the scene via the menu. Verify moles appear, clicking whacks them, lives decrease on failure, and level 12 is frantic (15 moles, 9s).

### Step 12: Build Tetris Scene
- **Instruction**: Create `scenes/TetrisScene.ts`. Extend `BaseScene`. Add a 10x20 grid, falling tetrominoes, rotation/movement, and line-clearing logic. Implement levels (5-27 lines) with increasing drop speed.
- **Test**: Load the scene. Verify tetrominoes fall, rotate, stack, clear lines, and level 12 is fast with 27 lines required.

### Step 13: Build Snake Scene
- **Instruction**: Create `scenes/SnakeScene.ts`. Extend `BaseScene`. Add a 15x15 grid, snake movement, food spawning, and growth logic. Implement levels (target length 10-32) with speed/obstacles.
- **Test**: Load the scene. Verify snake moves, grows, crashes reduce lives, and level 12 has moving obstacles.

### Step 14: Build Ping Pong Scene
- **Instruction**: Create `scenes/PingPongScene.ts`. Extend `BaseScene`. Add player/AI paddles, ball physics, and scoring. Implement levels (5-27 points) with faster ball/smaller AI paddle.
- **Test**: Load the scene. Verify ball bounces, scoring works, lives decrease if AI wins, and level 12 is challenging.

### Step 15: Build Shooting Game Scene
- **Instruction**: Create `scenes/ShootingGameScene.ts`. Extend `BaseScene`. Add ship movement, shooting, enemy waves, and boss levels (3, 7, 12). Implement levels (10-30 enemies, bosses with 20-50 HP).
- **Test**: Load the scene. Verify ship shoots, enemies spawn, bosses appear at 3/7/12, and level 12 has a tough boss.

---

## Phase 5: Polish and Integration

### Step 16: Add Game Over and Level Transition
- **Instruction**: In `BaseScene.ts`, add a shadcn/ui `Dialog` (via a React callback) for "Game Over" (0 lives) and "Level Cleared" (target met). Reset or advance accordingly.
- **Test**: Fail a level in any game. Verify "Game Over" dialog appears at 0 lives and resets to level 1. Clear a level and verify "Level Cleared" advances to the next.

### Step 17: Style Menu and Overlays
- **Instruction**: Update `GameMenu.tsx` and scene overlays with Tailwind for a consistent retro look (e.g., `font-mono`, `text-green-500`, `bg-gray-900`, pixelated borders).
- **Test**: Run `npm run dev`. Verify the menu and in-game overlays (lives, level) have a cohesive 8-bit aesthetic.

---

## Phase 6: Deployment

### Step 18: Build and Test Locally
- **Instruction**: Run `npm run build` then `npm run start`. Open `http://localhost:3000`.
- **Test**: Verify all five games load, play correctly, and UI behaves as expected in the production build.

### Step 19: Deploy to Vercel
- **Instruction**: Initialize a Git repo (`git init`), commit all changes (`git add .`, `git commit -m "Initial build"`), push to a GitHub repo, and link it to Vercel via their dashboard. Deploy the app.
- **Test**: Visit the deployed URL (e.g., `arcade-throwback.vercel.app`). Verify the app loads, all games work, and no errors appear in the console (`F12`).

---

## Completion
- All five games are implemented with 12 levels, 3 lives, and boss levels where specified.
- The app is modular (separate scenes/components), styled retro, and deployed online.