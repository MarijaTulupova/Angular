import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo-service';

@Component({
  selector: 'app-todo-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.css',
})
export class TodoCreate {
  title = signal('');
  description = signal('');

  constructor(private readonly todoService: TodoService) {}

  addTodo() {
    const t = this.title().trim();
    const d = this.description().trim();
    if (!t || !d) {
      alert('Please enter both a title and a description.');
      return;
    }

    this.todoService.addTodo(t, d);
    this.title.set('');
    this.description.set('');
    alert('Todo added successfully!');
  }
}
