import { SubCategory } from "./subCategory.types";
import { ProductSku } from "./productSku.types";
import { Review } from "./review.types";

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  summary?: string | null;
  cover?: string | null;
  categoryId: number;
  createdAt: Date;
  deletedAt?: Date | null;
  subCategories?: SubCategory[];
  productSkus?: ProductSku[];
  reviews?: Review[];
}

export interface CreateProductInput {
  name: string;
  description?: string;
  summary?: string;
  cover?: string;
  categoryId: number;
  subCategories?: number[]; // Array of subcategory IDs
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  description?: string;
  summary?: string;
  cover?: string;
  categoryId?: number;
  subCategories?: number[]; // Array of subcategory IDs
}

export interface ProductFilters {
  categoryId?: number;
  subCategoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string | null;
  summary?: string | null;
  cover?: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
  } | null;
  subCategories: Array<{
    id: number;
    name: string;
  }> | null;
  productSkus: Array<{
    id: number;
    sku: string;
    price: string;
    quantity: number;
    sizeAttribute: {
      value: string;
    } | null;
    colorAttribute: {
      value: string;
    } | null;
  }> | null;
  reviews?: Array<{
    id: number;
    rating: number;
    comment?: string | null;
    userId: number;
  }> | null;
  averageRating?: number | null;
}

export interface CreateFullProductDTO {
  product: {
    name: string;
    description?: string;
    summary?: string;
    cover?: string;
    categoryId: number;
    subCategories?: number[];
  };
  variants: Array<{
    size: string;
    // color: string;
    price: string;
    quantity: number;
  }>;
}
