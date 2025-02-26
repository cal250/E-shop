// Category related types for requests and responses

// Base category type matching Prisma schema
export interface Category {
    id: number;
    name: string;
    description?: string | null;
    createdAt: Date;
    deletedAt?: Date | null;
}

// Type for creating a new category
export interface CreateCategoryDto {
    name: string;
    description?: string;
}

// Type for updating a category
export interface UpdateCategoryDto {
    name?: string;
    description?: string;
}

// Type for category response
export interface CategoryResponse {
    success: boolean;
    data: Category;
    message?: string;
}

// Type for multiple categories response
export interface CategoriesResponse {
    success: boolean;
    data: Category[];
    total: number;
    message?: string;
}

// Query parameters for fetching categories
export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'createdAt';
    order?: 'asc' | 'desc';
}