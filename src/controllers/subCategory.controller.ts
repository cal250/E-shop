import { Request, Response } from 'express';
import { SubCategoryService } from '../services/subCategory.service';
import { 
CreateSubCategoryInput, 
UpdateSubCategoryInput, 
SubCategoryFilters, 
SubCategoryPaginationParams 
} from '../types/subCategory.types';

const service = new SubCategoryService();



// Create a new subcategory
export  async function create(req: Request, res: Response) {
    try {
        const input: CreateSubCategoryInput = req.body;
        const subcategory = await service.create(input);
        return res.status(201).json(subcategory);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Update an existing subcategory
export async function update(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const input: UpdateSubCategoryInput = { ...req.body, id };
        const subcategory = await service.update(input);
        return res.status(200).json(subcategory);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Get subcategory by ID
export async function getById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const subcategory = await service.getById(id);
        
        if (!subcategory) {
            return res.status(404).json({ error: 'SubCategory not found' });
        }

        return res.status(200).json(subcategory);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete (soft-delete) a subcategory
export async function deleteSubCategory(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const subcategory = await service.delete(id);
        return res.status(200).json(subcategory);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Get filtered and paginated subcategories
export async function findMany(req: Request, res: Response) {
    try {
        const filters: SubCategoryFilters = {
            id: req.query.id ? Number(req.query.id) : undefined,
            parentId: req.query.parentId ? Number(req.query.parentId) : undefined,
            name: req.query.name as string | undefined,
        } ;

        const pagination: SubCategoryPaginationParams = {
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            sortBy: req.query.sortBy as keyof typeof filters | undefined,
            order: req.query.order as 'asc' | 'desc' | undefined
        };

        const result = await service.findMany(filters, pagination);
        return res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}
