import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FinancialService } from '../../services/financial.service';
import { Financial } from '../../../model/financial/Financial';

@Component({
  selector: 'app-transaction-information',
  standalone: true,
  imports: [CustomIconsModule, CommonModule, HttpClientModule],
  templateUrl: './transaction-information.component.html',
  styleUrls: ['./transaction-information.component.scss'],
  providers: [FinancialService]
})
export class TransactionInformationComponent implements OnInit, OnChanges {
  @Input() filteredMonth: string = '';
  financials: Financial[] = [];
  transactionsToDisplay: any[] = [];
  currentPage: number = 1;
  transactionsPerPage: number = 4;
  totalPages: number = 0;
  buttonsToShow: number[] = [];

  @Input() getInforms: any[] = []

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

  updateTransactionsToDisplay(): void {
    const selectedFinancial = this.getInforms.find(
      (financial) => financial.month.toLowerCase() === this.filteredMonth
    );

    if (selectedFinancial) {
      const start = (this.currentPage - 1) * this.transactionsPerPage;
      const end = start + this.transactionsPerPage;
      this.transactionsToDisplay = selectedFinancial.transactions.slice(start, end);
      this.totalPages = Math.ceil(selectedFinancial.transactions.length / this.transactionsPerPage);
    } else {
      this.transactionsToDisplay = [];
      this.totalPages = 0;
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
