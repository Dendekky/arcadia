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
      <DialogContent className="border-4 border-dashed border-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {status === 'gameOver' ? '💀 ' : '🎮 '}
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-4 mt-4">
          {status === 'gameOver' && onRetry && (
            <Button 
              onClick={onRetry}
              className="bg-red-500 hover:bg-red-600 text-white border-2 border-white"
            >
              Try Again
            </Button>
          )}
          {status === 'levelComplete' && onNextLevel && (
            <Button 
              onClick={onNextLevel}
              className="bg-green-500 hover:bg-green-600 text-white border-2 border-white"
            >
              Next Level
            </Button>
          )}
          <Button 
            onClick={onClose} 
            variant="outline"
            className="border-2 border-white text-green-400 hover:bg-gray-800"
          >
            Back to Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 