import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TodoEdit } from './todo-edit';

@Injectable({
  providedIn: 'root',
})
export class TodoEditGuard implements CanDeactivate<TodoEdit> {
  canDeactivate(component: TodoEdit): boolean {
    if (component.todoForm?.dirty && !component.isLoading()) {
      return confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
    }
    return true;
  }
}
