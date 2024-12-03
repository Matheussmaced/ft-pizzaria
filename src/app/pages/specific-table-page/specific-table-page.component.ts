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
import { Order_itemsDTO } from '../../../DTO/order_itemsDTO';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-specific-table-page',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, RouterLink],
  templateUrl: './specific-table-page.component.html',
  styleUrls: ['./specific-table-page.component.scss'],
  providers: [ProductsService]
})
export class SpecificTablePageComponent implements OnInit {
  categories: Category[] = [];
  tableId!: number;

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
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        this.accumulatedOrder = JSON.parse(savedOrder);
        console.log('Pedido recuperado do localStorage:', this.accumulatedOrder);

        // Atualizar as quantidades de snacks com base no pedido
        this.updateCategoryAmounts();
      }
    });
  }

  // Atualizar as quantidades dos produtos com base no pedido acumulado
  updateCategoryAmounts(): void {
    this.accumulatedOrder.order_items.forEach(item => {
      const snack = this.findSnackByProductId(item.product_id);
      if (snack) {
        snack.amount = item.quantity;
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

  plusValue(categoryIndex: number, snackIndex: number): void {
    const snack = this.categories[categoryIndex].snacks[snackIndex];
    snack.amount += 1;
    this.updateOrderInLocalStorage(); // Atualizar o pedido no localStorage
  }

  minusValue(categoryIndex: number, snackIndex: number): void {
    const snack = this.categories[categoryIndex].snacks[snackIndex];
    if (snack.amount > 0) {
      snack.amount -= 1;
      this.updateOrderInLocalStorage(); // Atualizar o pedido no localStorage
    } else {
      alert("Não é possível diminuir");
    }
  }

  addOrder(): void {
    const newOrderItems: Order_itemsDTO[] = [];
    let newTotal = 0;

    // Criar novo pedido com base nos produtos
    this.categories.forEach(category => {
      category.snacks.forEach(snack => {
        if (snack.amount > 0) {
          const subTotal = snack.amount * snack.price;
          newTotal += subTotal;

          // Adicionar ao array de novos pedidos
          newOrderItems.push({
            quantity: snack.amount,
            product_id: String(snack.id), // Garantir que o ID é string
            sub_total: subTotal
          });
        }
      });
    });

    if (newOrderItems.length === 0) {
      alert('Não há pedidos para adicionar!');
      return;
    }

    // Atualizar o pedido acumulado, substituindo a quantidade existente, sem somar
    newOrderItems.forEach(newItem => {
      const existingItem = this.accumulatedOrder.order_items.find(
        item => item.product_id === newItem.product_id
      );

      if (existingItem) {
        // Atualiza a quantidade e subtotal corretamente
        existingItem.quantity = newItem.quantity;
        existingItem.sub_total = newItem.sub_total;
      } else {
        this.accumulatedOrder.order_items.push(newItem);
      }
    });

    this.accumulatedOrder.total += newTotal;
    this.accumulatedOrder.title = `Venda mesa ${this.tableId}`;

    // Salvar pedido atualizado no localStorage
    this.updateOrderInLocalStorage();
    alert('Pedido adicionado com sucesso!');
  }

  finalizeOrder(): void {
    const orderData = localStorage.getItem('currentOrder');
    if (!orderData) {
      alert('Nenhum pedido encontrado para finalizar!');
      return;
    }

    const order: CreateOrderDTO = JSON.parse(orderData);

    // Enviar pedido acumulado para a API
    this.orderService.createOrder(order).subscribe({
      next: response => {
        console.log('Pedido enviado com sucesso:', response);
        alert('Pedido enviado com sucesso!');
        localStorage.removeItem('currentOrder'); // Limpar localStorage após o envio
      },
      error: err => {
        console.error('Erro ao enviar pedido:', err);
        alert('Erro ao enviar pedido!');
      }
    });
  }

  // Função para atualizar o pedido no localStorage
  updateOrderInLocalStorage(): void {
    localStorage.setItem('currentOrder', JSON.stringify(this.accumulatedOrder));
  }
}
