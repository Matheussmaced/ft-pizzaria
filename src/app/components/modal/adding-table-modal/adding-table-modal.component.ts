import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adding-table-modal',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './adding-table-modal.component.html',
  styleUrl: './adding-table-modal.component.scss'
})
export class AddingTableModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  onCancel(){
    this.closeModal.emit();
  }
}
