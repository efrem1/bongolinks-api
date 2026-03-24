import {AUTH_REQUEST} from "./UserController";
import {Response} from "express";
import db from '../models';
import {ApiResponse} from "../app/ApiResponse";

export class PlatformController {

    public static async index(req: AUTH_REQUEST, res: Response) {
        const platform = await db.Platform.findAll();
        return ApiResponse.ok(res, platform);
    }

    public static async one(req: AUTH_REQUEST, res: Response) {

    }
}