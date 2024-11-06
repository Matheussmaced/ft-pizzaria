import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductStocks } from '../../model/ProductStock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stocks`;

  constructor( private http: HttpClient ) {}

  getStock(): Observable<ProductStocks[]>{
    return this.http.get<ProductStocks[]>(this.apiUrl);
  };
}
