import {Request, Response} from 'express';
import db from '../models';
import {ApiResponse} from '../app/ApiResponse';

export class ProductController {
    /**
     * List all products for a specific user (Public)
     */
    static async listPublic(req: Request, res: Response) {
        const {username} = req.params;
        try {
            const user = await db.User.findOne({ where: { username } });
            if (!user) return ApiResponse.error(res, 'User not found');

            const products = await db.DigitalProduct.findAll({
                where: { UserId: user.id }
            });
            return ApiResponse.ok(res, products);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * List products for the authenticated user (Private)
     */
    static async listPrivate(req: any, res: Response) {
        try {
            const products = await db.DigitalProduct.findAll({
                where: { UserId: req.user.id }
            });
            return ApiResponse.ok(res, products);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Create a new product
     */
    static async store(req: any, res: Response) {
        const {name, description, price, fileUrl} = req.body;
        try {
            const product = await db.DigitalProduct.create({
                name,
                description,
                price,
                fileUrl,
                UserId: req.user.id
            });
            return ApiResponse.ok(res, product);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Update a product
     */
    static async update(req: any, res: Response) {
        const {id} = req.params;
        const {name, description, price, fileUrl} = req.body;
        try {
            const product = await db.DigitalProduct.findByPk(id);
            if (!product || product.UserId !== req.user.id) {
                return ApiResponse.error(res, 'Product not found or unauthorized');
            }

            await product.update({name, description, price, fileUrl});
            return ApiResponse.ok(res, product);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Delete a product
     */
    static async destroy(req: any, res: Response) {
        const {id} = req.params;
        try {
            const product = await db.DigitalProduct.findByPk(id);
            if (!product || product.UserId !== req.user.id) {
                return ApiResponse.error(res, 'Product not found or unauthorized');
            }

            await product.destroy();
            return ApiResponse.ok(res, {message: 'Product deleted successfully'});
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
