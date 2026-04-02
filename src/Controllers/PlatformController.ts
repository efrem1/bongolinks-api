import {AUTH_REQUEST} from "./UserController";
import {Response} from "express";
import db from '../models';
import {ApiResponse} from "../app/ApiResponse";
import {PlatformResource} from "../resources/PlatformResource";

export class PlatformController {

    public static async index(req: AUTH_REQUEST, res: Response) {
        try {
            const platforms = await db.Platform.findAll();
            return ApiResponse.ok(res, PlatformResource.collection(platforms));
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async one(req: AUTH_REQUEST, res: Response) {

    }
}