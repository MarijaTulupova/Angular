import { Injectable, inject } from '@angular/core';
import { GameProgress, GameStore } from '../store/game.store2';
import { checkDraw, checkWinner } from '../store/helpers';

@Injectable({
  providedIn: 'root',
})
export class Game {
  gameStore = inject(GameStore);

  makeMove(position: number) {
    if (this.gameStore.isGameOver() || this.gameStore.winner()) return;

    const progress = { ...this.gameStore.gameProgess() };

    if (this.isPositionOccupied(position, progress)) return;

    const currentPlayer = this.gameStore.currentPlayer();

    progress[currentPlayer].push(position + 1);
    this.gameStore.makeMove(progress);

    if (this.checkEndGame(currentPlayer, progress)) return;

    this.gameStore.togglePlayer();

    const mode = this.gameStore.mode();
    if (mode === 'easy' || mode === 'medium') {
      this.makeBotMove(mode);
    }
  }

  private makeBotMove(mode: 'easy' | 'medium') {
    const botPlayer = this.gameStore.currentPlayer();
    const progress = { ...this.gameStore.gameProgess() };
    const emptyPositions = this.getEmptyPositions(progress);

    if (emptyPositions.length === 0) return;

    let botMove: number;

    if (mode === 'easy') {
      const randomIndex = Math.floor(Math.random() * emptyPositions.length);
      botMove = emptyPositions[randomIndex];
    } else {
      botMove = this.getMediumBotMove(botPlayer, progress, emptyPositions);
    }

    progress[botPlayer].push(botMove + 1);
    this.gameStore.makeMove(progress);

    if (this.checkEndGame(botPlayer, progress)) return;

    this.gameStore.togglePlayer();
  }

  private getMediumBotMove(
    botPlayer: 'X' | 'O',
    progress: GameProgress,
    emptyPositions: number[]
  ): number {
    const opponent = botPlayer === 'X' ? 'O' : 'X';

    for (let pos of emptyPositions) {
      const testProgress = { ...progress, [botPlayer]: [...progress[botPlayer], pos + 1] };
      if (checkWinner(botPlayer, testProgress)) return pos;
    }

    for (let pos of emptyPositions) {
      const testProgress = { ...progress, [opponent]: [...progress[opponent], pos + 1] };
      if (checkWinner(opponent, testProgress)) return pos;
    }

    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    return emptyPositions[randomIndex];
  }

  private getEmptyPositions(progress: GameProgress) {
    const allMoves = [...progress.X, ...progress.O];
    return Array.from({ length: 9 }, (_, i) => i).filter((i) => !allMoves.includes(i + 1));
  }

  private checkEndGame(player: 'X' | 'O', progress: GameProgress): boolean {
    if (checkWinner(player, progress)) {
      this.gameStore.setWinner(player);
      return true;
    }
    if (checkDraw(progress, this.gameStore.isGameOver())) {
      this.gameStore.setDraw();
      return true;
    }
    return false;
  }

  private isPositionOccupied(position: number, progress: GameProgress) {
    return progress.X.includes(position + 1) || progress.O.includes(position + 1);
  }
}
