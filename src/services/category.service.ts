import Category from '../models/category.model';
import Product from '../models/product.model';
import { CategoryCreationAttributes, CategoryUpdateAttributes } from '../interfaces/category.interface';

class CategoryService {
    public async findAll(): Promise<Category[]> {
        const categories = await Category.findAll();
        return categories;
    }

    public async findById(id: number): Promise<Category | null> {
        const category = await Category.findByPk(id);
        return category;
    }

    public async create(categoryData: CategoryCreationAttributes): Promise<Category> {
        const category = await Category.create(categoryData);
        return category;
    }

    public async update(id: number, categoryData: CategoryUpdateAttributes): Promise<Category | null> {
        const [, [category]] = await Category.update(categoryData, {
            where: { id },
            returning: true
        });
        return category || null;
    }

    public async hasProducts(id: number): Promise<number> {
        return await Product.count({ where: { category_id: id } });
    }

    public async delete(id: number): Promise<Category | null> {
        const category = await Category.findByPk(id);
        if (category) {
            await category.destroy();
        }
        return category;
    }
}

export const categoryService = new CategoryService();