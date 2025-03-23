import { object, string, number } from 'zod';

export const productSchema = object({
  nombre: string({
    required_error: "Nombre is required"
  }),
  description: string({
    required_error: "Description is required"
  }),
  price: number({
    required_error: "Price is required"
  }).positive("Price must be positive"),
  image: string().optional(),
  stock: number({
    required_error: "Stock is required"
  }).int().nonnegative("Stock must be a non-negative integer"),
  category_id: string({
    required_error: "Category ID is required"
  })
});