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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CustomIconsModule, HeaderPagesComponent, SideMenuComponent, CommonModule, ContainerSummaryComponent, TransactionInformationComponent, ButtonHeaderComponent, AddingFinancialComponent, FormsModule],
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
  financials: Financial[] = [];
  currentFinancial: Financial[] = [];

  filteredFinancials: Financial[] = [];
  years: number[] = [];
  selectedMonth: string = '';
  modal: boolean = false;

  isLoading: boolean = true;

  informsTransactions: Financial[] = [];

  startMonth: string = '';
  endMonth: string = '';
  startYear: string = '';
  endYear: string = '';

  constructor(private financialService: FinancialService) {}

  ngOnInit(): void {
    this.years = this.generateYears(2010, 2100);
    console.log(this.selectedMonth)
    this.financialService.getFinancial().subscribe((data) => {
      this.financials = data;
      this.filterByMonth();
    });

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = this.getCurrentMonth();

    const previousMonthDate = new Date(currentDate);
    previousMonthDate.setMonth(currentDate.getMonth());

    const startDate = `${previousMonthDate.getFullYear()}-${(previousMonthDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const endDate = `${currentYear}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    this.financialService.getFinancialsByMonth(startDate, endDate).subscribe(
      (data) => {
        this.financials = data;
        console.log(this.financials)
        this.informsTransactions = this.financials
        console.log('Transações do mês atual carregadas:', this.informsTransactions);
        this.isLoading = false;
      },
      (error) => {
        console.log('Erro ao carregar as transações do mês atual:', error);
        this.isLoading = false;
      }
    );

    this.financialService.getFinancialsByMonthCurrent(startDate, endDate).subscribe(
      (data) => {
        this.currentFinancial = data;
        console.log('Dados financeiros do mês atual:', this.currentFinancial);
      },
      (error) => {
        console.log('Erro ao carregar os dados financeiros do mês atual:', error);
      }
    );
  }

  generateYears(start: number, end: number): number[] {
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year);
    }
    return years;
  }


  confirmDate(): void {
    if (this.startMonth && this.endMonth && this.startYear && this.endYear) {
      const startDate = `${this.startYear}-${this.startMonth}`;
      const endDate = `${this.endYear}-${this.endMonth}`;

      this.financialService.getFinancialsByMonth(startDate, endDate).subscribe(
        (data) => {
          this.financials = data;
          this.informsTransactions = this.financials;
          console.log('dados recebidos', this.informsTransactions);
        },
        (error) => {
          console.log('Erro ao buscar dados financeiros', error);
        }
      )

      this.financialService.getFinancialsByMonthCurrent(startDate, endDate).subscribe(
        (data) => {
          this.financials = data;
          this.currentFinancial = this.financials;
          console.log('dados recebidos', this.currentFinancial);
        },
        (error) => {
          console.log('Erro ao buscar dados financeiros', error);
        }
      )

    } else {
      console.log('Por favor, selecione todos os campos.');
    }
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
