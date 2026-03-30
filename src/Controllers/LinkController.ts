import { Request, Response } from 'express';
import db from '../models';

export class LinkController {
    static async index(req: any, res: Response) {
        try {
            const links = await db.Link.findAll({
                where: { UserId: req.user.id },
                order: [['order', 'ASC']]
            });
            res.json({ success: true, data: links });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async store(req: any, res: Response) {
        try {
            const { title, url, platformId } = req.body;
            const link = await db.Link.create({
                title,
                url,
                PlatformId: platformId,
                UserId: req.user.id,
                order: 0 // Default order
            });
            res.json({ success: true, data: link });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async update(req: any, res: Response) {
        try {
            const { id } = req.params;
            const { title, url, isActive, order } = req.body;
            await db.Link.update({ title, url, isActive, order }, { 
                where: { id, UserId: req.user.id } 
            });
            res.json({ success: true, message: 'Link updated successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async destroy(req: any, res: Response) {
        try {
            const { id } = req.params;
            await db.Link.destroy({ where: { id, UserId: req.user.id } });
            res.json({ success: true, message: 'Link deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getPublicProfile(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const user = await db.User.findOne({
                where: { username },
                include: [{
                    model: db.Link,
                    where: { isActive: true },
                    required: false,
                }]
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
