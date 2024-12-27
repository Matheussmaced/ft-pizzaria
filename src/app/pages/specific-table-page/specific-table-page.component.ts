import { Component, OnInit } from '@angular/core';
import { HeaderPagesComponent } from "../../components/header-pages/header-pages.component";
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { CommonModule } from '@angular/common';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { ProductsService } from '../../services/products.service';
import { Category } from '../../../model/Category';
import { HttpClientModule } from '@angular/common/http';
import { Snacks } from '../../../model/Snacks';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CreateOrderDTO } from '../../../DTO/createOrderDTO';
import { OrderService } from '../../services/order.service';
import { PizzaSizeContainerComponent } from '../../components/pizza-size-container/pizza-size-container.component';

@Component({
  selector: 'app-specific-table-page',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, PizzaSizeContainerComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, RouterLink],
  templateUrl: './specific-table-page.component.html',
  styleUrls: ['./specific-table-page.component.scss'],
  providers: [ProductsService]
})
export class SpecificTablePageComponent implements OnInit {
  categories: Category[] = [];
  tableId!: number;

  showPizzaSizes: boolean = false;
  selectedPizzaSize: string = '';

  accumulatedOrder: CreateOrderDTO = {
    total: 0,
    title: '',
    order_items: []
  };

  constructor(private productService: ProductsService,
              private route: ActivatedRoute,
              private orderService: OrderService
             ) {}

  ngOnInit(): void {
    // Obter os parâmetros da rota
    this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
      console.log('Mesa selecionada:', this.tableId);
    });

    this.loadCategories();
    this.loadOrderForTable();

    // Carregar categorias
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        id: category.id,
        name: category.category,
        visible: false,
        snacks: category.snacks.map((snack: Snacks) => ({
          ...snack,
          amount: 0 // Inicializar quantidade com 0
        }))
      }));

      // Após as categorias serem carregadas, tente recuperar o pedido acumulado
      const savedOrder = localStorage.getItem(`currentOrder_${this.tableId}`);
      if (savedOrder) {
        this.accumulatedOrder = JSON.parse(savedOrder);
        console.log(`Pedido recuperado para a mesa ${this.tableId}:`, this.accumulatedOrder);

        // Atualizar as quantidades de snacks com base no pedido
        this.updateCategoryAmounts();
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        id: category.id,
        name: category.category,
        visible: false,
        snacks: category.snacks.map((snack: Snacks) => ({
          ...snack,
          amount: 0 // Inicializar quantidade com 0
        }))
      }));

      // Atualizar os produtos com base no pedido recuperado
      this.updateCategoryAmounts();
    });
  }

  loadOrderForTable(): void {
    const savedOrder = localStorage.getItem(`currentOrder_${this.tableId}`);
    if (savedOrder) {
      this.accumulatedOrder = JSON.parse(savedOrder);
      console.log(`Pedido recuperado para a mesa ${this.tableId}:`, this.accumulatedOrder);
      this.updateCategoryAmounts(); // Atualiza os valores dos snacks
    } else {
      this.accumulatedOrder = {
        total: 0,
        title: `Venda mesa ${this.tableId}`,  // Definindo o title corretamente
        order_items: []
      };
    }
  }

  updateCategoryAmounts(): void {
    this.accumulatedOrder.order_items.forEach(item => {
      const snack = this.findSnackByProductId(item.product_id);
      if (snack) {
        snack.amount = item.quantity; // Sincroniza o `amount` do snack
      }
    });
  }

  // Encontrar o produto pelo id
  findSnackByProductId(productId: string): Snacks | undefined {
    for (let category of this.categories) {
      const snack = category.snacks.find(snack => String(snack.id) === productId);
      if (snack) return snack;
    }
    return undefined;
  }

  toggleMenu(categoryIndex: number): void {
    this.categories[categoryIndex].visible = !this.categories[categoryIndex].visible;
  }

  togglePizzaSizes(): void {
    this.showPizzaSizes = !this.showPizzaSizes;
  }

  selectPizzaSize(size: string): void {
    this.selectedPizzaSize = size;
    console.log('Tamanho de pizza selecionado:', this.selectedPizzaSize);
  }

  plusValue(categoryIndex: number, snackIndex: number): void {
    const snack = this.categories[categoryIndex].snacks[snackIndex];
    snack.amount += 1;

    const existingItem = this.accumulatedOrder.order_items.find(item => item.product_id === String(snack.id));
    if (existingItem) {
      existingItem.quantity = snack.amount;
      existingItem.sub_total = snack.amount * snack.price;
    } else {
      this.accumulatedOrder.order_items.push({
        product_id: String(snack.id),
        quantity: snack.amount,
        sub_total: snack.amount * snack.price
      });
    }

    this.updateTotal();
    this.updateOrderInLocalStorage();
  }

  minusValue(categoryIndex: number, snackIndex: number): void {
    const snack = this.categories[categoryIndex].snacks[snackIndex];  // Corrigido 'snack' para 'snacks'
    if (snack.amount > 0) {
      snack.amount -= 1;

      const existingItem = this.accumulatedOrder.order_items.find(item => item.product_id === String(snack.id));
      if (existingItem) {
        if (snack.amount === 0) {
          // Remove o item se a quantidade for 0
          this.accumulatedOrder.order_items = this.accumulatedOrder.order_items.filter(item => item.product_id !== String(snack.id));
        } else {
          existingItem.quantity = snack.amount;
          existingItem.sub_total = snack.amount * snack.price;
        }
      }

      this.updateTotal();
      this.updateOrderInLocalStorage();
    } else {
      alert("Não é possível diminuir abaixo de zero.");
    }
  }

  addOrder(): void {
    this.categories.forEach(category => {
      category.snacks.forEach(snack => {
        if (snack.amount > 0) {
          const existingItem = this.accumulatedOrder.order_items.find(item => item.product_id === String(snack.id));
          if (existingItem) {
            existingItem.quantity = snack.amount;
            existingItem.sub_total = snack.amount * snack.price;
          } else {
            this.accumulatedOrder.order_items.push({
              product_id: String(snack.id),
              quantity: snack.amount,
              sub_total: snack.amount * snack.price
            });
          }
        }
      });
    });

    this.updateTotal();
    this.updateOrderInLocalStorage();
    alert('Pedido atualizado com sucesso!');
  }

  updateTotal(): void {
    this.accumulatedOrder.total = this.accumulatedOrder.order_items.reduce((sum, item) => sum + item.sub_total, 0);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  finalizeOrder(): void {
    const orderData = localStorage.getItem(`currentOrder_${this.tableId}`);
    if (!orderData) {
      alert('Nenhum pedido encontrado para finalizar!');
      return;
    }

    const order: CreateOrderDTO = JSON.parse(orderData);

    // Atualizar título e total antes de enviar
    order.title = `Venda mesa ${this.tableId}`;
    order.total = order.order_items.reduce((sum, item) => sum + item.sub_total, 0);

    console.log('Enviando pedido para a API:', order);

    this.orderService.createOrder(order).subscribe({
      next: response => {
        console.log('Pedido enviado com sucesso:', response);
        alert('Pedido enviado com sucesso!');
        localStorage.removeItem(`currentOrder_${this.tableId}`); // Limpar localStorage após o envio
      },
      error: err => {
        console.error('Erro ao enviar pedido:', err);
        alert('Erro ao enviar pedido!');
      }
    });
  }

  // Função para atualizar o pedido no localStorage
  updateOrderInLocalStorage(): void {
    localStorage.setItem(`currentOrder_${this.tableId}`, JSON.stringify(this.accumulatedOrder));
  }
}
