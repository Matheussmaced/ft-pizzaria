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
import { EditStockComponent } from "../../components/modal/edit-stock/edit-stock.component";
import { Category } from '../../../model/Category';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, AddingStockProductComponent, EditStockComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  providers: [ StockService ]
})
export class StockComponent implements OnInit {
  stocks: Stock[] = [];
  categories: Category[] = [];

  modal:boolean = false;
  modalEditStock:boolean = false;

  stockId:string = "";
  categoryId: string = "";

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stockService.getStock().subscribe((data: any[]) => {
      console.log('Dados recebidos:', data);
      this.stocks = data.map(item => ({
        category: item.category,
        visible: false,
        products: item.stock.map((product: ProductStocks) => ({
          ...product,
        }))
      }));
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

  openModalEditStock(stockIdApi: string | undefined, categoryIdApi: string | undefined): void {
    console.log('Abrindo modal de edição:', stockIdApi, categoryIdApi);

    if (!stockIdApi || !categoryIdApi) {
      console.log(this.stockId, this.categoryId)
      console.error('ID do produto ou categoria está indefinido');
      alert('Ocorreu um erro. Produto ou categoria inválido.');
      return;
    }

    this.stockId = stockIdApi;
    this.categoryId = categoryIdApi;

    this.modalEditStock = true;
  }

  closeModalEditProduct():void{
    this.modalEditStock = false;
  }

  deleteProduct(id: string | undefined): void {
    if (!id) {
      console.error('ID do produto está indefinido');
      alert('Ocorreu um erro. Produto inválido.');
      return;
    }

    this.stockService.deleteStock(id)?.subscribe(
      () => {
        console.log('Produto deletado com sucesso:', id);
        // Atualizar a lista local de categorias removendo o produto
        this.categories = this.categories.map(category => ({
          ...category,
          snacks: category.snacks.filter(stock => stock.id !== id)
        }));
        alert('Produto removido com sucesso!');
      },
      (error) => {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao remover o produto. Tente novamente.');
      }
    );
  }
}
