import { Component, EventEmitter, Output } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Snacks } from '../../../../model/Snacks';
import { CreateItemDTO } from '../../../../DTO/createItemDTO';
import { Category } from '../../../../model/Category';
import { AddingNewCategoryComponent } from "../adding-new-category/adding-new-category.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [AddingNewCategoryComponent, CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  @Output() closeModal = new EventEmitter<void>();
  categories: Category[] = [];
  modal:boolean = false;

  selectedProductId: string | null = null;

  formData = {
    name: '',
    categoryId: '', // Alterei para categoryId com 'Id' maiúsculo
    description: '',
    price: 0,
  };

  constructor ( private productsService: ProductsService ) {}

  ngOnInit(): void {
    this.productsService.getCategoriesModal().subscribe((data: any[]) => {
      console.log('Dados retornados da API:', data);  // Loga os dados para ver a estrutura

      this.categories = data.map(category => ({
        id: category.id,  // Certifique-se que `category.id` é o valor correto
        name: category.name,  // Ajuste para `category.name` ou o campo correto
        visible: false,
        snacks: category.snacks ? category.snacks.map((snack: Snacks) => ({
          ...snack,
          amount: 0
        })) : []
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
      (category) => String(category.id) === String(this.formData.categoryId) // Usei categoryId aqui
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
      is_snack: 1, // Fixando como lanche
      category_id: this.formData.categoryId, // Aqui também usei categoryId
    };

    console.log('Enviando os seguintes dados para o backend:', createItemDto);

    this.productsService.addProduct(createItemDto).subscribe(
      (response: Snacks) => {
        console.log('Produto adicionado com sucesso:', response);

        selectedCategory.snacks.push({
          ...response, // O backend retorna o snack completo, incluindo o ID
          amount: 0, // Garante que o campo 'amount' seja inicializado
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
