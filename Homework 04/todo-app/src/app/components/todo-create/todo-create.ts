import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo-service';
import { TodoStatus } from '../../types/todo-type';

@Component({
  selector: 'app-todo-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.css',
})
export class TodoCreate {
  todoForm!: FormGroup;
  submitted = false;

  isLoading = signal(false);

  todoStatusOptions = [
    { value: TodoStatus.PENDING, label: 'Pending' },
    { value: TodoStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TodoStatus.COMPLETED, label: 'Completed' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly todoService: TodoService,
    private readonly router: Router
  ) {}

  ngOnInit() {
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

  async onSubmit() {
    this.submitted = true;
    this.todoForm.markAllAsTouched();

    if (this.todoForm.invalid) return;

    if (!confirm('Are you sure you want to save this todo?')) return;

    this.isLoading.set(true);

    const { title, description, status } = this.todoForm.value;

    await new Promise((resolve) => setTimeout(resolve, 300));
    this.todoService.addTodo(title!, description!, status!);

    this.todoForm.reset({
      title: '',
      description: '',
      status: TodoStatus.PENDING,
    });

    this.isLoading.set(false);
    this.router.navigate(['/todos']);
  }
}
