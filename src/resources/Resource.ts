export abstract class Resource<T> {
    /**
     *
     * @param data
     */
    public static item<T, R>(this: new () => R, data: T): any {
        if (!data) return null;
        const instance = new this() as any;
        return instance.toArray(data);
    }

    /**
     *
     * @param data
     */
    public static collection<T, R>(this: new () => R, data: T[]): any[] {
        if (!data) return [];
        const instance = new this() as any;
        return data.map((item) => instance.toArray(item));
    }

    /**
     *
     * @param item
     * @protected
     */
    protected abstract toArray(item: T): object;
}