import { Component } from '@angular/core';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { ButtonsTableComponent } from "../../components/buttons-table/buttons-table.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { TablesService } from '../../services/tables.service';
import { Tables } from '../../../model/Tables';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-table-report',
  standalone: true,
  imports: [SideMenuComponent, HeaderPagesComponent, ButtonsTableComponent, CommonModule, RouterLink, ButtonHeaderComponent, HttpClientModule],
  templateUrl: './table-report.component.html',
  styleUrl: './table-report.component.scss',
  providers: [TablesService]
})
export class TableReportComponent {
  tables: Tables[] = [];
  visibleTables = 21;

  constructor(private tablesService: TablesService) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.tablesService.getTables().subscribe((data: Tables[]) => {
      this.tables = data;
    });
  }

  showMoreTables(): void {
    this.visibleTables += 7;
  }

  hasPendingOrders(tableId: number): boolean {
    const savedOrder = localStorage.getItem(`currentOrder_${tableId}`);
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      return order.order_items.length > 0;
    }
    return false;
  }
}
