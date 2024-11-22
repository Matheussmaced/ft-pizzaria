import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrderDTO } from '../../DTO/createOrderDTO';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/v1/orders`

  constructor( private http: HttpClient ) { }

  createOrder(order: CreateOrderDTO): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }
}
