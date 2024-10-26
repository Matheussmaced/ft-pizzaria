import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';

@Component({
  selector: 'app-container-summary',
  standalone: true,
  imports: [ CustomIconsModule ],
  templateUrl: './container-summary.component.html',
  styleUrl: './container-summary.component.scss'
})
export class ContainerSummaryComponent {

}
