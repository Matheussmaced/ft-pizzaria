import { Component } from '@angular/core';
import { ButtonsTableComponent } from '../../components/buttons-table/buttons-table.component';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { CommonModule } from '@angular/common';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { RouterModule } from '@angular/router';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";

@Component({
  selector: 'app-table-screen',
  standalone: true,
  imports: [ButtonsTableComponent, SideMenuComponent, CommonModule, HeaderPagesComponent, RouterModule, ButtonHeaderComponent],
  templateUrl: './table-screen.component.html',
  styleUrl: './table-screen.component.scss'
})
export class TableScreenComponent {
  visibleTables:number = 21;
  totalTables: number = 30;
  increment: number = 5;

  showMoreTables(){
    const newVisibleTables = this.visibleTables + this.increment;

    this.visibleTables = newVisibleTables > this.totalTables ? this.totalTables : newVisibleTables;
  }
}
