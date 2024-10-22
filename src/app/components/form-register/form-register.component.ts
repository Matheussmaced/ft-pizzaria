import { Component } from '@angular/core';
import { InputsRegisterComponent } from "../inputs-register/inputs-register.component";

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [InputsRegisterComponent],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.scss'
})
export class FormRegisterComponent {

}
