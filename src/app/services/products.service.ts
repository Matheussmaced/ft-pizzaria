import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../model/Category'
import { ProductStocks } from '../../model/ProductStock';
import { Snacks } from '../../model/Snacks';
import { CreateItemDTO } from '../../DTO/createItemDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/v1/products?id=Product%20ID&type=snack&page=1&limit=8`

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  addProduct(createItemDto: CreateItemDTO): Observable<CreateItemDTO>{
    const apiUrlPost = `${environment.apiUrl}/v1/products`

    return this.http.post<Snacks>(apiUrlPost, createItemDto);
  }
}
