import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type GameDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  status: 'gameOver' | 'levelComplete';
  onRetry?: () => void;
  onNextLevel?: () => void;
};

export function GameDialog({
  open,
  onClose,
  title,
  description,
  status,
  onRetry,
  onNextLevel,
}: GameDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="pixel-border crt-effect bg-gray-900 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl pixel-text">
            {status === 'gameOver' ? '💀 ' : '🎮 '}
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-green-400 font-mono">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-4 mt-4">
          {status === 'gameOver' && onRetry && (
            <Button 
              onClick={onRetry}
              className="bg-red-500 hover:bg-red-600 text-white font-mono pixel-text"
            >
              Try Again
            </Button>
          )}
          {status === 'levelComplete' && onNextLevel && (
            <Button 
              onClick={onNextLevel}
              className="bg-green-500 hover:bg-green-600 text-white font-mono pixel-text"
            >
              Next Level
            </Button>
          )}
          <Button 
            onClick={onClose} 
            variant="outline"
            className="border-2 border-white text-green-400 hover:bg-gray-800 font-mono"
          >
            Back to Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 