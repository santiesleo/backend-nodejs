// src/interfaces/category.interface.ts
export interface CategoryAttributes {
    id?: number;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CategoryCreationAttributes extends Omit<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface CategoryUpdateAttributes extends Partial<CategoryCreationAttributes> {}