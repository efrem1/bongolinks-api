import {Resource} from './Resource';

export interface PLATFORM_RESOURCE_SHAPE {
    id: number;
    name: string;
    logo: string;
    color: string;
}

export class PlatformResource extends Resource<any> {
    protected toArray(platform: any): PLATFORM_RESOURCE_SHAPE {
        return {
            id: platform.id,
            name: platform.name,
            logo: platform.logo,
            color: platform.color,
        };
    }
}
