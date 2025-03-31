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

  const gameIcons = {
    "Whack-a-Mole": "🔨",
    "Tetris": "🧩",
    "Snake": "🐍",
    "Ping Pong": "🏓",
    "Shooting Game": "🚀"
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-900 rounded-lg border-4 border-white border-dashed shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <Button
            key={game}
            variant="outline"
            className="h-24 text-xl font-mono text-green-500 border-4 border-white bg-gray-800 hover:bg-gray-700 hover:text-green-400 transition-all cursor-pointer p-0 overflow-hidden"
            onClick={() => onGameSelect(game)}
          >
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="absolute top-1 left-1 text-2xl">{gameIcons[game as keyof typeof gameIcons]}</div>
              <div className="text-xl">{game}</div>
              <div className="text-xs text-green-300 mt-1">Press Start</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
} 