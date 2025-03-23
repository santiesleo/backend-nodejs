export interface ProductAttributes {
    id?: number;
    nombre: string;
    description: string;
    price: number;
    image?: string;
    stock: number;
    category_id: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ProductCreationAttributes extends Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
  
  export interface ProductUpdateAttributes extends Partial<ProductCreationAttributes> {}