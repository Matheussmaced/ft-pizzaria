import { Component, OnInit } from '@angular/core';
import { ButtonsTableComponent } from '../../components/buttons-table/buttons-table.component';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { CommonModule } from '@angular/common';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { RouterModule } from '@angular/router';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { TablesService } from '../../services/tables.service';
import { Tables } from '../../../model/Tables';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-table-screen',
  standalone: true,
  imports: [ButtonsTableComponent, SideMenuComponent, CommonModule, HeaderPagesComponent, RouterModule, ButtonHeaderComponent, HttpClientModule],
  templateUrl: './table-screen.component.html',
  styleUrl: './table-screen.component.scss',
  providers: [TablesService]
})
export class TableScreenComponent implements OnInit {
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
}
