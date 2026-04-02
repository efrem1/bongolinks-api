import {Response} from 'express';
import db from '../models';
import {ApiResponse} from '../app/ApiResponse';

export class SubscriptionController {
    /**
     * Upgrade/Change user plan
     */
    static async subscribe(req: any, res: Response) {
        const { planId, paymentData } = req.body;
        try {
            const plan = await db.Plan.findByPk(planId);
            if (!plan) return ApiResponse.error(res, 'Plan not found');

            // 1. Validate paymentData (In TEST mode we accept simulated tokens)
            // For production, we would use a library like 'google-pay-api-verify'
            if (!paymentData) return ApiResponse.error(res, 'Payment data required');
            
            const userId = req.user.id;
            
            // 2. Set all other active subscriptions to inactive
            await db.Subscription.update({ status: 'inactive' }, {
                where: { UserId: userId, status: 'active' }
            });

            // 3. Create or update subscription
            const subscription = await db.Subscription.create({
                UserId: userId,
                PlanId: planId,
                status: 'active',
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                paymentIntentId: paymentData.paymentMethodData?.info?.cardDetails || 'simulated_card'
            });

            return ApiResponse.ok(res, { 
                message: `Successfully upgraded to ${plan.name}!`,
                subscription 
            });
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Cancel subscription
     */
    static async cancel(req: any, res: Response) {
        try {
            await db.Subscription.update({ status: 'cancelled' }, {
                where: { UserId: req.user.id, status: 'active' }
            });
            return ApiResponse.ok(res, { message: 'Subscription cancelled' });
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
