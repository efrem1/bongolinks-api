import {Response} from 'express';

interface JSON_RESPONSE {
    status: string;
    error: boolean;
    message?: string;
}

interface JSON_RESPONSE_DATA<T> extends JSON_RESPONSE {
    data?: T;
}

export class ApiResponse {

    /**
     *
     * @param res
     */
    public static unauthorized(res: Response): Response {
        const body: JSON_RESPONSE = {
            status: 'unauthorized',
            error: true,
        };
        return res.status(401).json(body);
    }

    /**
     *
     * @param res
     * @param data
     */
    public static ok<T>(res: Response, data: T): Response {
        const body: JSON_RESPONSE_DATA<T> = {
            status: 'success',
            error: false,
            data
        };
        return res.json(body);
    }

    /**
     *
     * @param res
     * @param message
     */
    public static error(res: Response, message: string): Response {
        const body: JSON_RESPONSE = {
            status: 'error',
            error: true,
            message,
        }
        return res.status(400).json(body);
    }
}