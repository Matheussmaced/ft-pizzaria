import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablesService } from '../../../services/tables.service';

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

  constructor(private tablesService: TablesService) {}

  onCancel(){
    this.closeModal.emit();
  }

  onSubmit():void{
    const tableData = { num: this.formData.numberTable };

    this.tablesService.addTable(tableData).subscribe({
      next: (response) => {
        console.log('Mesa adicionada com sucesso:', response);
        this.closeModal.emit(); // Fechar o modal após sucesso
      },
      error: (error) => {
        console.error('Erro ao adicionar mesa:', error);
      }
    });
  }


}
