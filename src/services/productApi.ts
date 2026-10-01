import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>('/products?limit=12');
  return res.data;
};