import { Snacks } from '../model/Snacks';

export interface Category{
  id: string,
  name: string,
  snacks: Snacks[]
  visible: boolean
}
