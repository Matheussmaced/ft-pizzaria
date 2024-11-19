import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adding-new-category',
  standalone: true,
  imports: [],
  templateUrl: './adding-new-category.component.html',
  styleUrl: './adding-new-category.component.scss'
})
export class AddingNewCategoryComponent {
  @Output() closeModal = new EventEmitter<void>();

  onCancel(){
    this.closeModal.emit();
  }
}
