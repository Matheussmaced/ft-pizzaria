import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { InputsLoginComponent } from '../inputs-login/inputs-login.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  imports: [InputsLoginComponent, HttpClientModule, CommonModule, FormsModule],
  styleUrls: ['./form-login.component.scss'],
})
export class FormLoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onEmailChange(email: string) {
    this.email = email;
  }

  onPasswordChange(password: string) {
    this.password = password;
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/table-screen']);
        } else {
          this.showError('Email ou senha incorretos!');
        }
      },
      (error) => {
        this.showError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        console.error(error);
      }
    );
  }

  showError(message: string) {
    this.errorMessage = '';

    setTimeout(() => {
      this.errorMessage = message;

      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    });
  }
}
