import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import TestScene from '../scenes/TestScene';
import WhackAMoleScene from '../scenes/WhackAMoleScene';
import TetrisScene from '../scenes/TetrisScene';
import SnakeScene from '../scenes/SnakeScene';
import PingPongScene from '../scenes/PingPongScene';
import ShootingGameScene from '../scenes/ShootingGameScene';
import { GameDialog } from './GameDialog';

interface PhaserGameProps {
  game?: string;
  onReturnToMenu: () => void;
}

export default function PhaserGame({ game = 'Test', onReturnToMenu }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef<Phaser.Scene | null>(null);
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
      (activeSceneRef.current as any).resetGame?.();
      (activeSceneRef.current as any).resumeGame?.();
    }
    handleCloseDialog();
  };

  const handleNextLevel = () => {
    if (activeSceneRef.current) {
      // Resume the game to proceed to the next level
      (activeSceneRef.current as any).resumeGame?.();
    }
    handleCloseDialog();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
        const scene = gameRef.current.scene.getScene(sceneName);
        
        if (scene) {
          activeSceneRef.current = scene;
          (scene as any).init?.({
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
      <div className="relative w-full h-full flex justify-center items-center bg-gray-900">
        <div ref={containerRef} className="w-full h-full max-w-[800px] max-h-[600px] border-4 border-white" />
        <button 
          onClick={onReturnToMenu}
          className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-green-400 px-2 py-1 rounded-md border-2 border-white text-sm font-mono"
        >
          Back to Menu
        </button>
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