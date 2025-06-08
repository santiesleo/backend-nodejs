import Product from "../models/product.model";
import Category from "../models/category.model";


interface ProductCreationData {
    nombre: string;
    description: string;
    price: number;
    image?: string;
    stock: number;
    category_id: number;
}

interface ProductUpdateData {
    nombre?: string;
    description?: string;
    price?: number;
    image?: string;
    stock?: number;
    category_id?: number;
}

class ProductService {
    // Recupera todos los productos junto con sus categorías relacionadas
    public async findAll(): Promise<Product[]> {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category' }]
        });
        return products;
    }

    // Busca un producto específico por su ID e incluye su categoría relacionada
    public async findById(id: number): Promise<Product | null> {
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }]
        });
        return product;
    }

    // Encuentra todos los productos que pertenecen a una categoría específica
    public async findByCategory(categoryId: number): Promise<Product[]> {
        const products = await Product.findAll({
            where: { category_id: categoryId },
            include: [{ model: Category, as: 'category' }]
        });
        return products;
    }

    public async create(productData: ProductCreationData): Promise<Product> {
        const product = await Product.create(productData);
        return product;
    }

    public async update(id: number, productData: ProductUpdateData): Promise<Product | null> {
        const [, [product]] = await Product.update(productData, {
            where: { id },
            returning: true
        });
        return product || null;
    }

    public async delete(id: number): Promise<Product | null> {
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
        }
        return product;
    }
}

export const productService = new ProductService();