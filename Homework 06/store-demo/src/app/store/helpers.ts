import { GameProgress } from './game.store2';

export const WINNING_PATTERNS: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

const progress: GameProgress = {
  X: [1, 2, 5, 9],
  O: [7, 8, 3],
};

export const checkWinner = (currentPlayer: 'X' | 'O', gameProgress: GameProgress) => {
  for (const pattern of WINNING_PATTERNS) {
    if (pattern.every((num) => gameProgress[currentPlayer].includes(num))) {
      return true;
    }
  }
  return false;
};

export const checkDraw = (gameProgess: GameProgress, isGameOver: boolean) => {
  const isDraw = gameProgess.X.length + gameProgess.O.length === 9 && !isGameOver;

  return isDraw;
};
