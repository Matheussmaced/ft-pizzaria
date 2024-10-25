import { Component } from '@angular/core';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { CommonModule } from '@angular/common';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';

@Component({
  selector: 'app-edit-menu',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule],
  templateUrl: './edit-menu.component.html',
  styleUrl: './edit-menu.component.scss'
})
export class EditMenuComponent {
  visibleMenu:boolean = false;

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

  toggleMenu(): void {
    this.visibleMenu = !this.visibleMenu;
    console.log(this.visibleMenu);
  }

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
