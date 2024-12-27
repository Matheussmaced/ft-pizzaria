import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Category } from '../../model/Category'
import { ProductStocks } from '../../model/ProductStock';
import { Snacks } from '../../model/Snacks';
import { CreateItemDTO } from '../../DTO/createItemDTO';
import { EditItemDTO } from '../../DTO/editItemDTO';

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

    return this.http.get<Category[]>(`${environment.apiUrl}/v1/products?type=snack`, { headers });
  }

  getProductById ( idProduct: string ): Observable<Snacks[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Snacks[]>(`${environment.apiUrl}/v1/products?id=${idProduct}&type=snack`)
  }

  getPizzaBySize(size: string): Observable<any[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<any[]>(`${environment.apiUrl}/v1/products?type=snack&page=1&tam=${size}`, { headers })
  }

  addProduct(createItemDto: CreateItemDTO): Observable<Snacks> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Snacks>(`${environment.apiUrl}/v1/products`, createItemDto, { headers });
  }

  editProduct( editItemDto: EditItemDTO, idProduct: string ): Observable<Snacks> {
    const token = localStorage.getItem( 'authToken' );
    const headers = new HttpHeaders().set( 'Authorization', `Bearer ${token}`);

    return this.http.put<Snacks>(`${environment.apiUrl}/v1/products/${idProduct}`, editItemDto, { headers })
  }

  deleteProduct(idProduct: string) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      alert('Erro: Não foi possível autenticar a requisição.');
      return; // Retorna vazio para evitar chamada sem token.
    }

    // Exibe a confirmação antes de proceder com a exclusão
    const userConfirmed = confirm("Tem certeza que deseja deletar esse item?");
    if (!userConfirmed) {
      console.log('Ação de exclusão cancelada pelo usuário.');
      return; // Cancela a execução do método
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<Snacks>(
      `${environment.apiUrl}/v1/products/${idProduct}`,
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar o produto. Tente novamente.');
        return throwError(() => new Error('Erro ao realizar a requisição DELETE'));
      })
    );
  }
}
