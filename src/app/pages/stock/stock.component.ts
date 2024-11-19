import { Component, OnInit } from '@angular/core';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { Stock } from '../../../model/Stock';
import { StockService } from '../../services/stock.service';
import { HttpClientModule } from '@angular/common/http';
import { AddingStockProductComponent } from "../../components/modal/adding-stock-product/adding-stock-product.component";
import { ProductStocks } from '../../../model/ProductStock';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, AddingStockProductComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  providers: [ StockService ]
})
export class StockComponent implements OnInit {
  stocks: Stock[] = [];

  modal:boolean = false;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getStock().subscribe((data: any[]) => {
      console.log('Dados recebidos:', data);
      this.stocks = data.map(item => ({
        category: item.category,
        visible: false,
        products: item.stock.map((product: ProductStocks) => ({
          ...product,
          quantity: 0
        }))
      }));
      console.log('Dados mapeados:', this.stocks);
    });
  }

  toggleMenu(categoryIndex: number): void {
    this.stocks[categoryIndex].visible = !this.stocks[categoryIndex].visible;
  }

  openModal():void{
    this.modal = !this.modal;
  }

  closeModal():void{
    this.modal = false;
  }
}
