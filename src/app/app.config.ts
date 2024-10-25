import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TableScreenComponent } from './pages/table-screen/table-screen.component';
import { SpecificTablePageComponent } from './pages/specific-table-page/specific-table-page.component';
import { TableReportComponent } from './pages/table-report/table-report.component';
import { SpecificDeskReportComponent } from './pages/specific-desk-report/specific-desk-report.component';

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'table-screen', component: TableScreenComponent },
  { path: 'specific-table-screen', component: SpecificTablePageComponent },
  { path: 'table-report', component: TableReportComponent },
  { path: 'specific-desk-report', component: SpecificDeskReportComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
