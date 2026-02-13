import express from 'express';
import { createOrder, getOrderById, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();
// sushil
router.route('/').post(createOrder);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(updateOrderStatus);

export default router;
