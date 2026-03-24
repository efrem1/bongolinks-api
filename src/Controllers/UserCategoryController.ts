import {AUTH_REQUEST} from "./UserController";
import {Response} from "express";
import db from '../models';
import {ApiResponse} from "../app/ApiResponse";

export class UserCategoryController {

    public static async index(req: AUTH_REQUEST, res: Response) {
        const categories = await db.UserCategory.findAll();
        return ApiResponse.ok(res, categories);
    }

    public static async one(req: AUTH_REQUEST, res: Response) {

    }
}