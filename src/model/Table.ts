import { Category } from "./Category";

export interface Table {
  tableId: number;
  categories: Category[];
  snackAmounts: { [snackId: number]: number };
}
