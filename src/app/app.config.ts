import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TableScreenComponent } from './pages/table-screen/table-screen.component';
import { SpecificTablePageComponent } from './pages/specific-table-page/specific-table-page.component';
import { TableReportComponent } from './pages/table-report/table-report.component';
import { SpecificDeskReportComponent } from './pages/specific-desk-report/specific-desk-report.component';
import { EditMenuComponent } from './pages/edit-menu/edit-menu.component';
import { StockComponent } from './pages/stock/stock.component';
import { FinancialComponent } from './pages/financial/financial.component';
import { AuthGuard } from './services/auth.guard'; // AuthGuard importado
import { AuthService } from './services/auth.service'; // AuthService importado

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'table-screen', component: TableScreenComponent, canActivate: [AuthGuard] },
  { path: 'specific-table-screen', component: SpecificTablePageComponent, canActivate: [AuthGuard] },
  { path: 'table-report', component: TableReportComponent, canActivate: [AuthGuard] },
  { path: 'specific-desk-report', component: SpecificDeskReportComponent, canActivate: [AuthGuard] },
  { path: 'edit-menu', component: EditMenuComponent, canActivate: [AuthGuard] },
  { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
  { path: 'financial', component: FinancialComponent, canActivate: [AuthGuard] }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    AuthService,
    AuthGuard
  ]
};
