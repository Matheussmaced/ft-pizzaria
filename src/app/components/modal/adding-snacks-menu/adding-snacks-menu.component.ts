import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adding-snacks-menu',
  standalone: true,
  imports: [],
  templateUrl: './adding-snacks-menu.component.html',
  styleUrl: './adding-snacks-menu.component.scss'
})
export class AddingSnacksMenuComponent {
  @Output() closeModal = new EventEmitter<void>();

  onCancel(){
    this.closeModal.emit();
  }
}
