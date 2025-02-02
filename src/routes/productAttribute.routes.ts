import { Router } from 'express';
import {

create,
bulkCreate,
update,
deleteProductAttribute,
getById,
getAll
} from '../controllers/productAttributes.controller';

const router = Router();

// Create routes
router.post('/', create);
router.post('/bulk', bulkCreate);

// Read routes
router.get('/', getAll);
router.get('/:id', getById);

// Update route
router.put('/:id', update);

// Delete route
router.delete('/:id', deleteProductAttribute);

export default router;