import { Transactions } from "./Transactions";

export interface Financial {
  month: string,
  year: number,
  income: number,
  expenses: number,
  totalBalance: number,
  [typeOfValueInformation: string]: any,
  transactions: Transactions[]
}
