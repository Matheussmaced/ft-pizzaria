import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adding-stock-product',
  standalone: true,
  imports: [],
  templateUrl: './adding-stock-product.component.html',
  styleUrl: './adding-stock-product.component.scss'
})
export class AddingStockProductComponent {
  @Output() closeModal = new EventEmitter<void>();

  onCancel(){
    this.closeModal.emit();
  }
}
