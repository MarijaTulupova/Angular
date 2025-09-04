import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateProductDto, Product } from '../../models/product.interface';
import { ProductsStateService } from '../../services/products-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsApiService } from '../../services/products-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  categories: string[] = [];

  isEditMode = signal(false);

  productForm: FormGroup;

  private fb = inject(FormBuilder);
  private productStateService = inject(ProductsStateService);
  private productApiService = inject(ProductsApiService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.initForm();
    this.loadCategories();

    const productId = this.activatedRoute.snapshot.paramMap.get('id');

    if (productId) {
      this.isEditMode.set(true);
      this.loadProductForEdit(+productId);
    } else {
      this.isEditMode.set(false);
    }
  }

  private loadCategories() {
    this.productApiService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  private loadProductForEdit(id: number) {
    this.productStateService.getProduct(id).subscribe({
      next: (product) => {
        if (!product) {
          alert('Product not found!');
          this.router.navigate(['/']);
          return;
        }

        this.preloadFormValues(product);
      },
      error: (error) => {
        console.error('Error loading product', error);
        alert('Failed to load product.');
        this.router.navigate(['/']);
      },
    });
  }

  private preloadFormValues(product: Product) {
    if (this.productForm) {
      this.productForm.patchValue({
        title: product.title,
        price: Number(product.price),
        description: product.description,
        category: product.category,
        imageUrl: product.image,
      });
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(2),
        ],
      ],
      price: [0, [Validators.required, Validators.min(0.1)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValues = this.productForm.value;

    const productDto: CreateProductDto = {
      title: formValues.title,
      description: formValues.description,
      image: formValues.imageUrl,
      category: formValues.category,
      price: +formValues.price,
    };

    const productId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.isEditMode() && productId) {
      this.productStateService.updateProduct(+productId, productDto);
    } else {
      this.productStateService.createProduct(productDto);
    }

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
