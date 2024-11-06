import { Component, OnInit } from '@angular/core';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { Stock } from '../../../model/Stock';
import { StockService } from '../../services/stock.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  providers: [ StockService ]
})
export class StockComponent implements OnInit {
  stocks: Stock[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getStock().subscribe((data: Stock[]) => {
      this.stocks = data.map(category => ({
        ...category,
        visible: false
      }));
    });
  }

  toggleMenu(categoryIndex: number): void {
    this.stocks[categoryIndex].visible = !this.stocks[categoryIndex].visible;
  }
}
