import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.isAuthenticatedSubject.next(true); // Atualiza o estado de autenticação
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
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
