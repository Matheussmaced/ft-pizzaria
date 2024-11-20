import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tables } from '../../model/Tables';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private apiUrl = `${environment.apiUrl}/v1/tables`

  constructor( private http: HttpClient ) { }

  getTables(): Observable<Tables[]> {
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Tables[]>(this.apiUrl, { headers });
  }
}
