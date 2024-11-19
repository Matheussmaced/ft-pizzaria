import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adding-stock-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adding-stock-product.component.html',
  styleUrl: './adding-stock-product.component.scss'
})
export class AddingStockProductComponent {
  @Output() closeModal = new EventEmitter<void>();

  formData = {
    itemName: '',
    quantity: 0,
    unit: '',
  };

  onCancel(){
    this.closeModal.emit();
  }

  onSubmit():void{
    console.log('Informações do Formulario: ', this.formData)
  }
}
