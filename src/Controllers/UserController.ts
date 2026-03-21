import {Request, Response} from 'express';
import {USER_RESOURCE_SHAPE} from "../resources/UserResource";
import {ApiResponse} from "../app/ApiResponse";

interface AUTH_REQUEST extends Request {
    user?:USER_RESOURCE_SHAPE;
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
}