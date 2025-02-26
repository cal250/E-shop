import { Router } from 'express';
import { create, update, getById, deleteSubCategory, findMany } from '../controllers/subCategory.controller';

const router = Router();

// Create a new subcategory
router.post('/', create);

// Update an existing subcategory
router.put('/:id', update);

// Get subcategory by ID
router.get('/:id', getById);

// Delete a subcategory
router.delete('/:id', deleteSubCategory);

// Get filtered and paginated subcategories
router.get('/', findMany);

export default router;