import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inputs-login',
  standalone: true,
  imports: [ CommonModule, HttpClientModule ],
  templateUrl: './inputs-login.component.html',
  styleUrl: './inputs-login.component.scss',
  providers: [ AuthService ]
})
export class InputsLoginComponent {
  email: string = '';
  password: string = '';

  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();

  onEmailChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.email = input.value;
      this.emailChange.emit(this.email);
    }
  }

  onPasswordChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.password = input.value;
      this.passwordChange.emit(this.password);
    }
  }
}
