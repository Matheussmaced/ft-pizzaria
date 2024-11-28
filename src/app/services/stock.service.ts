import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Stock } from '../../model/Stock';
import { CreateStockDTO } from '../../DTO/createStockDTO';
import { CreateItemDTO } from '../../DTO/createItemDTO';
import { Category } from '../../model/Category';

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

  getCategoriesModal(): Observable<Category[]> {
    const authToken = localStorage.getItem('authToken');  // Recupera o token do localStorage
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);  // Adiciona o cabeçalho de autorização
    }

    // Faz a requisição GET para obter as categorias e loga a resposta
    return this.http.get<Category[]>(this.apiUrl, { headers }).pipe(
      tap(data => console.log('Resposta da API (Categorias):', data))  // Log para depuração
    );
  }

  addProductInStock( createStockDTO: CreateStockDTO ): Observable<CreateStockDTO>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CreateStockDTO>(this.apiUrlPost, createStockDTO, { headers })
  }

  editStock(editStockDTO: CreateStockDTO, idProduct: string): Observable<Stock> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<Stock>(`${environment.apiUrl}/v1/products/${idProduct}`, editStockDTO, { headers });
  }

  getStockById ( idProduct: string ): Observable<Stock[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Stock[]>(`${environment.apiUrl}/v1/products?id=${idProduct}&type=snack`)
  }
}
