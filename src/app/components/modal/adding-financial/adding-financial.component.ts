import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adding-financial',
  standalone: true,
  imports: [],
  templateUrl: './adding-financial.component.html',
  styleUrl: './adding-financial.component.scss'
})
export class AddingFinancialComponent {
  @Output() closeModal = new EventEmitter<void>();

  onCancel(){
    this.closeModal.emit();
  }
}
