import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { Category } from '../../../model/Category';
import { ProductsService } from '../../services/products.service';
import { HttpClientModule } from '@angular/common/http';
import { Snacks } from '../../../model/Snacks';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, PaginatedOrders } from '../../../model/Order';

@Component({
  selector: 'app-specific-desk-report',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, CustomIconsModule],
  templateUrl: './specific-desk-report.component.html',
  styleUrl: './specific-desk-report.component.scss',
  providers: [ProductsService]
})
export class SpecificDeskReportComponent {
  categories: Category[] = [];
  filteredOrders: Order[] = [];
  tableId!: number;
  totalAmount: number = 0;

  constructor(private productService: ProductsService,
              private route: ActivatedRoute,
              private orderService: OrderService
            ) {}

  ngOnInit(): void {
    // Obter o ID ou número da mesa da URL
    this.route.params.subscribe(params => {
      this.tableId = +params['tableId'];
      console.log('Mesa selecionada:', this.tableId); // Para depuração
      this.loadOrders(); // Carregar os pedidos ao obter o ID da mesa
    });

    this.loadCategories();

    // Carregar os dados da mesa
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        id: category.id,
        name: category.category,
        visible: false,
        snacks: category.snacks.map((snack: Snacks) => ({
          ...snack,
          amount: 0
        }))
      }));
    });

    this.loadOrders();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(category => ({
        id: category.id,
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

  plusValue(orderId: string, productId: string): void {
    const order = this.filteredOrders.find(o => o.id === orderId);
    const item = order?.order_items.find(i => i.product.id === productId);
    if (item) {
      item.quantity++;
      item.sub_total = item.quantity * item.product.price;
      this.updateOrderTotal(order!);
    }
  }

  minusValue(orderId: string, productId: string): void {
    const order = this.filteredOrders.find(o => o.id === orderId);
    const item = order?.order_items.find(i => i.product.id === productId);
    if (item && item.quantity > 0) {
      item.quantity--;
      item.sub_total = item.quantity * item.product.price;
      this.updateOrderTotal(order!);
    }
  }

  removeItem(orderId: string, productId: string): void {
    const order = this.filteredOrders.find(o => o.id === orderId);
    if (order) {
      order.order_items = order.order_items.filter(i => i.product.id !== productId);
      this.updateOrderTotal(order);
    }
  }

  updateOrderTotal(order: Order): void {
    order.total = order.order_items.reduce((sum, item) => sum + item.sub_total, 0);
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data: PaginatedOrders) => {
        // Filtrar pedidos com base no número da mesa no título
        this.filteredOrders = data.orders.filter(order => {
          const match = order.title.match(/mesa (\d+)/i); // Extrair o número da mesa do título
          const orderTableNumber = match ? Number(match[1]) : null;
          return orderTableNumber === this.tableId;
        });

        console.log('Pedidos filtrados:', this.filteredOrders); // Para depuração
        this.calculateTotal(); // Atualizar o total
      },
      error: err => {
        console.error('Erro ao carregar pedidos:', err);
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.filteredOrders.reduce((total, order) => total + order.total, 0);
  }

  getProducts(order: Order) {
    return order.order_items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      subTotal: item.sub_total
    }));
  }
}
