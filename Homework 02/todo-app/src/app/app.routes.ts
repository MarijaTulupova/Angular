import { Routes } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { TodoCreate } from './components/todo-create/todo-create';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'todos', component: TodoList },
  { path: 'create', component: TodoCreate },
];
