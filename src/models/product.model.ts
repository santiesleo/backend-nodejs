// src/models/product.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Category from './category.model';
export interface ProductAttributes {
  id?: number;
  nombre: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  category_id: number;
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public nombre!: string;
  public description!: string;
  public price!: number;
  public image!: string;
  public stock!: number;
  public category_id!: number;
  
  // Timestamps que Sequelize agrega automáticamente
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'products',
    modelName: 'Product',
    timestamps: true,
  }
);

// Definir la relación con Category
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export default Product;