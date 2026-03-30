import express from 'express';
import {AuthController} from "../Controllers/AuthController";
import {authorize} from "../middlewares/authorize";
import {UserController} from "../Controllers/UserController";
import {PlatformController} from "../Controllers/PlatformController";
import {UserCategoryController} from "../Controllers/UserCategoryController";
import {LinkController} from "../Controllers/LinkController";

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/email-verification', AuthController.verifyEmail);

// Public Link API for the profile page
router.get('/profile/:username', LinkController.getPublicProfile);

/**
 * Authorized Routes
 */
router.use(authorize);

router.get('/me', UserController.me);
router.post('/check-username', AuthController.liveCheckUsername);
router.post('/update-username', AuthController.updateUsername);
router.post('/update-bio', UserController.updateBio);

router.route('/platform')
    .get(PlatformController.index);
router.route('/user-categories')
    .get(UserCategoryController.index);

// Link CRUD
router.get('/links', LinkController.index);
router.post('/links', LinkController.store);
router.put('/links/:id', LinkController.update);
router.delete('/links/:id', LinkController.destroy);


export default router;
