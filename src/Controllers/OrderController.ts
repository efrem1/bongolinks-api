import {Response} from 'express';
import db from '../models';
import {ApiResponse} from '../app/ApiResponse';

export class OrderController {
    /**
     * Create a new order for a digital product
     */
    static async createOrder(req: any, res: Response) {
        const { productId, paymentData } = req.body;
        try {
            const product = await db.DigitalProduct.findByPk(productId);
            if (!product) return ApiResponse.error(res, 'Product not found');

            // 1. In a real app, verify 'paymentData' with Google Pay
            // For now, we simulate success
            const userId = req.user.id;

            const order = await db.Order.create({
                UserId: userId,
                DigitalProductId: productId,
                status: 'completed',
                paymentIntentId: paymentData?.id || 'simulated_' + Date.now()
            });

            return ApiResponse.ok(res, { 
                message: 'Order successful!', 
                order,
                downloadUrl: product.fileUrl 
            });
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * List user purchase history
     */
    static async listMyOrders(req: any, res: Response) {
        try {
            const orders = await db.Order.findAll({
                where: { UserId: req.user.id },
                include: [{ model: db.DigitalProduct }]
            });
            return ApiResponse.ok(res, orders);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
