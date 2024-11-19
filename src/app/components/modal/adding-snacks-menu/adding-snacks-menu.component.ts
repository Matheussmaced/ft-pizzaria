import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../../model/Category';
import { Snacks } from '../../../../model/Snacks';
import { CommonModule } from '@angular/common';
import { AddingNewCategoryComponent } from "../adding-new-category/adding-new-category.component";

@Component({
  selector: 'app-adding-snacks-menu',
  standalone: true,
  imports: [CommonModule, AddingNewCategoryComponent],
  templateUrl: './adding-snacks-menu.component.html',
  styleUrl: './adding-snacks-menu.component.scss'
})
export class AddingSnacksMenuComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  categories: Category[] = [];
  modal:boolean = false;

  constructor ( private productsService: ProductsService ) {}

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

  onCancel(){
    this.closeModal.emit();
  }

  openModal():void{
    this.modal = !this.modal;
  }

  closeModalCategory(): void {
    this.modal = false;
  }
}
