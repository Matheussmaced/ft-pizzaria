import { Snacks } from '../model/Snacks';

export interface Category{
  name: string,
  snacks: Snacks[]
  visible: boolean
}
