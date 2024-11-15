import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { Category } from '../../../model/Category';
import { MockServicesService } from '../../services/mock-services.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-specific-desk-report',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, CustomIconsModule],
  templateUrl: './specific-desk-report.component.html',
  styleUrl: './specific-desk-report.component.scss',
  providers: [MockServicesService]
})
export class SpecificDeskReportComponent {
  categories: Category[] = [];

  constructor(private mockservice: MockServicesService) {}

  ngOnInit(): void {
    this.mockservice.getCategories().subscribe((data: Category[]) => {
      this.categories = data.map(category => ({
        ...category,
        visible: false,
        snacks: category.snacks.map(snack => ({
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
