import { Component, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { GameStore } from '../../store/game.store2';
import { Game } from '../../services/game';

@Component({
  selector: 'app-board',
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
  imports: [NgIf, NgFor],
})
export class Board {
  gameStore = inject(GameStore);
  gameService = inject(Game);

  selectMode(mode: 'pvp' | 'easy' | 'medium') {
    this.gameStore.setMode(mode);
  }

  makeMove(index: number) {
    this.gameService.makeMove(index);
  }

  resetGame() {
    this.gameStore.resetGame();
  }
}
