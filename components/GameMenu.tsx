import { Button } from "./ui/button";

interface GameMenuProps {
  onGameSelect: (game: string) => void;
}

export default function GameMenu({ onGameSelect }: GameMenuProps) {
  const games = [
    "Whack-a-Mole",
    "Tetris",
    "Snake",
    "Ping Pong",
    "Shooting Game"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-900 rounded-lg border-2 border-green-500 shadow-lg">
      <h1 className="text-4xl font-mono text-green-500 text-center mb-8 pixel-text">Arcade Throwback Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <Button
            key={game}
            variant="outline"
            className="h-24 text-xl font-mono text-green-500 border-2 border-green-500 bg-gray-800 hover:bg-gray-700 hover:text-green-400 hover:border-green-400 transition-all cursor-pointer"
            onClick={() => onGameSelect(game)}
          >
            {game}
          </Button>
        ))}
      </div>
    </div>
  );
} 