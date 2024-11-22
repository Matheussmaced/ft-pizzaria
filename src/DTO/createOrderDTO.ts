import { Order_itemsDTO } from "./order_itemsDTO";

export interface CreateOrderDTO {
  total: number,
  title: string,
  order_items: Order_itemsDTO[]
}
