import {Resource} from './Resource';
import {USER_RESOURCE_SHAPE, UserResource} from "./UserResource";
import {SupportTicketReplyResource} from "./SupportTicketReplyResource";

export interface SUPPORT_TICKET_RESOURCE_SHAPE {
    id: number;
    UserId: number;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    user?: USER_RESOURCE_SHAPE;
    replies?: any[];
}

export class SupportTicketResource extends Resource<any> {
    protected toArray(ticket: any): SUPPORT_TICKET_RESOURCE_SHAPE {
        return {
            id: ticket.id,
            UserId: ticket.UserId,
            subject: ticket.subject,
            status: ticket.status,
            priority: ticket.priority,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            user: ticket.User ? UserResource.item<any, UserResource>(ticket.User) : undefined,
            replies: ticket.SupportTicketReplies ? SupportTicketReplyResource.collection<any, SupportTicketReplyResource>(ticket.SupportTicketReplies) : []
        };
    }
}
