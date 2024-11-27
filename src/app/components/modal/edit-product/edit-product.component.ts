import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Snacks } from '../../../../model/Snacks';
import { CreateItemDTO } from '../../../../DTO/createItemDTO';
import { Category } from '../../../../model/Category';
import { AddingNewCategoryComponent } from "../adding-new-category/adding-new-category.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditItemDTO } from '../../../../DTO/editItemDTO';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [AddingNewCategoryComponent, CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  @Output() closeModal = new EventEmitter<void>();

  @Input() productId = "";
  @Input() categodyId = "";

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
      console.log('id produto' + this.productId)
      console.log('id da categoria' + this.categodyId)

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
    const editItemDto: EditItemDTO = {
      name: this.formData.name,
      description: this.formData.description,
      price: this.formData.price,
      is_snack: 1, // Fixando como lanche
      category_id: this.categodyId, // Aqui também usei categoryId
    };

    console.log('Enviando os seguintes dados para o backend:', editItemDto);

    this.productsService.editProduct(editItemDto, this.productId).subscribe(
      (response: Snacks) => {
        console.log('Produto atualizado com sucesso:', response);

        alert('Produto atualizado com sucesso!');
        this.closeModal.emit();
      },
      (error) => {
        console.error('Erro ao atualizar o produto:', error);
        alert('Erro ao atualizar o produto. Tente novamente.');
      }
    );
  }
}
