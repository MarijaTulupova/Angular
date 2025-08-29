import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TodoCreate } from './todo-create';

@Injectable({ providedIn: 'root' })
export class TodoCreateGuard implements CanDeactivate<TodoCreate> {
  canDeactivate(component: TodoCreate): boolean {
    if (component.todoForm.dirty && !component.isLoading()) {
      return confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
    }
    return true;
  }
}
