import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../../model/Stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/stocks`;

  constructor( private http: HttpClient ) {}

  getStock(): Observable<Stock[]>{
    return this.http.get<Stock[]>(this.apiUrl);
  };
}
