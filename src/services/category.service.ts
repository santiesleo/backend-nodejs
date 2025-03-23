import Category from '../models/category.model';
import { CategoryAttributes, CategoryCreationAttributes, CategoryUpdateAttributes } from '../interfaces/category.interface';

class CategoryService {
    public async findAll(): Promise<Category[]> {
        try {
            const categories = await Category.findAll();
            return categories;
        } catch (error) {
            throw error;
        }
    }

    public async findById(id: number): Promise<Category | null> {
        try {
            const category = await Category.findByPk(id);
            return category;
        } catch (error) {
            throw error;
        }
    }

    public async create(categoryData: CategoryCreationAttributes): Promise<Category> {
        try {
            const category = await Category.create(categoryData);
            return category;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: number, categoryData: CategoryUpdateAttributes): Promise<Category | null> {
        try {
            const [rowsUpdated, [category]] = await Category.update(categoryData, {
                where: { id },
                returning: true
            });
            return category || null;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: number): Promise<Category | null> {
        try {
            const category = await Category.findByPk(id);
            if (category) {
                await category.destroy();
            }
            return category;
        } catch (error) {
            throw error;
        }
    }
}

export const categoryService = new CategoryService();