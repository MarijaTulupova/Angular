import { Component, computed, inject, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductsStateService } from '../../services/products-state.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  products = signal<Product[]>([]);
  searchTerm = signal('');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();

    return this.products().filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  });

  private readonly productStateService = inject(ProductsStateService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.productStateService.products$.subscribe((products) =>
      this.products.set(products)
    );
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onSelectProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  onDeleteProduct(id: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Are you sure that you want to delete this product?')) {
      this.productStateService.deleteProduct(id);
    }
  }

  onEditProduct(id: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/products', id, 'edit']);
  }

  trackById(index: number, product: Product) {
    return product.id;
  }
}
