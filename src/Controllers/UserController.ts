import {Request, Response} from 'express';
import {USER_RESOURCE_SHAPE, UserResource} from "../resources/UserResource";
import {ApiResponse} from "../app/ApiResponse";
import db from "../models";

export interface AUTH_REQUEST extends Request {
    user?: USER_RESOURCE_SHAPE;
}

export class UserController {

    /**
     *
     * @param req
     * @param res
     */
    public static async me(req: AUTH_REQUEST, res: Response) {
        const user = req.user;
        if (!user) {
            return ApiResponse.unauthorized(res);
        }

        const _user = await db.User.findOne({
            where: {id: user.id}, 
            include: [
                db.UserCategory,
                {
                    model: db.Subscription,
                    as: 'Subscriptions', // Explicitly use the relation name
                    required: false,
                    include: [{
                        model: db.Plan,
                        include: [db.Feature]
                    }]
                }
            ]
        });

        if (!_user) {
            return ApiResponse.unauthorized(res);
        }

        return ApiResponse.ok(res, UserResource.item<any, UserResource>(_user));
    }

    public static async updateBio(req: AUTH_REQUEST, res: Response) {
        const {bio} = req.body;
        const user = req.user;
        if (!user) {
            return ApiResponse.unauthorized(res);
        }

        const _user = await db.User.findOne({where: {id: user.id}});
        if (!_user) {
            return ApiResponse.unauthorized(res);
        }

        _user.bio = bio;
        await _user.save();
        return ApiResponse.ok(res, {message: 'Bio updated successfully.'});
    }

    public static async completeOnboarding(req: AUTH_REQUEST, res: Response) {
        const {username, category, platforms, bio, theme} = req.body;
        const user = req.user;
        if (!user) {
            return ApiResponse.unauthorized(res);
        }

        const _user = await db.User.findOne({where: {id: user.id}});
        if (!_user) {
            return ApiResponse.unauthorized(res);
        }

        try {
            _user.username = username;
            _user.bio = bio;
            _user.UserCategoryId = category;
            _user.onBoarded = true;
            if (theme) _user.theme = theme;

            await _user.save();

            if (platforms && Array.isArray(platforms)) {
                await _user.setPlatforms(platforms);
                
                // Get existing link platform IDs
                const existingLinks = await db.Link.findAll({
                    where: { UserId: user.id }
                });
                const existingPlatformIds = existingLinks.map((l: any) => l.PlatformId);

                // Create draft links only for new platforms
                const selectedPlatforms = await db.Platform.findAll({
                    where: { id: platforms }
                });

                const newPlatforms = selectedPlatforms.filter((p: any) => !existingPlatformIds.includes(p.id));

                const linkData = newPlatforms.map((p: any, index: number) => ({
                    title: p.name,
                    url: '#',
                    isActive: false, // Start inactive so user has to fill in URL
                    order: existingLinks.length + index,
                    UserId: user.id,
                    PlatformId: p.id
                }));

                if (linkData.length > 0) {
                    await db.Link.bulkCreate(linkData);
                }
            }

            return ApiResponse.ok(res, {message: 'Onboarding completed successfully.'});
        } catch (error: any) {
            console.error('Onboarding Backend Error:', error);
            return ApiResponse.error(res, error.message || 'Failed to complete onboarding');
        }
    }

    public static async updateDesign(req: AUTH_REQUEST, res: Response) {
        const { theme, bgColor, accentColor, avatar, coverImage } = req.body;
        const user = req.user;
        if (!user) {
            return ApiResponse.unauthorized(res);
        }

        const _user = await db.User.findOne({ where: { id: user.id } });
        if (!_user) {
            return ApiResponse.unauthorized(res);
        }

        try {
            if (theme) _user.theme = theme;
            if (bgColor) _user.bgColor = bgColor;
            if (accentColor) _user.accentColor = accentColor;
            if (avatar) _user.avatar = avatar;
            if (coverImage) _user.coverImage = coverImage;

            await _user.save();
            return ApiResponse.ok(res, { message: 'Design updated successfully.' });
        } catch (error: any) {
            return ApiResponse.error(res, error.message || 'Failed to update design');
        }
    }
}