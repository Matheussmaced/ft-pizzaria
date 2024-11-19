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

@Component({
  selector: 'app-edit-menu',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, AddingSnacksMenuComponent],
  templateUrl: './edit-menu.component.html',
  styleUrl: './edit-menu.component.scss',
  providers: [ProductsService]
})
export class EditMenuComponent {
  categories: Category[] = [];

  modal:boolean = false;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        name: category.category,
        visible: false,
        snacks: category.snacks.map((snack: Snacks) => ({
          ...snack,
          amount: 0
        }))
      }));
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
}
