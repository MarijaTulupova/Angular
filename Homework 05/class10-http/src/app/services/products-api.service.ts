import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProductDto, Product } from '../models/product.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  constructor(private readonly http: HttpClient) {}

  private readonly baseUrl = 'https://fakestoreapi.com/products';

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  createProduct(body: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, body);
  }

  deleteProduct(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  updateProduct(id: number, body: CreateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, body);
  }
}
