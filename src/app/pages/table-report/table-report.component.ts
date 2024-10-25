import { Component } from '@angular/core';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { ButtonsTableComponent } from "../../components/buttons-table/buttons-table.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-report',
  standalone: true,
  imports: [SideMenuComponent, HeaderPagesComponent, ButtonsTableComponent, CommonModule],
  templateUrl: './table-report.component.html',
  styleUrl: './table-report.component.scss'
})
export class TableReportComponent {
  visibleTables:number = 21;
  totalTables: number = 30;
  increment: number = 5;

  showMoreTables(){
    const newVisibleTables = this.visibleTables + this.increment;

    this.visibleTables = newVisibleTables > this.totalTables ? this.totalTables : newVisibleTables;
  }
}
