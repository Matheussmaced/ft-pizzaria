import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomIconsModule } from '../../modules/custom-icons/custom-icons.module';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { HeaderPagesComponent } from '../../components/header-pages/header-pages.component';
import { ButtonHeaderComponent } from "../../components/button-header/button-header.component";
import { Category } from '../../../model/Category';
import { ProductsService } from '../../services/products.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Snacks } from '../../../model/Snacks';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, PaginatedOrders } from '../../../model/Order';
import { UpdateOrderDTO } from '../../../DTO/UpdateOrderItemDTO';
import { CreateOrderDTO } from '../../../DTO/createOrderDTO';
import { FinanciesDTO } from '../../../DTO/financiesDTO';
import { Financial } from '../../../model/financial/Financial';
import { FinancialService } from '../../services/financial.service';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-specific-desk-report',
  standalone: true,
  imports: [HeaderPagesComponent, SideMenuComponent, CustomIconsModule, CommonModule, ButtonHeaderComponent, HttpClientModule, CustomIconsModule],
  templateUrl: './specific-desk-report.component.html',
  styleUrl: './specific-desk-report.component.scss',
  providers: [ProductsService, OrderService]
})
export class SpecificDeskReportComponent {
  categories: Category[] = [];
  filteredOrders: Order[] = [];
  tableId!: number;
  totalAmount: number = 0;

  idProduct: string = '';

  accumulatedOrder: CreateOrderDTO = {
    total: 0,
    title: '',
    order_items: []
  };

  constructor(private productService: ProductsService,
              private route: ActivatedRoute,
              private orderService: OrderService,
              private financialService: FinancialService,
              private http: HttpClient
            ) {}

 ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tableId = +params['tableId'];
      this.loadOrders();
    });
    this.loadCategories();
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

  loadOrders(): void {
    // Criando uma chave dinâmica com base no id da mesa
    const orderKey = `currentOrder${this.tableId}`;
    const storedOrder = localStorage.getItem(orderKey);

    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      this.filteredOrders = parsedOrder.orders;
      this.totalAmount = parsedOrder.totalAmount;
      console.log('Pedidos carregados do localStorage:', this.filteredOrders);
    } else {
      this.orderService.getOrders().subscribe({
        next: (data: PaginatedOrders) => {
          this.filteredOrders = data.orders.filter(order => {
            const match = order.title.match(/mesa (\d+)/i);
            const orderTableNumber = match ? Number(match[1]) : null;
            return orderTableNumber === this.tableId;
          });
          this.calculateTotal();
          this.saveOrdersToLocalStorage();
        },
        error: err => {
          console.error('Erro ao carregar pedidos:', err);
        }
      });
    }
}

saveOrdersToLocalStorage(): void {
  // Usando a chave dinâmica para salvar os pedidos por mesa
  const orderKey = `currentOrder${this.tableId}`; // Exemplo: currentOrder1 para mesa 1
  const orderData = {
    title: `Venda mesa ${this.tableId}`, // Título com o ID da mesa
    totalAmount: this.totalAmount,
    orders: this.filteredOrders
  };
  localStorage.setItem(orderKey, JSON.stringify(orderData)); // Salva com a chave específica da mesa
}

  calculateTotal(): void {
    this.totalAmount = this.filteredOrders.reduce((total, order) => total + order.total, 0);
  }

  onSubmit(): void {
    const formDataFinancieCurrent: FinanciesDTO = {
      description: `Venda da mesa ${this.tableId}`, // Descrição com o ID da mesa
      type: 'INCOME',
      value: this.totalAmount,
      transaction_date: new Date().toISOString(),
    };

    this.financialService.createTransaction(formDataFinancieCurrent).subscribe(
      (res) => {
        console.log('Transação enviada com sucesso', res);
        this.saveOrdersToLocalStorage();  // Salva novamente os dados após a transação
        this.deleteAllOrders();  // Limpa os pedidos da mesa
      },
      (err) => {
        console.error('Erro ao enviar transação:', err);
      }
    );
}

  deleteAllOrders(): void {
    for (let order of this.filteredOrders) {
      this.deleteOrder(order.id);
    }

    const orderKey = `mesa_${this.tableId}`;
    localStorage.removeItem(orderKey);  // Remove os dados da mesa do localStorage
  }

  deleteOrder(idOrder: string): void {
    if (!idOrder) {
      console.error('ID do pedido é inválido ou não fornecido.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      alert('Erro: Não foi possível autenticar a requisição.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete<Order>(`${environment.apiUrl}/v1/orders/${idOrder}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao deletar pedido:', error);
        alert('Erro ao deletar o pedido. Tente novamente.');
        return throwError(() => new Error('Erro ao realizar a requisição DELETE'));
      })
    ).subscribe();
  }

  plusValue(orderId: string, productId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (paginatedOrders: any) => {
        const order = paginatedOrders.orders.find((o: any) => o.id === orderId);
        const item = order.order_items.find((i: any) => i.product.id === productId);
        if (item) {
          item.quantity += 1;
          item.sub_total = item.quantity * item.product.price;
          this.updateOrderTotal(order);
          this.orderService.updateOrder(orderId, order).subscribe(() => this.saveOrdersToLocalStorage());
        }
      },
      error: (err) => {
        console.error('Erro ao buscar pedido por ID:', err);
      }
    });
  }

  minusValue(orderId: string, productId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (paginatedOrders: any) => {
        const order = paginatedOrders.orders.find((o: any) => o.id === orderId);
        const item = order.order_items.find((i: any) => i.product.id === productId);
        if (item && item.quantity > 0) {
          item.quantity -= 1;
          item.sub_total = item.quantity * item.product.price;
          this.updateOrderTotal(order);
          this.orderService.updateOrder(orderId, order).subscribe(() => this.saveOrdersToLocalStorage());
        }
      },
      error: (err) => {
        console.error('Erro ao buscar pedido por ID:', err);
      }
    });
  }

  updateOrderTotal(order: Order): void {
    order.total = order.order_items.reduce((sum, item) => sum + item.sub_total, 0);
  }

  getProducts(order: Order) {
    return order.order_items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      subTotal: item.sub_total
    }));
  }
}
