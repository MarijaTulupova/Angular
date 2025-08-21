import { Injectable } from '@angular/core';
import { TodoStatus, Todo } from '../types/todo-type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  private nextId = 1;

  getTodos(): Todo[] {
    return this.todosSubject.getValue();
  }

  addTodo(title: string, description: string) {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      description,
      status: TodoStatus.PENDING,
    };
    this.todosSubject.next([...this.getTodos(), newTodo]);
  }

  updateStatus(id: number) {
    const updated = this.getTodos().map((todo) => {
      if (todo.id !== id) return todo;

      let newStatus: TodoStatus;
      switch (todo.status) {
        case TodoStatus.PENDING:
          newStatus = TodoStatus.IN_PROGRESS;
          break;
        case TodoStatus.IN_PROGRESS:
          newStatus = TodoStatus.COMPLETED;
          break;
        case TodoStatus.COMPLETED:
          newStatus = TodoStatus.PENDING;
          break;
      }

      return { ...todo, status: newStatus };
    });

    this.todosSubject.next(updated);
  }

  deleteTodo(id: number) {
    const updated = this.getTodos().filter((todo) => todo.id !== id);
    this.todosSubject.next(updated);
  }
}
