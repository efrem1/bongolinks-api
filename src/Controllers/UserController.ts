import {Request, Response} from 'express';
import {USER_RESOURCE_SHAPE} from "../resources/UserResource";
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
    public static me(req: AUTH_REQUEST, res: Response) {
        const user = req.user;
        return ApiResponse.ok(res, user);
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
        _user.save();
        return ApiResponse.ok(res, {message: 'Bio updated successfully.'});
    }
}