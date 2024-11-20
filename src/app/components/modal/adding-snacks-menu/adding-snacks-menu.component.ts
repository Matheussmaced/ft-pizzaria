import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Category } from '../../../../model/Category';
import { Snacks } from '../../../../model/Snacks';
import { CommonModule } from '@angular/common';
import { AddingNewCategoryComponent } from "../adding-new-category/adding-new-category.component";
import { FormsModule } from '@angular/forms';
import { CreateItemDTO } from '../../../../DTO/createItemDTO';

@Component({
  selector: 'app-adding-snacks-menu',
  standalone: true,
  imports: [CommonModule, AddingNewCategoryComponent, FormsModule],
  templateUrl: './adding-snacks-menu.component.html',
  styleUrl: './adding-snacks-menu.component.scss'
})
export class AddingSnacksMenuComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  categories: Category[] = [];
  modal:boolean = false;

  formData = {
    name: '',
    category: '',
    description: '',
    price: 0,
  };

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

  onSubmit(): void {
    const selectedCategory = this.categories.find(
      (category) => category.name === this.formData.category
    );

    if (!selectedCategory) {
      console.error('Categoria não encontrada');
      alert('A categoria selecionada não existe.');
      return;
    }


    const createItemDto: CreateItemDTO = {
      name: this.formData.name,
      description: this.formData.description,
      price: this.formData.price,
    };


    this.productsService.addProduct(createItemDto).subscribe(
      (response) => {
        console.log('Produto adicionado com sucesso:', response);

        selectedCategory.snacks.push({
          ...response,
          amount: 0,
        });

        alert('Produto adicionado com sucesso!');
        this.closeModal.emit();
      },
      (error) => {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar o produto. Tente novamente.');
      }
    );
  }
}
