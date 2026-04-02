import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authorize';
import db from '../models';

export const hasFeature = (featureKey: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const user = await db.User.findByPk(userId, {
                include: [{
                    model: db.Subscription,
                    as: 'Subscriptions',
                    where: { status: 'active' },
                    required: false,
                    include: [{
                        model: db.Plan,
                        include: [{
                            model: db.Feature,
                            where: { key: featureKey },
                            required: true
                        }]
                    }]
                }]
            });

            const hasAccess = user?.Subscriptions?.length > 0;
            
            if (hasAccess) {
                next();
            } else {
                res.status(403).json({ 
                    status: 'error', 
                    message: `This feature (${featureKey}) requires a premium subscription.` 
                });
            }
        } catch (error: any) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
};
