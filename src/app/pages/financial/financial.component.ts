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
  styleUrl: './financial.component.scss'
})
export class FinancialComponent implements OnInit {
  financials: Financial[] = [];
  filteredFinancials: Financial[] = [];
  selectedMonth: string = '';
  modal: boolean = false;

  constructor(private financialService: FinancialService) {}

  ngOnInit(): void {
    this.financialService.getFinancial().subscribe((data) => {
      this.financials = data;
      this.filterByMonth();
    });
  }

  onMonthChange(target: EventTarget | null): void {
    if (target instanceof HTMLSelectElement) {
      this.selectedMonth = target.value;
      this.filterByMonth();
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
