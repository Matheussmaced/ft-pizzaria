import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adding-table-modal',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './adding-table-modal.component.html',
  styleUrl: './adding-table-modal.component.scss'
})
export class AddingTableModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  formData = {
    numberTable: 0
  };

  onCancel(){
    this.closeModal.emit();
  }

  onSubmit():void{
    console.log('Dados do Formulario: ', this.formData)
  }
}
