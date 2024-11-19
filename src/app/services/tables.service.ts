import { HttpClient } from '@angular/common/http';
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

  getTables(): Observable<Tables[]>{
    return this.http.get<Tables[]>(this.apiUrl)
  }
}
