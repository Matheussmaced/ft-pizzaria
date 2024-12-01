import { Order_itemsDTO } from "./order_itemsDTO";

export interface UpdateOrderDTO {
  id: string ;
  title: string;
  total: number;
  table_id?: string | null;
  order_items: Order_itemsDTO[];
}
