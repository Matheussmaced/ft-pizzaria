export interface FinanciesDTO {
  description: string,
  type: "INCOME" | "OUTCOME",
  value: number,
  transaction_date: string
}
