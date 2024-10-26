import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';

@Component({
  selector: 'app-transaction-information',
  standalone: true,
  imports: [ CustomIconsModule ],
  templateUrl: './transaction-information.component.html',
  styleUrl: './transaction-information.component.scss'
})
export class TransactionInformationComponent {

}
