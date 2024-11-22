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
import { ActivatedRoute } from '@angular/router';
import { CreateOrderDTO } from '../../../DTO/createOrderDTO';
import { Order_itemsDTO } from '../../../DTO/order_itemsDTO';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-specific-table-page',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule],
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
    // Obter o ID ou número da mesa da URL
    this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
      console.log('Mesa selecionada:', this.tableId); // Apenas para verificação
    });

    // Carregar os dados da mesa
    this.productService.getCategories().subscribe((data: any[]) => {
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
      alert('Não há pedidos para a mesa!');
      return;
    }

    // Atualizar o pedido acumulado
    newOrderItems.forEach(newItem => {
      const existingItem = this.accumulatedOrder.order_items.find(
        item => item.product_id === newItem.product_id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.sub_total += newItem.sub_total;
      } else {
        this.accumulatedOrder.order_items.push(newItem);
      }
    });

    this.accumulatedOrder.total += newTotal;
    this.accumulatedOrder.title = `Venda mesa ${this.tableId}`;

    // Enviar pedido acumulado para a API
    this.orderService.createOrder(this.accumulatedOrder).subscribe({
      next: response => {
        console.log('Pedido enviado com sucesso:', response);
        alert('Pedido enviado com sucesso!');
      },
      error: err => {
        console.error('Erro ao enviar pedido:', err);
        alert('Erro ao enviar pedido!');
      }
    });
  }
}
