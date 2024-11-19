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
  private apiUrl = `http://localhost:3000/users`;

  constructor(private http: HttpClient, private router: Router) {}

  public hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          const fakeToken = `fake-jwt-token-${user.id}`;
          localStorage.setItem('authToken', fakeToken);
          this.isAuthenticatedSubject.next(true);
          console.log('Usuário autenticado com sucesso');
          return true;
        } else {
          console.log('Credenciais incorretas');
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
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
