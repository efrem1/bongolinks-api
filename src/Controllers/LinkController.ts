import {Response} from 'express';
import db from '../models';
import {ApiResponse} from "../app/ApiResponse";
import {LinkResource} from "../resources/LinkResource";

export class LinkController {
    public static async index(req: any, res: Response) {
        try {
            const links = await db.Link.findAll({
                where: {UserId: req.user.id},
                include: ['Platform'],
                order: [['order', 'ASC']]
            });
            return ApiResponse.ok(res, LinkResource.collection(links));
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async store(req: any, res: Response) {
        try {
            const {title, url, PlatformId} = req.body;
            const link = await db.Link.create({
                title,
                url,
                PlatformId,
                UserId: req.user.id,
                order: 0
            });
            return ApiResponse.ok(res, LinkResource.item(link));
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async update(req: any, res: Response) {
        try {
            const {id} = req.params;
            const {title, url, isActive, order} = req.body;
            await db.Link.update({title, url, isActive, order}, {
                where: {id, UserId: req.user.id}
            });
            return ApiResponse.ok(res, {message: 'Link updated successfully'});
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async destroy(req: any, res: Response) {
        try {
            const {id} = req.params;
            await db.Link.destroy({where: {id, UserId: req.user.id}});
            return ApiResponse.ok(res, {message: 'Link deleted successfully'});
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async getPublicProfile(req: any, res: Response) {
        try {
            const {username} = req.params;

            const user = await db.User.findOne({
                where: {username: username},
                include: [{
                    model: db.Link,
                    as: 'Links',
                }]
            });
            return ApiResponse.ok(res, user);

            // const user = await db.User.findOne({
            //     where: { username },
            //     include: [{
            //         model: db.Link,
            //         as: 'Links',
            //         where: { isActive: true },
            //         required: false,
            //         include: ['Platform']
            //     }]
            // });

            if (!user) {
                return ApiResponse.error(res, 'User not found');
            }

            return ApiResponse.ok(res, user);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Increment click count for a specific link
     */
    public static async incrementClick(req: any, res: Response) {
        const {id} = req.params;
        try {
            const link = await db.Link.findByPk(id);
            if (!link) {
                return ApiResponse.error(res, 'Link not found');
            }
            link.clickCount += 1;
            await link.save();

            // Log granular click for Advanced Analytics
            try {
                await db.LinkClick.create({
                    LinkId: link.id,
                    UserId: link.UserId,
                    ip: req.ip,
                    userAgent: req.headers['user-agent'] || null,
                    referrer: req.headers['referer'] || req.headers['referrer'] || null,
                    timestamp: new Date()
                });
            } catch (e) {
                console.error("Failed to log LinkClick:", e);
            }

            return ApiResponse.ok(res, {clickCount: link.clickCount});
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Increment view count for a public profile
     */
    public static async incrementView(req: any, res: Response) {
        const {username} = req.params;
        try {
            const user = await db.User.findOne({where: {username}});
            if (!user) {
                return ApiResponse.error(res, 'User not found');
            }
            user.viewsCount += 1;
            await user.save();
            return ApiResponse.ok(res, {viewsCount: user.viewsCount});
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
