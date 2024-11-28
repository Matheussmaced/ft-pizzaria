import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { StockService } from '../../../services/stock.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-stock',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.scss']
})
export class EditStockComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Input() stockId = "";
  @Input() categoryId = "";

  formData = {
    name: '',
    quantity: 0,
    description: '',
    unit: '',
    price: 0,
    is_snack: 0,
    category_id: ''
  };

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStockDetails();
  }

  loadStockDetails(): void {
    if (this.stockId) {
      this.stockService.getStockById(this.stockId).subscribe(
        (stock: any) => {
          this.formData = {
            name: stock.name || '',
            quantity: stock.quantity || 0,
            description: stock.description || '',
            unit: stock.unit || '',
            price: stock.price || 0,
            is_snack: stock.is_snack || 0,
            category_id: this.categoryId
          };
        },
        (error) => {
          console.error('Erro ao carregar o estoque:', error);
        }
      );
    }
  }

  onSubmit(): void {
    this.stockService.editStock(this.formData, this.stockId).subscribe(
      () => {
        alert('Estoque atualizado com sucesso!');
        this.closeModal.emit();
      },
      (error) => {
        console.error('Erro ao atualizar o estoque:', error);
        alert('Erro ao atualizar o estoque. Tente novamente.');
      }
    );
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
