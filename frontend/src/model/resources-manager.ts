export abstract class ResourcesManager<K, T> {
    cache : T[] = [];
    lookupTable = new Map<K, T>();
    abstract get() : Promise<T[]>;
    retrieve() {
        if (this.cache.length) {
            return Promise.resolve(this.cache);
        }
        return this.get()
            .then((resources) => {
                this.updateCache(resources);
                return resources;
            })
    }
    abstract getKeyForItem(item : T) : K
    updateCache(resources : T[]) {
        this.cache = resources;
        this.lookupTable.clear();
        this.cache.forEach((w) => {
            this.lookupTable.set(this.getKeyForItem(w), w);
        });
    }
    invalidate() {
        this.cache = [];
    }
    lookup(id: K) : Promise<T> {
        const item = this.lookupTable.get(id);
        if (item) {
            return Promise.resolve(item);
        }
        return this.retrieve()
            .then(() => this.lookup(id));
    }
}
