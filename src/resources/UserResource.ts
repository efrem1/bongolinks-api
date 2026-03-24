import {Resource} from './Resource';
import {USER_CATEGORY_RESOURCE_SHAPE, UserCategoryResource} from "./UserCategoryResource";

export interface USER_RESOURCE_SHAPE {
    id: number;
    email: string;
    is_onboarded: boolean;
    full_name: string;
    username: string;
    bio: string;
    category: USER_CATEGORY_RESOURCE_SHAPE
}

export class UserResource extends Resource<any> {
    protected toArray(user: any): USER_RESOURCE_SHAPE {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            is_onboarded: !!user.onBoarded,
            full_name: `${user.firstName} ${user.lastName}`.trim(),
            bio: user.bio,
            category: UserCategoryResource.item<any, UserCategoryResource>(user.category),
        };
    }
}