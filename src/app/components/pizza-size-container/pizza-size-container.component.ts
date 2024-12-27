import { Component, Input } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';

@Component({
  selector: 'app-pizza-size-container',
  standalone: true,
  imports: [CustomIconsModule],
  templateUrl: './pizza-size-container.component.html',
  styleUrl: './pizza-size-container.component.scss'
})
export class PizzaSizeContainerComponent {
  @Input() size:string = '';
}
