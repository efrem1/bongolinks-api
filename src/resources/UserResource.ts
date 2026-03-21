import {Resource} from './Resource';

export interface USER_RESOURCE_SHAPE {
    email: string;
    is_onboarded: boolean;
    full_name: string;
    username: string;
}

export class UserResource extends Resource<any> {
    protected toArray(user: any): USER_RESOURCE_SHAPE {
        return {
            email: user.email,
            username: user.username,
            is_onboarded: !!user.onBoarded,
            full_name: `${user.firstName} ${user.lastName}`.trim(),
        };
    }
}