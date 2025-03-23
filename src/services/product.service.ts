import Product from "../models/product.model";
import Category from "../models/category.model";

class ProductService {
    public async findAll(): Promise<Product[]> {
        try {
            const products = await Product.findAll({
                include: [{ model: Category, as: 'category' }]
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    public async findById(id: number): Promise<Product | null> {
        try {
            const product = await Product.findByPk(id, {
                include: [{ model: Category, as: 'category' }]
            });
            return product;
        } catch (error) {
            throw error;
        }
    }

    public async findByCategory(categoryId: number): Promise<Product[]> {
        try {
            const products = await Product.findAll({
                where: { category_id: categoryId },
                include: [{ model: Category, as: 'category' }]
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    public async create(productData: any): Promise<Product> {
        try {
            const product = await Product.create(productData);
            return product;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: number, productData: any): Promise<Product | null> {
        try {
            const [rowsUpdated, [product]] = await Product.update(productData, {
                where: { id },
                returning: true
            });
            return product || null;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: number): Promise<Product | null> {
        try {
            const product = await Product.findByPk(id);
            if (product) {
                await product.destroy();
            }
            return product;
        } catch (error) {
            throw error;
        }
    }
}

export const productService = new ProductService();