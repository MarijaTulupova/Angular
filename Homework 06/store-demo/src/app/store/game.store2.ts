import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';

export interface GameProgress {
  X: number[];
  O: number[];
}

export interface GameState {
  currentPlayer: 'X' | 'O';
  winner: string | null;
  isGameOver: boolean;
  gameProgess: GameProgress;
  board: string[];
  mode: 'pvp' | 'easy' | 'medium' | null;
}

const initialState: GameState = {
  currentPlayer: 'X',
  winner: null,
  isGameOver: false,
  gameProgess: {
    X: [],
    O: [],
  },
  board: Array.from({ length: 9 }, () => ''),
  mode: null,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((state) => ({
    makeMove(newProgress: GameProgress) {
      patchState(state, { gameProgess: newProgress });

      const newBoard = Array.from({ length: 9 }, () => '');
      newProgress.X.forEach((pos) => (newBoard[pos - 1] = 'X'));
      newProgress.O.forEach((pos) => (newBoard[pos - 1] = 'O'));

      patchState(state, { board: newBoard });
    },

    togglePlayer() {
      const currentPlayer = state.currentPlayer();
      patchState(state, { currentPlayer: currentPlayer === 'X' ? 'O' : 'X' });
    },

    setWinner(winner: string) {
      patchState(state, { isGameOver: true, winner });
    },

    setDraw() {
      patchState(state, { isGameOver: true, winner: 'draw' });
    },

    resetGame() {
      patchState(state, {
        currentPlayer: 'X',
        winner: null,
        isGameOver: false,
        gameProgess: { X: [], O: [] },
        board: Array.from({ length: 9 }, () => ''),
        mode: null,
      });
    },

    setMode(mode: 'pvp' | 'easy' | 'medium') {
      patchState(state, { mode });
    },
  })),
  withComputed((store) => ({
    board: () => [...store.board()],
  }))
);
