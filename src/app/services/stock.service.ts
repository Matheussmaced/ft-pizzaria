import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../../model/Stock';
import { CreateStockDTO } from '../../DTO/createStockDTO';
import { CreateItemDTO } from '../../DTO/createItemDTO';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/v1/products?type=stock`;
  private apiUrlPost = `${environment.apiUrl}/v1/products`;

  constructor( private http: HttpClient ) {}

  getStock(): Observable<Stock[]>{
    return this.http.get<Stock[]>(this.apiUrl);
  };

  getCategories(): Observable<{ id: string; name: string }[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{ id: string; name: string }[]>(`${environment.apiUrl}/v1/categories`, { headers });
  }

  addProductInStock( createStockDTO: CreateStockDTO ): Observable<CreateStockDTO>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CreateStockDTO>(this.apiUrlPost, createStockDTO, { headers })
  }

  editStock(editStockDTO: CreateStockDTO, idProduct: string): Observable<Stock> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<Stock>(`${environment.apiUrl}/v1/products/${idProduct}?type=stock`, editStockDTO, { headers });
  }
}
