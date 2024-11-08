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

  constructor ( private financialService: FinancialService ) {}

  ngOnInit(): void {
    this.financialService.getFinancial().subscribe((data: Financial[]) => {
      this.financials = data.map(transactionHeader => ({
        ...transactionHeader,
        transactions: transactionHeader.transactions.map(transactionBody => ({
          ...transactionBody,
        }))
      }))
    });
  }
}
