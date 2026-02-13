import express from 'express';
import { getMenu, getMenuItemById } from '../controllers/menuController.js';

const router = express.Router();

router.route('/').get(getMenu);
router.route('/:id').get(getMenuItemById);

export default router;
