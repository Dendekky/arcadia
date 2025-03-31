import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import TestScene from '../scenes/TestScene';
import WhackAMoleScene from '../scenes/WhackAMoleScene';
import TetrisScene from '../scenes/TetrisScene';
import SnakeScene from '../scenes/SnakeScene';
import PingPongScene from '../scenes/PingPongScene';
import ShootingGameScene from '../scenes/ShootingGameScene';
import { GameDialog } from './GameDialog';

// Type for dialog callbacks that are passed to scenes
type DialogCallbacks = {
  onGameOver?: (score?: number) => void;
  onLevelComplete?: (level: number, score?: number) => void;
};

// Type for init data passed to scenes
interface SceneInitData {
  dialogCallbacks?: DialogCallbacks;
}

interface PhaserGameProps {
  game?: string;
  onReturnToMenu: () => void;
}

// Interface for scene methods used by PhaserGame
interface GameSceneInterface extends Phaser.Scene {
  resetGame?: () => void;
  resumeGame?: () => void;
  init?: (data: SceneInitData) => void;
}

export default function PhaserGame({ game = 'Test', onReturnToMenu }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef<GameSceneInterface | null>(null);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    description: string;
    status: 'gameOver' | 'levelComplete';
  }>({
    open: false,
    title: '',
    description: '',
    status: 'gameOver',
  });

  // Dialog callbacks for the game scenes
  const handleGameOver = (score?: number) => {
    setDialogState({
      open: true,
      title: 'Game Over!',
      description: `You lost all your lives. Your final score was ${score || 0}. Would you like to try again?`,
      status: 'gameOver',
    });
  };

  const handleLevelComplete = (level: number, score?: number) => {
    setDialogState({
      open: true,
      title: `Level ${level - 1} Completed!`,
      description: `Congratulations! You've completed level ${level - 1} with a score of ${score || 0}. Ready for level ${level}?`,
      status: 'levelComplete',
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ ...dialogState, open: false });
  };

  const handleRetry = () => {
    if (activeSceneRef.current) {
      // Call resetGame on the active scene
      activeSceneRef.current.resetGame?.();
      activeSceneRef.current.resumeGame?.();
    }
    handleCloseDialog();
  };

  const handleNextLevel = () => {
    if (activeSceneRef.current) {
      // Resume the game to proceed to the next level
      activeSceneRef.current.resumeGame?.();
    }
    handleCloseDialog();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to determine which scene to use based on the game prop
    const getSceneForGame = (): typeof Phaser.Scene => {
      switch (game) {
        case 'Whack-a-Mole':
          return WhackAMoleScene;
        case 'Tetris':
          return TetrisScene;
        case 'Snake':
          return SnakeScene;
        case 'Ping Pong':
          return PingPongScene;
        case 'Shooting Game':
          return ShootingGameScene;
        default:
          return TestScene;
      }
    };

    const SceneClass = getSceneForGame();

    // Configuration for our Phaser game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [SceneClass],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        parent: containerRef.current || undefined,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
      },
      backgroundColor: '#000000'
    };

    // Create the game instance
    gameRef.current = new Phaser.Game(config);

    // Wait for the scene to be created then pass the callbacks
    const setupScene = () => {
      if (gameRef.current) {
        const sceneName = Object.keys(gameRef.current.scene.keys)[0];
        const scene = gameRef.current.scene.getScene(sceneName) as GameSceneInterface;
        
        if (scene) {
          activeSceneRef.current = scene;
          scene.init?.({
            dialogCallbacks: {
              onGameOver: handleGameOver,
              onLevelComplete: handleLevelComplete
            }
          });
        }
      }
    };

    // Small delay to ensure scene is available
    setTimeout(setupScene, 100);

    // Cleanup function to destroy the game when the component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        activeSceneRef.current = null;
      }
    };
  }, [game]);

  return (
    <>
      <div className="relative w-full h-full flex flex-col">
        <div className="bg-gray-900 p-4 mb-4 rounded-lg flex justify-between items-center pixel-border">
          <h2 className="text-green-500 font-mono pixel-text text-xl">
            {game}
          </h2>
          <button 
            onClick={onReturnToMenu}
            className="bg-gray-800 text-green-500 font-mono px-4 py-2 rounded hover:bg-gray-700 border border-green-500 cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
        <div className="relative w-full h-full flex justify-center items-center bg-gray-900">
          <div 
            ref={containerRef} 
            className="w-full h-full max-w-[800px] max-h-[600px] pixel-border crt-effect relative"
          >
          </div>
        </div>
      </div>
      
      <GameDialog
        open={dialogState.open}
        onClose={onReturnToMenu}
        title={dialogState.title}
        description={dialogState.description}
        status={dialogState.status}
        onRetry={handleRetry}
        onNextLevel={handleNextLevel}
      />
    </>
  );
} 