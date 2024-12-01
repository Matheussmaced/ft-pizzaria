import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Financial } from '../../model/financial/Financial';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private apiUrl = `${environment.apiUrl}/financies`;

  constructor( private http: HttpClient ) { }

  getFinancial(): Observable<Financial[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Financial[]>(`${this.apiUrl}`);
  }

  getFinancialsByMonth(startDate: string, endDate: string): Observable<Financial[]> {
    const params = `?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<Financial[]>(`${this.apiUrl}${params}`);
  }
}
