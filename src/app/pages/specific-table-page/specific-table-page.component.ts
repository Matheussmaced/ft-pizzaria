import { Component } from '@angular/core';
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-specific-table-page',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule],
  templateUrl: './specific-table-page.component.html',
  styleUrl: './specific-table-page.component.scss'
})
export class SpecificTablePageComponent {

  products = [
    {
      name: 'HAMBURGUER 1',
      description: 'PÃO, ALFACE, CARNE DE HAMBURGUER, MOLHO',
      price: 10,
      value: 0
    },
    {
      name: 'HAMBURGUER 2',
      description: 'PÃO, ALFACE, CARNE DE HAMBURGUER, MOLHO',
      price: 10,
      value: 0
    }
  ];

   plusValue(index: number): void {
    this.products[index].value += 1;
    console.log(this.products[index].value);
  }

  minusValue(index: number): void {
    if (this.products[index].value > 0) {
      this.products[index].value -= 1;
      console.log(this.products[index].value);
    } else {
      alert("Não é possível diminuir");
    }
  }
}
