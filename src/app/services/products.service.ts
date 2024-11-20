import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../model/Category'
import { ProductStocks } from '../../model/ProductStock';
import { Snacks } from '../../model/Snacks';
import { CreateItemDTO } from '../../DTO/createItemDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/v1/products?id=Product%20ID&type=snack&page=1&limit=8`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Category[]>(this.apiUrl, { headers });
  }

  addProduct(createItemDto: CreateItemDTO): Observable<CreateItemDTO> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CreateItemDTO>(`${environment.apiUrl}/v1/products` , createItemDto, { headers });
  }
}
