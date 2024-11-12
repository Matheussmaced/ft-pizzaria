import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('Usuário não autenticado - redirecionando para /login');
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
      }),
      map(isAuthenticated => isAuthenticated)
    );
  }
}
