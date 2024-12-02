import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../../services/financial.service';
import { FinanciesDTO } from '../../../../DTO/financiesDTO';
import { Financial } from '../../../../model/financial/Financial';

@Component({
  selector: 'app-adding-financial',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './adding-financial.component.html',
  styleUrl: './adding-financial.component.scss'
})
export class AddingFinancialComponent {
  @Output() closeModal = new EventEmitter<void>();

  description: string = '';
  amount: number = 0;
  type: "INCOME" | "OUTCOME" = "INCOME";

  constructor( private financialService: FinancialService ) {}

  onSubmit() {
    const formData:FinanciesDTO = {
      description: this.description,
      type: this.type,
      value: Number(this.amount.toFixed(2)),
      transaction_date: "2024-12-02T11:08:48.296Z"
    }

    this.financialService.createTransaction( formData ).subscribe(
      (res: Financial) => {
        console.log('Transação adicionado com sucesso:', res);
        this.closeModal.emit();
      }
    )
  }

  onCancel(){
    this.closeModal.emit();
  }
}
