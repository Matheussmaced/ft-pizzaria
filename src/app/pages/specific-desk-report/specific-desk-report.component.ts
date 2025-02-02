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
    // Obter o ID ou número da mesa da URL
    this.route.params.subscribe(params => {
      this.tableId = +params['tableId'];
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

  minusValue(orderId: string, productId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (paginatedOrders: any) => {

        // Validar se 'orders' existe e é um array
        if (!paginatedOrders.orders || !Array.isArray(paginatedOrders.orders)) {
          console.error("A resposta não contém um array de pedidos.");
          return;
        }

        // Localizar o pedido pelo ID
        const order = paginatedOrders.orders.find((o: any) => o.id === orderId);

        if (!order) {
          console.error(`Pedido com ID ${orderId} não encontrado.`);
          return;
        }

        // Localizar o item do produto dentro do pedido
        const item = order.order_items.find((i: any) => i.product.id === productId);

        if (!item || item.quantity <= 0) {
          console.warn("Produto não encontrado ou quantidade já é 0.");
          return;
        }

        // Atualizar a quantidade do produto
        item.quantity -= 1;
        item.sub_total = item.quantity * item.product.price;

        // Recalcular o total do pedido
        order.total = order.order_items.reduce((sum: number, item: any) => sum + item.sub_total, 0);

        // Enviar o pedido atualizado ao backend
        this.orderService.updateOrder(orderId, order).subscribe({
          next: (response) => {
            console.log("Pedido atualizado com sucesso:", response);
            this.loadOrders(); // Atualizar a lista de pedidos
          },
          error: (err) => {
            console.error("Erro ao atualizar o pedido:", err);
          },
        });
      },
      error: (err) => {
        console.error("Erro ao buscar pedido por ID:", err);
      },
    });
  }

  plusValue(orderId: string, productId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (paginatedOrders: any) => {
        console.log(`RESPOSTA DA API NO GETORDERBYID`, paginatedOrders);

        // Validar se 'orders' existe e é um array
        if (!paginatedOrders.orders || !Array.isArray(paginatedOrders.orders)) {
          console.error("A resposta não contém um array de pedidos.");
          return;
        }

        // Localizar o pedido pelo ID
        const order = paginatedOrders.orders.find((o: any) => o.id === orderId);

        if (!order) {
          console.error(`Pedido com ID ${orderId} não encontrado.`);
          return;
        }

        // Localizar o item do produto dentro do pedido
        const item = order.order_items.find((i: any) => i.product.id === productId);

        if (!item) {
          console.error("Produto não encontrado no pedido.");
          return;
        }

        // Atualizar a quantidade do produto
        item.quantity += 1;
        item.sub_total = item.quantity * item.product.price;

        // Recalcular o total do pedido
        order.total = order.order_items.reduce((sum: number, item: any) => sum + item.sub_total, 0);

        // Log do pedido atualizado
        console.log("Pedido atualizado:", order);

        // Enviar o pedido atualizado ao backend
        this.orderService.updateOrder(orderId, order).subscribe({
          next: (response) => {
            console.log("Pedido atualizado com sucesso:", response);
            this.loadOrders(); // Atualizar a lista de pedidos
          },
          error: (err) => {
            console.error("Erro ao atualizar o pedido:", err);
          },
        });
      },
      error: (err) => {
        console.error("Erro ao buscar pedido por ID:", err);
      },
    });
  }

  onSubmit(): void {
    const formDataFinancieCurrent: FinanciesDTO = {
      description: `Venda da mesa ${this.tableId}`,
      type: "INCOME",
      value: this.totalAmount,
      transaction_date: new Date().toISOString(),
    };

    this.financialService.createTransaction(formDataFinancieCurrent).subscribe(
      (res) => {
        console.log('Transação enviada com sucesso', res);

        this.deleteAllOrders();
      }
    );
  }

  deleteAllOrders(): void {
    for (let order of this.filteredOrders) {
      this.deleteOrder(order.id);
    }
}

deleteOrder(idOrder: string): void {
  if (!idOrder) {
    console.error('ID do pedido é inválido ou não fornecido.');
    return; // Interromper a execução se o idOrder não for válido
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Token de autenticação não encontrado.');
    alert('Erro: Não foi possível autenticar a requisição.');
    return;
  }

  const userConfirmed = confirm("Tem certeza que deseja limpar a mesa?");
  if (!userConfirmed) {
    console.log('Ação de exclusão cancelada pelo usuário.');
    return;
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.delete<Order>(
    `${environment.apiUrl}/v1/orders/${idOrder}`,
    { headers }
  ).pipe(
    catchError((error) => {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar o produto. Tente novamente.');
      return throwError(() => new Error('Erro ao realizar a requisição DELETE'));
    })
  ).subscribe();
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
