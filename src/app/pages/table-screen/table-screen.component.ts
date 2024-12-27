import { Component, OnInit } from '@angular/core';
import { ButtonsTableComponent } from '../../components/buttons-table/buttons-table.component';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { CommonModule } from '@angular/common';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { RouterModule } from '@angular/router';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { TablesService } from '../../services/tables.service';
import { Tables } from '../../../model/Tables';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AddingTableModalComponent } from "../../components/modal/adding-table-modal/adding-table-modal.component";

@Component({
  selector: 'app-table-screen',
  standalone: true,
  imports: [ButtonsTableComponent, SideMenuComponent, CommonModule, HeaderPagesComponent, RouterModule, ButtonHeaderComponent, HttpClientModule, AddingTableModalComponent],
  templateUrl: './table-screen.component.html',
  styleUrl: './table-screen.component.scss',
  providers: [TablesService]
})
export class TableScreenComponent implements OnInit {
  tables: Tables[] = [];
  visibleTables = 21;

  modal:boolean = false;


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

  openModal():void{
    this.modal = !this.modal;
  }

  closeModal():void{
    this.modal = false;
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
