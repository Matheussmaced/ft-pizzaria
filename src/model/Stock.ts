import { ProductStocks } from "./ProductStock";

export interface Stock {
  category: string,
  products: ProductStocks[]
  visible: boolean
}
