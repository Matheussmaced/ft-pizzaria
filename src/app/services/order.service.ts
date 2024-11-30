import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrderDTO } from '../../DTO/createOrderDTO';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, PaginatedOrders } from '../../model/Order';

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

  createOrder(order: CreateOrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }
}
