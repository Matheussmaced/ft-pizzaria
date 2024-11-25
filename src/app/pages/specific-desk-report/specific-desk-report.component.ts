import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { Category } from '../../../model/Category';
import { ProductsService } from '../../services/products.service';
import { HttpClientModule } from '@angular/common/http';
import { Snacks } from '../../../model/Snacks';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-specific-desk-report',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, CustomIconsModule],
  templateUrl: './specific-desk-report.component.html',
  styleUrl: './specific-desk-report.component.scss',
  providers: [ProductsService]
})
export class SpecificDeskReportComponent {
  categories: Category[] = [];
  tableId!: number;

  constructor(private productService: ProductsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obter o ID ou número da mesa da URL
    this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
      console.log('Mesa selecionada:', this.tableId); // Apenas para verificação
    });

    // Carregar os dados da mesa
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        id: category.id,
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
