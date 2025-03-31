import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import TestScene from '../scenes/TestScene';

interface PhaserGameProps {
  game?: string;
}

export default function PhaserGame({ game = 'Test' }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Configuration for our Phaser game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      scene: [TestScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: containerRef.current || undefined,
        width: '100%',
        height: '100%'
      },
      backgroundColor: '#000000'
    };

    // Create the game instance
    gameRef.current = new Phaser.Game(config);

    // Pass the selected game to the scene
    if (gameRef.current) {
      gameRef.current.scene.getScene('TestScene')?.events.emit('setGame', game);
    }

    // Cleanup function to destroy the game when the component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [game]);

  return <div ref={containerRef} className="w-full h-full" />;
} 