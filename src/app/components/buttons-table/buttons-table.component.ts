import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttons-table',
  standalone: true,
  imports: [],
  templateUrl: './buttons-table.component.html',
  styleUrl: './buttons-table.component.scss'
})
export class ButtonsTableComponent {
   @Input() numberTable:string = "";
}
