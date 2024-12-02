import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../../services/financial.service';
import { FinanciesDTO } from '../../../../DTO/financiesDTO';
import { Financial } from '../../../../model/financial/Financial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adding-financial',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './adding-financial.component.html',
  styleUrl: './adding-financial.component.scss'
})
export class AddingFinancialComponent {
  @Output() closeModal = new EventEmitter<void>();

  day:string = '';
  month:string = '';
  year: string = ''

  description: string = '';
  amount: number = 0;
  type: "INCOME" | "OUTCOME" = "INCOME";

  constructor( private financialService: FinancialService ) {}

  onSubmit() {
    const isDayValid = this.day?.length === 2 && /^[0-9]{2}$/.test(this.day);
    const isMonthValid = this.month?.length === 2 && /^[0-9]{2}$/.test(this.month);
    const isYearValid = this.year?.length === 4 && /^[0-9]{4}$/.test(this.year);

    if (this.day?.length !== 2 || this.month?.length !== 2 || this.year?.length !== 4) {
      alert("DATA INVÁLIDA: O dia deve ter 2 dígitos, o mês 2 dígitos e o ano 4 dígitos.");
      return; // Impede o envio do formulário
    }

    // Verificar se a data é válida (comparações com strings)
    if (this.day > '31' || this.day < '01' || this.month > '12' || this.month < '01' || this.year < '2010' || this.year > '2100') {
      alert("DATA INVÁLIDA");
      return; // Impede o envio do formulário
    }


    const formData:FinanciesDTO = {
      description: this.description,
      type: this.type,
      value: Number(this.amount.toFixed(2)),
      transaction_date: `${this.year}-${this.month}-${this.day}T11:08:48.296Z`
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
