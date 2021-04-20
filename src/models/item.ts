interface ItemData {
    name: string;
}

export const ITEM_IS_LIGHT = 13;

class Item implements ItemData {
    itemId: number;

    name: string;

    carryFlag: number;

    flags: boolean[];

    locationId: number;

    private static NOBS = 0;

    private static objects: Item[] = [];

    constructor() {
        this.itemId = 0;
        this.name = '';
        this.flags = [];
        this.carryFlag = 0;
        this.locationId = 0;
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
