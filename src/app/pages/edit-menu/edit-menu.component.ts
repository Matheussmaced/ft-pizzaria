import { Component } from '@angular/core';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { CommonModule } from '@angular/common';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { ProductsService } from '../../services/products.service';
import { Category } from '../../../model/Category';
import { HttpClientModule } from '@angular/common/http';
import { AddingSnacksMenuComponent } from "../../components/modal/adding-snacks-menu/adding-snacks-menu.component";
import { Snacks } from '../../../model/Snacks';
import { EditProductComponent } from "../../components/modal/edit-product/edit-product.component";

@Component({
  selector: 'app-edit-menu',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, AddingSnacksMenuComponent, EditProductComponent],
  templateUrl: './edit-menu.component.html',
  styleUrl: './edit-menu.component.scss',
  providers: [ProductsService]
})
export class EditMenuComponent {
  categories: Category[] = [];

  modal:boolean = false;
  modalEditProduct:boolean = false;

  idProduct:string = "";

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getCategories().subscribe((data: any[]) => {
      // Verifique se 'data' está definido e se é um array
      if (Array.isArray(data)) {
        this.categories = data.map(category => ({
          id: category.id,
          name: category.category,
          visible: false,
          snacks: category.snacks.map((snack: Snacks) => ({
            ...snack,
            amount: 0
          }))
        }));
      } else {
        console.error('Dados inválidos recebidos:', data); // Caso os dados não sejam um array válido
      }
    }, (error) => {
      console.error('Erro ao carregar categorias:', error);
    });
  }

  toggleMenu(categoryIndex: number): void {
    this.categories[categoryIndex].visible = !this.categories[categoryIndex].visible;
  }

  plusValue(categoryIndex: number, snackIndex: number): void {
    this.categories[categoryIndex].snacks[snackIndex].amount += 1;
  }

  minusValue(categoryIndex: number, snackIndex: number): void {
    const snack = this.categories[categoryIndex].snacks[snackIndex];
    if (snack.amount > 0) {
      snack.amount -= 1;
    } else {
      alert("Não é possível diminuir");
    }
  }

  openModal():void{
    this.modal = !this.modal;
  }

  closeModal():void{
    this.modal = false;
  }

  openModalEditProduct( id:string | undefined):void{
    if (!id) {
      console.error('ID do produto está indefinido');
      alert('Ocorreu um erro. Produto inválido.');
      return;
    }

    this.modalEditProduct = !this.modal;

    this.idProduct = id;
  }

  closeModalEditProduct():void{
    this.modalEditProduct = false;
  }

  deleteProduct(id: string | undefined): void {
    if (!id) {
      console.error('ID do produto está indefinido');
      alert('Ocorreu um erro. Produto inválido.');
      return;
    }

    this.productsService.deleteProduct(id)?.subscribe(
      () => {
        console.log('Produto deletado com sucesso:', id);
        // Atualizar a lista local de categorias removendo o produto
        this.categories = this.categories.map(category => ({
          ...category,
          snacks: category.snacks.filter(snack => snack.id !== id)
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
