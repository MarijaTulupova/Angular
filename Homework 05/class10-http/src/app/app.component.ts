import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductsStateService } from './services/products-state.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private readonly productStateService: ProductsStateService,
    private readonly router: Router
  ) {}

  loading$: Observable<boolean>;

  ngOnInit() {
    this.productStateService.loadProducts();

    this.loading$ = this.productStateService.loading$;
  }

  navigateToAddProduct() {
    this.router.navigate(['/products/new']);
  }
}
