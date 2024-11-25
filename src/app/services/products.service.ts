import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../../model/Category'
import { ProductStocks } from '../../model/ProductStock';
import { Snacks } from '../../model/Snacks';
import { CreateItemDTO } from '../../DTO/createItemDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // URL da API, ajuste conforme necessário para obter categorias
  private apiUrl = `${environment.apiUrl}/v1/categories`;  // Alterado para pegar categorias diretamente

  constructor(private http: HttpClient) {}

  // Método getCategories, igual ao estilo do StockService
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

  getCategories(): Observable<Category[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Category[]>(`${environment.apiUrl}/v1/products?id=Product%20ID&type=snack&page=1&limit=8`, { headers });
  }

  // Método para adicionar produto (o mesmo que você já tem)
  addProduct(createItemDto: CreateItemDTO): Observable<Snacks> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Snacks>(`${environment.apiUrl}/v1/products`, createItemDto, { headers });
  }
}
