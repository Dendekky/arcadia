import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Phaser
const PhaserGame = dynamic(
  () => import('../components/PhaserGame'),
  { ssr: false }
);

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Game slug mapping
const gameSlugMap: Record<string, string> = {
  "whack-a-mole": "Whack-a-Mole",
  "tetris": "Tetris",
  "snake": "Snake",
  "ping-pong": "Ping Pong",
  "shooting-game": "Shooting Game"
};

export default function GameSlugPage() {
  const router = useRouter();
  const { gameSlug } = router.query;

  useEffect(() => {
    // If the slug is invalid, redirect to home
    if (router.isReady && gameSlug && typeof gameSlug === 'string' && !gameSlugMap[gameSlug]) {
      router.replace('/', undefined, { shallow: true });
    }
  }, [router.isReady, gameSlug, router]);

  // Don't render anything until router is ready
  if (!router.isReady || !gameSlug || typeof gameSlug !== 'string') {
    return null;
  }

  // Get the game name from slug
  const selectedGame = gameSlugMap[gameSlug];
  
  // If invalid slug, don't render
  if (!selectedGame) {
    return null;
  }

  const handleBackToMenu = () => {
    router.push('/', undefined, { shallow: true });
  };

  return (
    <div className={`${geistMono.variable} min-h-screen bg-gray-900 flex items-center justify-center p-4`}>
      <div className="w-full max-w-4xl h-[80vh] flex flex-col">
        <h1 className="text-3xl text-green-500 font-mono mb-4 text-center">
          Arcade Throwback Collection
        </h1>
        <div className="flex-1 bg-black rounded-lg overflow-hidden border-4 border-white relative">
          <PhaserGame game={selectedGame} onReturnToMenu={handleBackToMenu} />
        </div>
      </div>
    </div>
  );
}