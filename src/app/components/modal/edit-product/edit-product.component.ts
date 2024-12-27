import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Snacks } from '../../../../model/Snacks';
import { CreateItemDTO } from '../../../../DTO/createItemDTO';
import { Category } from '../../../../model/Category';
import { AddingNewCategoryComponent } from "../adding-new-category/adding-new-category.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditItemDTO } from '../../../../DTO/editItemDTO';
import { environment } from '../../../../environments/environment';

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

  showSizeSelect: boolean = false;

  categories: Category[] = [];
  modal:boolean = false;

  selectedProductId: string | null = null;


  formData = {
    name: '',
    categoryId: '',
    description: '',
    price: 0,
    size: ''
  };

  constructor ( private productsService: ProductsService, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    console.log(this.productId);

    // Carrega categorias para uso geral
    this.productsService.getCategoriesModal().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        id: category.id,
        name: category.name,
        visible: false,
        snacks: category.snacks ? category.snacks.map((snack: Snacks) => ({
          ...snack,
          amount: 0
        })) : []
      }));
    });

    // Carrega informações do produto pelo ID
    if (this.productId) {
      this.productsService.getProductById(this.productId).subscribe(
        (response: any[]) => {
          console.log('Produto carregado:', response);

          if (response.length > 0) {
            const product = response[0];

            console.log(product);

            if (product.snacks && product.snacks.length > 0) {
              const snack = product.snacks[0];

              this.formData = {
                name: snack.name || '',
                categoryId: this.categodyId,
                description: snack.description || '',
                price: snack.price || 0,
                size: snack.size || ''
              };
            }
          } else {
            console.error('Nenhum produto encontrado para o ID fornecido.');
            alert('Erro: Nenhum produto encontrado.');
          }
        },
        (error) => {
          console.error('Erro ao carregar o produto:', error);
          alert('Erro ao carregar o produto. Verifique se o ID está correto.');
        }
      );
    } else {
      console.error('ID do produto não foi fornecido.');
      alert('Erro: ID do produto não especificado.');
    }
  }

  onCategoryChange(categoryName: string): void {
    const pizzaKeywords = ["pizzas tradicional", "pizzas", "pizzas especiais"];
    this.showSizeSelect = pizzaKeywords.some(keyword =>
      categoryName.toLowerCase().includes(keyword)
    );
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
      is_snack: 1,
      category_id: this.categodyId,
      size: this.formData.size
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
