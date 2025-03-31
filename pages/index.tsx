import { useState, useEffect } from "react";
import { Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import GameMenu from "../components/GameMenu";

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

// Reverse mapping for getting slugs from game names
const gameNameToSlug: Record<string, string> = {
  "Whack-a-Mole": "whack-a-mole",
  "Tetris": "tetris",
  "Snake": "snake",
  "Ping Pong": "ping-pong",
  "Shooting Game": "shooting-game"
};

export default function Home() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Check URL for game slug on initial load
  useEffect(() => {
    setMounted(true);
    
    if (router.isReady) {
      // Only update from URL if we're at root path
      // This prevents issues with direct game URLs
      if (router.pathname === '/') {
        const slug = router.asPath.split('/')[1];
        if (slug && gameSlugMap[slug]) {
          setSelectedGame(gameSlugMap[slug]);
        }
      }
    }
  }, [router.isReady, router.asPath, router.pathname]);

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
    
    // Update URL with the game slug
    const slug = gameNameToSlug[game];
    if (slug) {
      router.push(`/${slug}`, undefined, { shallow: true });
    }
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
    
    // Reset URL to root
    router.push('/', undefined, { shallow: true });
  };

  return (
    <div className={`${geistMono.variable} min-h-screen bg-gray-800 flex items-center justify-center p-4`}>
      {selectedGame ? (
        <div className="w-full max-w-4xl h-[80vh] flex flex-col">
          <div className="bg-gray-900 p-4 mb-4 rounded-lg flex justify-between items-center">
            <h2 className="text-green-500 font-mono pixel-text text-xl">
              {selectedGame}
            </h2>
            <button 
              onClick={handleBackToMenu}
              className="bg-gray-700 text-green-500 font-mono px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
          <div className="flex-1 bg-black rounded-lg overflow-hidden">
            {mounted && <PhaserGame game={selectedGame} />}
          </div>
        </div>
      ) : (
        <GameMenu onGameSelect={handleGameSelect} />
      )}
    </div>
  );
}
