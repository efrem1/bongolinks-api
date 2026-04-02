import {Response} from 'express';
import db from '../models';
import {ApiResponse} from "../app/ApiResponse";
import {SupportTicketResource} from "../resources/SupportTicketResource";
import {SupportTicketReplyResource} from "../resources/SupportTicketReplyResource";
import {WhatsAppService} from "../services/WhatsAppService";

export class SupportTicketController {
    public static async index(req: any, res: Response) {
        try {
            const isAdmin = req.user.role === 'admin';
            const where = isAdmin ? {} : {UserId: req.user.id};
            
            const tickets = await db.SupportTicket.findAll({
                where,
                include: ['User', {
                    model: db.SupportTicketReply,
                    as: 'SupportTicketReplies',
                    include: ['User']
                }],
                order: [['createdAt', 'DESC']]
            });
            return ApiResponse.ok(res, SupportTicketResource.collection<any, SupportTicketResource>(tickets));
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async store(req: any, res: Response) {
        let transaction: any;
        try {
            const {subject, message, priority} = req.body;
            transaction = await db.sequelize.transaction();

            const ticket = await db.SupportTicket.create({
                UserId: req.user.id,
                subject,
                priority: priority || 'low',
                status: 'open'
            }, {transaction});

            await db.SupportTicketReply.create({
                SupportTicketId: ticket.id,
                UserId: req.user.id,
                message
            }, {transaction});

            await transaction.commit();

            // Fire and forget notification
            WhatsAppService.sendWhatsAppAlert(ticket);

            const ticketWithData = await db.SupportTicket.findByPk(ticket.id, {
                include: ['User', {
                    model: db.SupportTicketReply,
                    as: 'SupportTicketReplies',
                    include: ['User']
                }]
            });

            return ApiResponse.ok(res, SupportTicketResource.item<any, SupportTicketResource>(ticketWithData));
        } catch (error: any) {
            if (transaction) await transaction.rollback();
            return ApiResponse.error(res, error.message);
        }
    }

    public static async show(req: any, res: Response) {
        try {
            const {id} = req.params;
            const isAdmin = req.user.role === 'admin';
            const where = isAdmin ? {id} : {id, UserId: req.user.id};

            const ticket = await db.SupportTicket.findOne({
                where,
                include: ['User', {
                    model: db.SupportTicketReply,
                    as: 'SupportTicketReplies',
                    include: ['User']
                }]
            });

            if (!ticket) {
                return ApiResponse.error(res, 'Ticket not found');
            }

            return ApiResponse.ok(res, SupportTicketResource.item<any, SupportTicketResource>(ticket));
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async updateStatus(req: any, res: Response) {
        try {
            const {id} = req.params;
            const {status} = req.body;
            const isAdmin = req.user.role === 'admin';
            
            const ticket = await db.SupportTicket.findByPk(id);
            if (!ticket) return ApiResponse.error(res, 'Ticket not found');
            
            if (!isAdmin && ticket.UserId !== req.user.id) {
                return ApiResponse.error(res, 'Unauthorized');
            }
            
            if (!isAdmin && status !== 'closed') {
                return ApiResponse.error(res, 'Users can only close tickets');
            }

            ticket.status = status;
            await ticket.save();

            return ApiResponse.ok(res, {message: `Ticket marked as ${status}`});
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    public static async addReply(req: any, res: Response) {
        try {
            const {id} = req.params;
            const {message} = req.body;
            const isAdmin = req.user.role === 'admin';

            const ticket = await db.SupportTicket.findByPk(id);
            if (!ticket) return ApiResponse.error(res, 'Ticket not found');

            if (!isAdmin && ticket.UserId !== req.user.id) {
                return ApiResponse.error(res, 'Unauthorized');
            }

            const reply = await db.SupportTicketReply.create({
                SupportTicketId: ticket.id,
                UserId: req.user.id,
                message
            });

            // Auto transition status if admin replies
            if (isAdmin && ticket.status === 'open') {
                ticket.status = 'in-progress';
                await ticket.save();
            }

            const replyWithUser = await db.SupportTicketReply.findByPk(reply.id, {
                include: ['User']
            });

            return ApiResponse.ok(res, SupportTicketReplyResource.item<any, SupportTicketReplyResource>(replyWithUser));
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}
