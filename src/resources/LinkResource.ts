import {Resource} from './Resource';

export interface LINK_RESOURCE_SHAPE {
    id: number;
    title: string;
    url: string;
    isActive: boolean;
    order: number;
    clickCount: number;
    isSocial: boolean;
    PlatformId: number;
    Platform?: {
        name: string;
        logo: string;
        color: string;
    };
}

export class LinkResource extends Resource<any> {
    protected toArray(link: any): LINK_RESOURCE_SHAPE {
        return {
            id: link.id,
            title: link.title,
            url: link.url,
            isActive: link.isActive,
            order: link.order,
            clickCount: link.clickCount,
            isSocial: link.isSocial,
            PlatformId: link.PlatformId,
            Platform: link.Platform ? {
                name: link.Platform.name,
                logo: link.Platform.logo,
                color: link.Platform.color,
            } : undefined,
        };
    }
}
