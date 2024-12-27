import { Snacks } from "./Snacks";

export interface CategoryPizza {
  id: string;
  name: string;
  visible: boolean;
  snacks: Snacks[];
}
