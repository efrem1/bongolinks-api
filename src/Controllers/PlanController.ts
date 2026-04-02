import {Request, Response} from 'express';
import db from '../models';

export class PlanController {
    /**
     * List all plans with their associated features
     */
    static async listPlans(req: Request, res: Response) {
        try {
            const plans = await db.Plan.findAll({
                include: [{
                    model: db.Feature,
                    through: { attributes: [] }
                }]
            });
            return res.json({ status: 'success', data: plans });
        } catch (error: any) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * List all available system features
     */
    static async listFeatures(req: Request, res: Response) {
        try {
            const features = await db.Feature.findAll();
            return res.json({ status: 'success', data: features });
        } catch (error: any) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * Update features for a specific plan
     */
    static async updatePlanFeatures(req: Request, res: Response) {
        const { planId } = req.params;
        const { featureIds } = req.body; // Array of feature IDs

        try {
            const plan = await db.Plan.findByPk(planId);
            if (!plan) return res.status(404).json({ status: 'error', message: 'Plan not found' });

            // Clear existing and set new
            await db.PlanFeature.destroy({ where: { PlanId: planId } });
            
            const mappings = featureIds.map((fId: number) => ({
                PlanId: planId,
                FeatureId: fId
            }));

            await db.PlanFeature.bulkCreate(mappings);

            const updatedPlan = await db.Plan.findByPk(planId, {
                include: [{ model: db.Feature, through: { attributes: [] } }]
            });

            return res.json({ status: 'success', data: updatedPlan, message: 'Plan features updated successfully' });
        } catch (error: any) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
