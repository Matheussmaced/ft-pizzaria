import { Component } from '@angular/core';
import { InputsLoginComponent } from "../inputs-login/inputs-login.component";

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [InputsLoginComponent],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss'
})
export class FormLoginComponent {

}
