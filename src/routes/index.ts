import express from 'express';
import {AuthController} from "../Controllers/AuthController";
import {authorize} from "../middlewares/authorize";
import {UserController} from "../Controllers/UserController";

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/email-verification',AuthController.verifyEmail);

/**
 * Authorized Routes
 */
router.use(authorize);

router.get('/me',UserController.me);

export default router;
