import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import {
  createProductValidator,
  updateProductValidator,
  productFiltersValidator,
  deleteProductValidator,
  getProductByIdValidator,
} from "../validators/product.validators";

const productService = new ProductService();


export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = createProductValidator.parse(req.body);
    const product = await productService.createProduct(validatedData);
    return res.status(201).json(product);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while creating the product";
    return res.status(400).json({ error: errorMessage });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = updateProductValidator.parse({
      ...req.body,
      id: parseInt(req.params.id),
    });
    const product = await productService.updateProduct(validatedData);
    return res.status(200).json(product);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while updating the product";
    return res.status(400).json({ error: errorMessage });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = deleteProductValidator.parse({
      id: parseInt(req.params.id),
    });
    await productService.deleteProduct(validatedData.id);
    return res.status(204).send();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while deleting the product";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const validatedData = getProductByIdValidator.parse({
      id: parseInt(req.params.id),
    });
    const product = await productService.getProductById(validatedData.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
=======
export const ProductController = {
  async getAll(_req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        // include: {
        //   productSkus: true,
        //   category: true,
        //   subCategories: true,
        // }
        include:{
          skus:true,
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          skus: {
            include: {
              // sizeAttribute: true,
              // colorAttribute: true,
            }
          },
          reviews: true,
        }
      });
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: 'Product not found' });

    }
    return res.status(200).json(product);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while fetching the product";
    return res.status(400).json({ error: errorMessage });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const filters = productFiltersValidator.parse({
      ...req.query,
      categoryId: req.query.categoryId
        ? parseInt(req.query.categoryId as string)
        : undefined,
      subCategoryId: req.query.subCategoryId
        ? parseInt(req.query.subCategoryId as string)
        : undefined,
      minPrice: req.query.minPrice
        ? parseFloat(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });

    const { products, total } = await productService.getProducts(filters);
    return res.status(200).json({
      products,
      total,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(total / (filters.limit || 10)),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while fetching the products";
    return res.status(400).json({ error: errorMessage });
  }
};
