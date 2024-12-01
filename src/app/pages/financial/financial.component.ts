import { Component, OnInit } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { CommonModule } from '@angular/common';
import { ContainerSummaryComponent } from '../../components/container-summary/container-summary.component';
import { TransactionInformationComponent } from "../../components/transaction-information/transaction-information.component";
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { AddingFinancialComponent } from "../../components/modal/adding-financial/adding-financial.component";
import { FinancialService } from '../../services/financial.service';
import { Financial } from '../../../model/financial/Financial';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CustomIconsModule, HeaderPagesComponent, SideMenuComponent, CommonModule, ContainerSummaryComponent, TransactionInformationComponent, ButtonHeaderComponent, AddingFinancialComponent],
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
  financials: Financial[] = [];
  filteredFinancials: Financial[] = [];
  selectedMonth: string = '';
  modal: boolean = false;

  constructor(private financialService: FinancialService) {}

  ngOnInit(): void {
    this.selectedMonth = this.getCurrentMonth();
    this.financialService.getFinancial().subscribe((data) => {
      this.financials = data;
      this.filterByMonth();
    });
  }

  getCurrentMonth(): string {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const currentMonthIndex = new Date().getMonth();
    return monthNames[currentMonthIndex];
  }

  getMonthNumber(month: string): string {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const index = monthNames.indexOf(month.toLowerCase());
    return (index + 1).toString().padStart(2, '0');
  }

  onMonthChange(): void {
    const startMonth = (document.querySelector('#startMonth') as HTMLSelectElement)?.value;
    const endMonth = (document.querySelector('#endMonth') as HTMLSelectElement)?.value;

    if (startMonth && endMonth) {
      const startDate = `01/${this.getMonthNumber(startMonth)}/2024`; // Exemplo: Janeiro -> 01/01/2024
      const endDate = `31/${this.getMonthNumber(endMonth)}/2024`; // Exemplo: Dezembro -> 31/12/2024

      this.financialService.getFinancialsByMonth(startDate, endDate).subscribe((data) => {
        this.financials = data;
        this.filterByMonth();
      });
    }
  }

  filterByMonth(): void {
    this.filteredFinancials = this.financials.filter(financial => {
      return financial.month === this.selectedMonth;
    });
  }

  openModal(): void {
    this.modal = !this.modal;
  }

  closeModal(): void {
    this.modal = false;
  }
}
