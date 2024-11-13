import { Component, OnInit } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FinancialService } from '../../services/financial.service';
import { Financial } from '../../../model/financial/Financial';
import { Transactions } from '../../../model/financial/Transactions';
@Component({
  selector: 'app-transaction-information',
  standalone: true,
  imports: [ CustomIconsModule, CommonModule, HttpClientModule],
  templateUrl: './transaction-information.component.html',
  styleUrl: './transaction-information.component.scss',
  providers: [ FinancialService ]
})
export class TransactionInformationComponent implements OnInit {
  financials: Financial[] = [];
  transactionsToDisplay: any[] = [];
  currentPage: number = 1;
  transactionsPerPage: number = 4;
  totalPages: number = 0;
  buttonsToShow: number[] = [];

  constructor(private financialService: FinancialService) {}

  ngOnInit(): void {
    this.financialService.getFinancial().subscribe((data: Financial[]) => {
      this.financials = data;
      this.totalPages = Math.ceil(this.financials[0]?.transactions.length / this.transactionsPerPage);
      this.updateTransactionsToDisplay();
      this.updateButtonsToShow();
    });
  }

  updateTransactionsToDisplay(): void {
    const start = (this.currentPage - 1) * this.transactionsPerPage;
    const end = start + this.transactionsPerPage;
    this.transactionsToDisplay = this.financials[0].transactions.slice(start, end);
  }

  updateButtonsToShow(): void {
    const maxButtons = 3;
    let startButton = Math.max(this.currentPage - 1, 1);
    let endButton = Math.min(startButton + maxButtons - 1, this.totalPages);

    // Ajusta a faixa dos botões se o total de botões for menor que o máximo
    if (endButton - startButton + 1 < maxButtons) {
      startButton = Math.max(endButton - maxButtons + 1, 1);
    }

    this.buttonsToShow = Array.from({ length: endButton - startButton + 1 }, (_, i) => startButton + i);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateTransactionsToDisplay();
    this.updateButtonsToShow();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
