import {createClient} from 'redis';

export class UsernameFilter {
    private client;
    private readonly FILTER_NAME = 'usernames_bloom';

    constructor() {
        this.client = createClient({
            url: 'redis://localhost:6379'
        });
        this.client.connect().catch(console.error);
    }


    async initFilter() {
        try {
            await this.client.bf.reserve(this.FILTER_NAME, 0.01, 10000);
        } catch (e: any) {
            if (e.message.includes('item exists')) return;
            console.error(e);
        }
    }

    /**
     * Check if a username MIGHT be taken
     */
    async isTaken(username: string): Promise<boolean> {
        const normalized = username.toLowerCase();
        return await this.client.bf.exists(this.FILTER_NAME, normalized);
    }

    /**
     * Add a username to the filter after successful registration
     */
    async add(username: string) {
        const normalized = username.toLowerCase();
        await this.client.bf.add(this.FILTER_NAME, normalized);
    }
}

export const usernameFilter = new UsernameFilter();