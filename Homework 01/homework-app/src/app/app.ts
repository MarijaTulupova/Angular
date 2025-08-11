import { Component, signal } from '@angular/core';
import { TaskManager } from './components/task-manager/task-manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskManager],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('homework-app');
}
