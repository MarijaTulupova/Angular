import { Component, signal } from '@angular/core';
import { Todo, TodoStatus } from '../../types/todo-type';
import { TodoService } from '../../services/todo-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  todos = signal<Todo[]>([]);
  TodoStatus = TodoStatus;

  searchTerm = signal('');

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.todos$.subscribe((data) => {
      this.todos.set(data);
    });
  }

  updateStatus(todo: Todo) {
    this.todoService.updateStatus(todo.id);
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id);
  }

  getStatusClass(todo: Todo) {
    switch (todo.status) {
      case TodoStatus.PENDING:
        return 'pending';
      case TodoStatus.IN_PROGRESS:
        return 'in-progress';
      case TodoStatus.COMPLETED:
        return 'completed';
    }
  }

  get filteredTodos() {
    const term = this.searchTerm().toLowerCase();
    return this.todos().filter((todo) =>
      todo.title.toLowerCase().includes(term)
    );
  }
}
