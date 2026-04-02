import {Response} from 'express';
import db from '../models';
import {ApiResponse} from '../app/ApiResponse';
import {Op, fn, col, literal} from 'sequelize';

export class AnalyticsController {
    /**
     * Get click trends for the last 30 days
     */
    static async getClickTrends(req: any, res: Response) {
        const userId = req.user.id;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        try {
            const trends = await db.LinkClick.findAll({
                where: {
                    UserId: userId,
                    timestamp: { [Op.gte]: thirtyDaysAgo }
                },
                attributes: [
                    [fn('DATE', col('timestamp')), 'date'],
                    [fn('COUNT', col('id')), 'count']
                ],
                group: [fn('DATE', col('timestamp'))],
                order: [[fn('DATE', col('timestamp')), 'ASC']]
            });

            return ApiResponse.ok(res, trends);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Get top traffic sources (referrers)
     */
    static async getTopReferrers(req: any, res: Response) {
        const userId = req.user.id;
        try {
            const referrers = await db.LinkClick.findAll({
                where: { UserId: userId },
                attributes: [
                    'referrer',
                    [fn('COUNT', col('id')), 'count']
                ],
                group: ['referrer'],
                order: [[literal('count'), 'DESC']],
                limit: 10
            });
            return ApiResponse.ok(res, referrers);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Get top performing links
     */
     static async getTopLinks(req: any, res: Response) {
        const userId = req.user.id;
        try {
            const links = await db.Link.findAll({
                where: { UserId: userId },
                order: [['clickCount', 'DESC']],
                limit: 5
            });
            return ApiResponse.ok(res, links);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
