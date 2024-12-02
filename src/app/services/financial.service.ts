import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Financial } from '../../model/financial/Financial';
import { FinanciesDTO } from '../../DTO/financiesDTO';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private apiUrl = `${environment.apiUrl}/v1/financies`;

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
    const params = {
      startDate: `${startDate}-01T00:00:00Z`, // ajustando para data no formato UTC
      endDate: `${endDate}-01T00:00:00Z`
    };

    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Financial[]>(`${this.apiUrl}`, { headers, params });
  }

  getFinancialsByMonthCurrent(startDate: string, endDate: string): Observable<Financial[]> {
    const params = {
      startDate: `${startDate}-01T00:00:00Z`,
      endDate: `${endDate}-01T00:00:00Z`
    };

    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.get<Financial[]>(`${this.apiUrl}/current`, { headers, params });
  }

  createTransaction( transaction: FinanciesDTO ):Observable<any>{
    const authToken = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return this.http.post(this.apiUrl, transaction)
  }

  deleteTransaction(idTransaction: string) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      alert('Erro: Não foi possível autenticar a requisição.');
      return;
    }

    const userConfirmed = confirm("Tem certeza que deseja deletar esse item?");
    if (!userConfirmed) {
      console.log('Ação de exclusão cancelada pelo usuário.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<Financial>(
      `${this.apiUrl}/${idTransaction}`,
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar o produto. Tente novamente.');
        return throwError(() => new Error('Erro ao realizar a requisição DELETE'));
      })
    );
  }
}
