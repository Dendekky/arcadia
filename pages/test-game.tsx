import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Phaser scene dynamically to avoid SSR issues
const PhaserGame = dynamic(
  () => import('../components/PhaserGame'),
  { ssr: false }
);

export default function TestGame() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-3xl h-3/4 bg-black rounded-lg overflow-hidden">
        {mounted && <PhaserGame />}
      </div>
    </div>
  );
} 