import express from 'express';
import {AuthController} from "../Controllers/AuthController";
import {authorize} from "../middlewares/authorize";
import {UserController} from "../Controllers/UserController";
import {PlatformController} from "../Controllers/PlatformController";
import {UserCategoryController} from "../Controllers/UserCategoryController";
import {LinkController} from "../Controllers/LinkController";
import {SupportTicketController} from "../Controllers/SupportTicketController";
import {PlanController} from "../Controllers/PlanController";
import {AnalyticsController} from "../Controllers/AnalyticsController";
import {ProductController} from "../Controllers/ProductController";
import {SocialController} from "../Controllers/SocialController";
import {SubscriptionController} from "../Controllers/SubscriptionController";
import {OrderController} from "../Controllers/OrderController";
import {isAdmin} from "../middlewares/isAdmin";
import {hasFeature} from "../middlewares/hasFeature";

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/email-verification', AuthController.verifyEmail);
router.post('/auth/google', AuthController.googleAuth);
router.post('/auth/whatsapp/send', AuthController.whatsappSendOtp);
router.post('/auth/whatsapp/verify', AuthController.whatsappVerifyOtp);

// Public Link API for the profile page
router.get('/profile/:username', LinkController.getPublicProfile);
router.post('/profile/:username/view', LinkController.incrementView);
router.post('/links/:id/click', LinkController.incrementClick);

// Public Storefront (No Auth Required)
router.get('/products/:username', ProductController.listPublic);

/**
 * Authorized Routes
 */
router.use(authorize);

router.get('/me', UserController.me);
router.post('/check-username', AuthController.liveCheckUsername);
router.post('/update-username', AuthController.updateUsername);
router.post('/complete-onboarding', UserController.completeOnboarding);
router.post('/update-bio', UserController.updateBio);
router.post('/update-design', UserController.updateDesign);

router.route('/platform')
    .get(PlatformController.index);
router.route('/user-categories')
    .get(UserCategoryController.index);

// Link CRUD
router.get('/links', LinkController.index);
router.post('/links', LinkController.store);
router.put('/links/:id', LinkController.update);
router.delete('/links/:id', LinkController.destroy);

// Support Tickets
router.get('/tickets', SupportTicketController.index);
router.post('/tickets', SupportTicketController.store);
router.get('/tickets/:id', SupportTicketController.show);
router.put('/tickets/:id/status', SupportTicketController.updateStatus);
router.post('/tickets/:id/replies', SupportTicketController.addReply);

// Admin Plans & Features
router.get('/admin/plans', isAdmin, PlanController.listPlans);
router.get('/admin/features', isAdmin, PlanController.listFeatures);
router.post('/admin/plans/:planId/features', isAdmin, PlanController.updatePlanFeatures);

// Analytics (Advanced features gated by plan)
router.get('/analytics/trends', hasFeature('ADVANCED_ANALYTICS'), AnalyticsController.getClickTrends);
router.get('/analytics/referrers', hasFeature('ADVANCED_ANALYTICS'), AnalyticsController.getTopReferrers);
router.get('/analytics/top-links', AnalyticsController.getTopLinks);

// Digital Products Management
router.get('/my-products', ProductController.listPrivate);
router.post('/products', hasFeature('DIGITAL_STORE'), ProductController.store);
router.put('/products/:id', hasFeature('DIGITAL_STORE'), ProductController.update);
router.delete('/products/:id', hasFeature('DIGITAL_STORE'), ProductController.destroy);

// Social Media Automation (Gated by SOCIAL_AUTOMATION)
router.get('/social/connected', hasFeature('SOCIAL_AUTOMATION'), SocialController.listConnected);
router.post('/social/sync', hasFeature('SOCIAL_AUTOMATION'), SocialController.syncNow);
router.post('/social/settings', hasFeature('SOCIAL_AUTOMATION'), SocialController.updateSettings);

// Subscriptions & Payments
router.post('/subscribe', SubscriptionController.subscribe);
router.post('/subscribe/cancel', SubscriptionController.cancel);

// Digital Product Orders
router.get('/my-orders', OrderController.listMyOrders);
router.post('/orders', OrderController.createOrder);


export default router;
