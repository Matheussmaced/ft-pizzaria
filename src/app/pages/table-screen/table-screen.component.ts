import { Component } from '@angular/core';
import { ButtonsTableComponent } from '../../components/buttons-table/buttons-table.component';

@Component({
  selector: 'app-table-screen',
  standalone: true,
  imports: [ButtonsTableComponent],
  templateUrl: './table-screen.component.html',
  styleUrl: './table-screen.component.scss'
})
export class TableScreenComponent {

}
