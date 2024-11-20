import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private apiUrl = `${environment.apiUrl}/v1/login`;

  constructor(private http: HttpClient, private router: Router) {}

  public hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(email: string, password: string): Observable<boolean> {
    const loginPayload = { email, password };

    console.log('Enviando dados para login:', loginPayload);

    return this.http.post<{ accessToken: string, role_id: string }>(`${environment.apiUrl}/v1/auth`, loginPayload).pipe(
      map((response) => {
        console.log('Resposta da API:', response);
        console.log('Token retornado:', response.accessToken);  // Acessando o campo correto

        // Verifique se o accessToken existe na resposta
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
          localStorage.setItem('role_id', response.role_id);

          this.isAuthenticatedSubject.next(true);
          console.log('Usuário autenticado com sucesso');
          return true;
        } else {
          console.error('Token não encontrado na resposta da API');
          return false;
        }
      }),
      catchError((error) => {
        console.error('Erro de autenticação:', error);
        return of(false);
      })
    );
  }


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role_id'); // Remover a role_id ao sair
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRoleId(): string | null {
    return localStorage.getItem('role_id');
  }
}
