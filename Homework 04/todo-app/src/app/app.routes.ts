import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoCreate } from './components/todo-create/todo-create';
import { Home } from './components/home/home';
import { TodoEdit } from './components/todo-edit/todo-edit';
import { TodoEditGuard } from './components/todo-edit/todo-edit.guard';
import { TodoCreateGuard } from './components/todo-create/todo-create.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'todos', component: TodoList },
  { path: 'create', component: TodoCreate, canDeactivate: [TodoCreateGuard] },
  { path: 'edit/:id', component: TodoEdit, canDeactivate: [TodoEditGuard] },
];
