import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../services/stock.service';
import { CreateStockDTO } from '../../../../DTO/createStockDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adding-stock-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adding-stock-product.component.html',
  styleUrl: './adding-stock-product.component.scss'
})
export class AddingStockProductComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  categories: { id: string; name: string }[] = [];
  formData = {
    itemName: '',
    quantity: 0,
    unit: '',
    description: '',
    is_snack: 0,
    price: 0,
    categoryId: '',
  };

  constructor(private stockService: StockService) {}

ngOnInit(): void {
  this.stockService.getCategories().subscribe({
    next: (categories) => {
      this.categories = categories;
      console.log('Categorias relacionadas ao estoque:', this.categories);
    },
    error: (err) => {
      console.error('Erro ao carregar categorias:', err);
    },
  });
}

  onCancel() {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (!this.formData.categoryId) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    const stockData = {
      name: this.formData.itemName,
      quantity: this.formData.quantity,
      is_snack: 0,
      description: this.formData.description,
      unit: this.formData.unit,
      price: this.formData.price,
      category_id: this.formData.categoryId,
    };

    this.stockService.addProductInStock(stockData).subscribe({
      next: (response) => {
        console.log('Produto adicionado com sucesso!', response);
        alert('Produto adicionado com sucesso!');
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('Erro ao adicionar produto:', err);
        alert('Erro ao adicionar o produto. Tente novamente.');
      },
    });
  }
}
