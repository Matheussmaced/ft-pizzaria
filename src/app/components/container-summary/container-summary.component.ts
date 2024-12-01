import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { FinancialService } from '../../services/financial.service';
import { HttpClientModule } from '@angular/common/http';
import { Financial } from '../../../model/financial/Financial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container-summary',
  standalone: true,
  imports: [ CustomIconsModule, HttpClientModule, CommonModule ],
  templateUrl: './container-summary.component.html',
  styleUrl: './container-summary.component.scss',
  providers: [ FinancialService ]
})
export class ContainerSummaryComponent implements OnInit, OnChanges {
  financials: Financial[] = [];
  @Input() filteredMonth: string = '';
  @Input() title: string = "";
  @Input() typeOfValueInformation: keyof Financial = "";
  @Input() icon: string = "";
  @Input() classIcon: string = "";
  @Input() classMainContainer: string = "";

  currentPage: number = 1;
  buttonsToShow: number[] = [];
  totalPages: number = 0;

  @Input() getInforms: any = {};  // Mudado de array para objeto

  // Variáveis para armazenar os valores formatados
  formattedCurrentBalance: string = '';
  formattedCashIn: string = '';
  formattedCashOut: string = '';

  constructor(private financialService: FinancialService) {}

  ngOnInit(): void {
    if (!this.filteredMonth) {
      this.filteredMonth = this.getCurrentMonth();
    }

    this.financialService.getFinancial().subscribe((data: Financial[]) => {
      this.financials = data;
      this.updateTransactionsToDisplay();
      this.updateButtonsToShow();
    });
  }

  ngOnChanges(): void {
    console.log('Updated getInforms:', this.getInforms);

    this.currentPage = 1;
    this.updateTransactionsToDisplay();
    this.updateButtonsToShow();
  }

  getCurrentMonth(): string {
    return new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
  }

  getFinancialValue(financial: Financial): number {
    return financial[this.typeOfValueInformation] as number;
  }

  updateTransactionsToDisplay(): void {
    // Verificando se getInforms é um objeto e exibindo valores
    if (this.getInforms && typeof this.getInforms === 'object') {
      console.log('Current Balance:', this.getInforms.currentBalance);
      console.log('Cash In:', this.getInforms.cashIn);
      console.log('Cash Out:', this.getInforms.cashOut);

      // Formatando os valores
      this.formattedCurrentBalance = this.formatCurrency(this.getInforms.currentBalance);
      this.formattedCashIn = this.formatCurrency(this.getInforms.cashIn);
      this.formattedCashOut = this.formatCurrency(this.getInforms.cashOut);
    } else {
      console.error('getInforms não contém um objeto válido:', this.getInforms);
    }
  }

  updateButtonsToShow(): void {
    const maxButtons = 3;
    let startButton = Math.max(this.currentPage - 1, 1);
    let endButton = Math.min(startButton + maxButtons - 1, this.totalPages);

    if (endButton - startButton + 1 < maxButtons) {
      startButton = Math.max(endButton - maxButtons + 1, 1);
    }

    this.buttonsToShow = Array.from({ length: endButton - startButton + 1 }, (_, i) => startButton + i);
  }

  formatCurrency(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }
}
