export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  is_snack: number;
  price: number;
  quantity: number | null;
  unit: string;
  category_id: string;
  category: ProductCategory;
}

export interface OrderItem {
  id: string;
  quantity: number;
  order_id: string;
  sub_total: number;
  product_id: string;
  product: Product;
}

export interface Order {
  id: string;
  title: string;
  total: number;
  table_id: string | null;
  order_items: OrderItem[];
}

export interface PaginatedOrders {
  orders: Order[];
  pages: number;
  total: number;
}
