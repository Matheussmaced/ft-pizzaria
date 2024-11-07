import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Financial } from '../../model/financial/Financial';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private apiUrl = `${environment.apiUrl}/financial`;

  constructor( private http: HttpClient ) { }

  getFinancial(): Observable<Financial[]> {
    return this.http.get<Financial[]>(this.apiUrl);
  }
}
