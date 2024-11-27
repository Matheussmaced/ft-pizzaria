import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adding-new-category',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './adding-new-category.component.html',
  styleUrl: './adding-new-category.component.scss'
})
export class AddingNewCategoryComponent {
  @Output() closeModal = new EventEmitter<void>();

  formData = {
    name : '',
  }

  constructor ( private categoryService: CategoryService ) {}

  onCancel(){
    this.closeModal.emit();
  }

  onSubmit():void {
    this.categoryService.addCategory(this.formData.name).subscribe({
      next: (response) => {
        console.log('Categoria:', response);
        this.closeModal.emit();
      },
      error: (error) => {
        console.error('Erro ao adicionar mesa:', error)
      }
    })
  }
}
