interface ItemData {
    name: string;
}

class Item implements ItemData {
    name: string;

    private static NOBS = 0;

    private static objects: Item[] = [];

    constructor() {
        this.name = '';
    }

    static async getItem(itemId: number): Promise<Item> {
        return Promise.resolve(Item.objects[itemId]);
    }

    static async findByName(name: string): Promise<number | null> {
        const search = name.toLowerCase();
        for(let itemId = 0; itemId < Item.NOBS; itemId += 1) {
            const item: Item = await Item.getItem(itemId);
            if (search === item.name) {
                return itemId;
            }
        }
        return undefined;
    }
}

export default Item;
