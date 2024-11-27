export interface ProductStocks {
  id: string,
  name: string,
  unit: string,
  quantity?: number,
  description: string,
  category_id?: string,
  visible: boolean
}
