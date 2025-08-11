import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, effect, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.css',
})
export class TaskManager implements OnInit {
  tasks = signal([
    { text: 'Walk the dog', completed: false },
    { text: 'Write Angular homework', completed: false },
    { text: 'Watch movie', completed: false },
  ]);

  newTask = signal('');

  completedCount = computed(
    () => this.tasks().filter((t) => t.completed).length
  );
  pendingCount = computed(
    () => this.tasks().filter((t) => !t.completed).length
  );

  constructor() {
    effect(() => {
      console.log('Tasks updated:', this.tasks());
    });
  }

  hasTasks = computed(() => this.tasks().length > 0);

  ngOnInit() {
    console.log('TaskManager component initialized!');
  }

  addTask() {
    const trimmed = this.newTask().trim();
    if (trimmed) {
      this.tasks.update((tasks) => [
        ...tasks,
        { text: trimmed, completed: false },
      ]);
      console.log(`Task added: "${trimmed}"`);
      this.newTask.set('');
    } else {
      alert('Task cannot be empty!');
    }
  }

  toggleTaskCompletion(task: { text: string; completed: boolean }) {
    this.tasks.update((tasks) =>
      tasks.map((t) => (t === task ? { ...t, completed: !t.completed } : t))
    );
    console.log(
      `Task "${task.text}" marked as ${
        task.completed ? 'completed' : 'not completed'
      }`
    );
  }

  clearAllTasks() {
    this.tasks.set([]);
    console.log('All tasks cleared');
  }
}
