import { Category } from './category.types';

// Base SubCategory properties
export interface SubCategoryBase {
    name: string;
    description?: string | null;
}

// For creating a new SubCategory
export interface CreateSubCategoryInput extends SubCategoryBase {
    parentId: number;
}

// For updating an existing SubCategory
export interface UpdateSubCategoryInput extends Partial<SubCategoryBase> {
    id: number;
    parentId?: number;
}

// SubCategory response with all fields
export interface SubCategory extends SubCategoryBase {
    id: number;
    parentId: number;
    createdAt: Date;
    deletedAt: Date | null;
    category?: Category;
}

// For filtering/querying SubCategories
export interface SubCategoryFilters {
    id?: number;
    parentId?: number;
    name?: string;
}

// For pagination
export interface SubCategoryPaginationParams {
    page?: number;
    limit?: number;
    sortBy?: keyof SubCategory;
    order?: 'asc' | 'desc';
}

// Response for paginated queries
export interface PaginatedSubCategoryResponse {
    items: SubCategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}