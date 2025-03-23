// src/models/category.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Category extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'categories',
        modelName: 'Category',
        timestamps: true
    }
);

export default Category;