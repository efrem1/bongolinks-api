import {Response} from 'express';
import db from '../models';
import {ApiResponse} from '../app/ApiResponse';

export class SocialController {
    /**
     * List connected social accounts
     */
    static async listConnected(req: any, res: Response) {
        try {
            const accounts = await db.SocialAccount.findAll({
                where: { UserId: req.user.id },
                attributes: ['id', 'provider', 'expiresAt', 'createdAt']
            });
            const settings = await db.User.findByPk(req.user.id, {
                attributes: ['autoSyncSocial']
            });
            return ApiResponse.ok(res, { accounts, settings });
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Update social automation settings
     */
    static async updateSettings(req: any, res: Response) {
        const { autoSyncSocial } = req.body;
        try {
            const user = await db.User.findByPk(req.user.id);
            if (!user) return ApiResponse.error(res, 'User not found');

            user.autoSyncSocial = autoSyncSocial;
            await user.save();

            return ApiResponse.ok(res, { message: 'Settings updated' });
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    /**
     * Simulate a "Sync Now" action (Pro Feature)
     * In a real app, this would fetch from Meta API.
     */
    static async syncNow(req: any, res: Response) {
        try {
            const userId = req.user.id;
            
            // 1. Simulate fetching latest post
            const postTitle = `Latest Instagram Post (${new Date().toLocaleDateString()})`;
            const postUrl = `https://instagram.com/p/simulation_${Date.now()}`;

            // 2. Check if already exists (Simple simulation)
            const [link, created] = await db.Link.findOrCreate({
                where: { 
                    UserId: userId,
                    title: postTitle
                },
                defaults: {
                    url: postUrl,
                    isActive: true,
                    order: 0,
                    isSocial: false,
                    PlatformId: 1 // Assuming Instagram ID is 1
                }
            });

            if (created) {
                return ApiResponse.ok(res, { message: 'Successfully synced latest post!', link });
            } else {
                return ApiResponse.ok(res, { message: 'Profile is already up to date.' });
            }
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
