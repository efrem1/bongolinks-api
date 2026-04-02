import {Resource} from './Resource';
import {USER_CATEGORY_RESOURCE_SHAPE, UserCategoryResource} from "./UserCategoryResource";

export interface USER_RESOURCE_SHAPE {
    id: number;
    email: string;
    is_onboarded: boolean;
    full_name: string;
    username: string;
    bio: string;
    category: USER_CATEGORY_RESOURCE_SHAPE;
    theme: string;
    bgColor: string;
    accentColor: string;
    avatar: string | null;
    coverImage: string | null;
    fontFamily: string;
    buttonStyle: string;
    buttonShadow: string;
    role: string;
    plan: string;
    features: string[];
    is_verified: boolean;
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
            theme: user.theme,
            bgColor: user.bgColor,
            accentColor: user.accentColor,
            avatar: user.avatar,
            coverImage: user.coverImage,
            fontFamily: user.fontFamily,
            buttonStyle: user.buttonStyle,
            buttonShadow: user.buttonShadow,
            role: user.role,
            plan: user.Subscriptions?.[0]?.Plan?.name || 'Free',
            features: user.Subscriptions?.[0]?.Plan?.Features?.map((f: any) => f.key) || [],
            is_verified: !!user.isVerified,
        };
    }
}