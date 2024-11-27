import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from '../../DTO/createCategoryDTO';

@Injectable({
  providedIn: 'root'
})


export class CategoryService {
  private apiUrl = `${environment.apiUrl}/v1/categories`

  constructor( private http: HttpClient ) { }

  addCategory( name: string ): Observable<CreateCategoryDTO> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { name }

    return this.http.post<CreateCategoryDTO>(this.apiUrl, body, { headers })
  }
}
