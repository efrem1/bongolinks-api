import {Resource} from './Resource';
import {USER_RESOURCE_SHAPE, UserResource} from "./UserResource";

export interface SUPPORT_TICKET_REPLY_RESOURCE_SHAPE {
    id: number;
    SupportTicketId: number;
    UserId: number;
    message: string;
    createdAt: string;
    user?: USER_RESOURCE_SHAPE;
}

export class SupportTicketReplyResource extends Resource<any> {
    protected toArray(reply: any): SUPPORT_TICKET_REPLY_RESOURCE_SHAPE {
        return {
            id: reply.id,
            SupportTicketId: reply.SupportTicketId,
            UserId: reply.UserId,
            message: reply.message,
            createdAt: reply.createdAt,
            user: reply.User ? UserResource.item(reply.User) : undefined
        };
    }
}
