import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo-service';
import { TodoStatus, Todo } from '../../types/todo-type';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-edit.html',
  styleUrls: ['./todo-edit.css'],
})
export class TodoEdit {
  todoForm!: FormGroup;
  todoId!: number;
  todoStatusOptions = Object.values(TodoStatus);

  isLoading = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly todoService: TodoService,
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();

    const idParam = this.activeRoute.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('No todo id provided in route.');
      this.router.navigate(['/todos']);
      return;
    }

    this.todoId = Number(idParam);
    this.loadTodoForEdit(this.todoId);
  }

  private initializeForm() {
    this.todoForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: [TodoStatus.PENDING, Validators.required],
    });
  }

  private loadTodoForEdit(id: number) {
    const todo = this.todoService.getTodos().find((t) => t.id === id);
    if (!todo) {
      console.error(`Todo with id ${id} not found.`);
      this.router.navigate(['/todos']);
      return;
    }
    this.populateForm(todo);
  }

  private populateForm(todo: Todo) {
    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description,
      status: todo.status,
    });
  }

  async onSubmit() {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    if (!confirm('Are you sure you want to save the changes?')) {
      return;
    }

    const { title, description, status } = this.todoForm.value;

    this.isLoading.set(true);

    this.todoService
      .updateTodo(this.todoId, { title, description, status })
      .subscribe({
        next: (success) => {
          this.isLoading.set(false);
          if (success) {
            this.todoForm.markAsPristine();
            this.router.navigate(['/todos']);
          } else {
            console.error('Failed to update todo.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error updating todo:', err);
        },
      });
  }

  navigateToTodos() {
    this.router.navigate(['/todos']);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.todoForm.get(fieldName);
    if (control && control.errors && (control.touched || control.dirty)) {
      if (control.errors['required']) return `${fieldName} is required.`;
      if (control.errors['minlength'])
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      if (control.errors['maxlength'])
        return `${fieldName} cannot exceed ${control.errors['maxlength'].requiredLength} characters.`;
    }
    return null;
  }
}
