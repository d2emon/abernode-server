import {Player} from "./player";

interface ItemData {
    name: string;
    descriptions: string[];
    maxState: number;
    flannel: boolean;
    value: number;
}

export const IS_LOCATED_AT = 0;
export const IS_CARRIED_BY = 1;
export const IS_WEARING_BY = 2;
export const IS_CONTAINED_IN = 3;

interface ItemFlags {
    isDestroyed: boolean;
    hasConnectedItem: boolean;
    canBeOpened: boolean;
    canBeLocked: boolean;

    canBeTurnedOn: boolean;
    canBeSwitched: boolean;
    canBeEaten: boolean;
    // 7

    canWear: boolean;
    canBeLit: boolean;
    canBeExtinguished: boolean;
    isKey: boolean;

    changeStateOnPut: boolean;
    isLit: boolean;
    isContainer: boolean;
    isWeapon: boolean;

    values: number[];
}

interface VariableItemData {
    locationId: number;
    // 1
    flags: ItemFlags;
    carryFlag: number;
}

export const ITEM_IS_LIGHT = 13;

class Item implements ItemData, VariableItemData {
    itemId: number;

    name: string;

    state: number;

    descriptions: string[];

    maxState: number;

    flannel: boolean;

    value: number;

    private static NOBS = 0;

    private static objects: ItemData[] = [];

    // From VariableItemData

    locationId: number;

    // 1

    flags: ItemFlags;

    carryFlag: number;

    constructor(itemId: number) {
        this.itemId = itemId;
        this.state = 0;

        // Statics
        const itemData = Item.objects[itemId];
        this.name = itemData.name;
        this.descriptions = itemData.descriptions;
        this.maxState = itemData.maxState;
        this.flannel = itemData.flannel;
        this.value = itemData.value;

        // Variables
        this.locationId = 0;
        // 0
        // 1
        this.flags = {
            isDestroyed: false,
            hasConnectedItem: false,
            canBeOpened: false,
            canBeLocked: false,

            canBeTurnedOn: false,
            canBeSwitched: false,
            canBeEaten: false,

            canWear: false,
            canBeLit: false,
            canBeExtinguished: false,
            isKey: false,

            changeStateOnPut: false,
            isLit: false,
            isContainer: false,
            isWeapon: false,

            values: [
                0,
                0,
            ],
        };
        this.carryFlag = 0;
    }

    static async getItem (itemId: number): Promise<ItemData> {
        return Promise.resolve(Item.objects[itemId]);
    }

    static async findByName (name: string): Promise<number | null> {
        const search = name.toLowerCase();
        for(let itemId = 0; itemId < Item.NOBS; itemId += 1) {
            const item: Item = await Item.getItem(itemId);
            if (search === item.name) {
                return itemId;
            }
        }
        return undefined;
    }

    private fromWorld (item: VariableItemData): void {
        this.locationId = item.locationId;
        // 1
        // 2
        this.carryFlag = item.carryFlag;
    }

    private setLocation (locationId: number, carryFlag: number): void {
        this.locationId = locationId;
        this.carryFlag = carryFlag;
    }

    getDescription (): string {
        return this.descriptions[this.state];
    }

    isAvailable(playerId: number): boolean {
        return ishere(this) || iscarrby(this, playerId);
    }
}

export default Item;
