import { Request, Response } from 'express';
import { ProductAttributeService } from '../services/productAttribute.service';
import { 

createProductAttributeSchema, 
updateProductAttributeSchema, 
deleteProductAttributeSchema,
getProductAttributeSchema,
productAttributeFiltersSchema
} from '../validators/productAttribute.validator';
import { z } from 'zod';

const service = new ProductAttributeService();



export async function create (req: Request, res: Response){
    try {
        const validatedData = createProductAttributeSchema.parse(req.body);
        const result = await service.create(validatedData);
        return res.status(201).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(400).json({ error: errorMessage });
    }
}

export async function bulkCreate  (req: Request, res: Response)  {
    try {
        const validatedData = z.array(createProductAttributeSchema).parse(req.body);
        const result = await service.bulkCreate(validatedData);
        return res.status(201).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(400).json({ error: errorMessage });
    }
}

export  async function update (req: Request, res: Response) {
    try {
        const { id } = updateProductAttributeSchema.parse({
            ...req.body,
            id: parseInt(req.params.id)
        });
        const result = await service.update(id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(400).json({ error: errorMessage });
    }
}

export async function deleteProductAttribute  (req: Request, res: Response) {
    try {
        const { id } = deleteProductAttributeSchema.parse({
            id: parseInt(req.params.id)
        });
        const result = await service.delete(id);
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(400).json({ error: errorMessage });
    }
}

export async function getById  (req: Request, res: Response)  {
    try {
        const { id } = getProductAttributeSchema.parse({
            id: parseInt(req.params.id)
        });
        const result = await service.findById(id);
        if (!result) {
            return res.status(404).json({ message: 'Product attribute not found' });
        }
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(400).json({ error: errorMessage});
    }
}

export async function getAll (req: Request, res: Response)  {
    try {
        const filters = productAttributeFiltersSchema.parse(req.query);
        const result = await service.findAll(filters);
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(400).json({ error: errorMessage });
    }
}
