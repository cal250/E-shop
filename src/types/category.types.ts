
export interface Category {
    id: number;
    name: string;
    description?: string | null;
    createdAt: Date;
    deletedAt?: Date | null;
}


export interface CreateCategoryDto {
    name: string;
    description?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
}

export interface CategoryResponse {
    success: boolean;
    data: Category;
    message?: string;
}

export interface CategoriesResponse {
    success: boolean;
    data: Category[];
    total: number;
    message?: string;
}

export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'createdAt';
    order?: 'asc' | 'desc';
}