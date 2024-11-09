import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-header',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './button-header.component.html',
  styleUrl: './button-header.component.scss'
})
export class ButtonHeaderComponent {
  @Input() nameButton:string = "";
  @Input() showButton:boolean = true;

  constructor(){}

}
