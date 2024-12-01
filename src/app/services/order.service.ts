import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrderDTO } from '../../DTO/createOrderDTO';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, PaginatedOrders } from '../../model/Order';
import { UpdateOrderDTO } from '../../DTO/UpdateOrderItemDTO';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/v1/orders`

  constructor( private http: HttpClient ) { }

  getOrders(): Observable<PaginatedOrders> {
    const url = `${this.apiUrl}?limit=10&page=1`;
    return this.http.get<PaginatedOrders>(url);
  }

  getOrderById( id:string ): Observable<any>{
    const url = `${this.apiUrl}?id=${id}&limit=10&page=1`

    return this.http.get<any>(url);
  }

  createOrder(order: CreateOrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  updateOrder(idOrder: string, order: CreateOrderDTO): Observable<Order> {
    const url = `${this.apiUrl}/${idOrder}`;
    return this.http.put<Order>(url, order);
  }

  deleteOrder(idOrder: string) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      alert('Erro: Não foi possível autenticar a requisição.');
      return;
    }

    const userConfirmed = confirm("Tem certeza que deseja deletar esse item?");
    if (!userConfirmed) {
      console.log('Ação de exclusão cancelada pelo usuário.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<Order>(
      `${environment.apiUrl}/${idOrder}`,
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
