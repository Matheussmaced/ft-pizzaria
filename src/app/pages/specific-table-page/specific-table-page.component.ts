import { Component, OnInit } from '@angular/core';
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { ProductsService } from '../../services/products.service';
import { Category } from '../../../model/Category';
import { HttpClientModule } from '@angular/common/http';
import { Snacks } from '../../../model/Snacks';

@Component({
  selector: 'app-specific-table-page',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule],
  templateUrl: './specific-table-page.component.html',
  styleUrls: ['./specific-table-page.component.scss'],
  providers: [ProductsService]
})
export class SpecificTablePageComponent implements OnInit {
  categories: Category[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe((data: any[]) => {
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
}
