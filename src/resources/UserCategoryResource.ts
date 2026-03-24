import {Resource} from './Resource';

export interface USER_CATEGORY_RESOURCE_SHAPE {
    id: number;
    title: string;
    icon: boolean;
    subtitle: string;
}

export class UserCategoryResource extends Resource<any> {
    protected toArray(category: any): USER_CATEGORY_RESOURCE_SHAPE {
        return {
            id: category.id,
            title: category.title,
            subtitle: category.subtitle,
            icon: category.icon,
        };
    }
}