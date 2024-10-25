import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';

@Component({
  selector: 'app-specific-desk-report',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule],
  templateUrl: './specific-desk-report.component.html',
  styleUrl: './specific-desk-report.component.scss'
})
export class SpecificDeskReportComponent {
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
