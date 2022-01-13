/**
 * Fast File Controller v0.1
 */
import {
    readData,
    writeData,
} from '../blib';
import {Stream} from '../stream';
import {
    EVENT_START,
    globalVars,
} from "./dummy";
import {canSeePlayer, Player} from "../../models/player";
import {setPronouns} from "../pronouns";
import Item from "../../models/item";

export interface EventsMeta {
    firstEventId: number;
    lastEventId: number;
}

class World {
    private stream: Stream | null;

    getItems() {
        return globalVars.objinfo;
    }

    async getMeta(): Promise<EventsMeta> {
        return readData(this.stream, 0, 64);
    }

    private async setMeta(firstEventId: number, lastEventId: number): Promise<EventsMeta> {
        return writeData(
            this.stream,
            {
                firstEventId,
                lastEventId,
            },
            0,
            64,
        );
    }

    async truncateEvents() {
        for(let i = 1; i < 100; i += 20) {
            const events = await readData(this.stream, 100 + i, 1280);
            await writeData(this.stream, events, i, 1280);
        }
    }

    async getEvent(eventId: number): Promise<any> {
        const meta = await this.getMeta();
        return await readData(this.stream, eventId - meta.lastEventId, 128);
    };

    async addEvent(event: any, onTimeout?: (eventId: number) => any): Promise<number | null> {
        const meta = await this.getMeta();
        const eventId = meta.lastEventId - meta.firstEventId;
        await writeData(this.stream, event, eventId, 128);
        if (eventId < 199) {
            await this.setMeta(
                meta.firstEventId,
                meta.lastEventId + 1,
            );
            return null;
        } else {
            await this.truncateEvents();
            await this.setMeta(
                meta.firstEventId + 100,
                meta.lastEventId + 1,
            );
            return onTimeout
                ? await onTimeout((meta.firstEventId + 100) / 2)
                : null;
        }
    }

    static async load(): Promise<World> {
        const world = new World();

        if (world.stream) {
            return;
        }
        world.stream = await Stream.openLock('/usr/tmp/-iy7AM', 'r+', () => {
            throw new Error('Cannot find World file');
        });
        globalVars.objinfo = await readData(world.stream, 400, 4 * globalVars.numobs);
        globalVars.ublock = await readData(world.stream, 350, 16 * 48);
        return world;
    }

    async save(): Promise<void> {
        if (!this.stream) {
            return;
        }

        await writeData(this.stream, globalVars.objinfo, 400, 4 * globalVars.numobs);
        await writeData(this.stream, globalVars.ublock, 350, 16*48)
        await this.stream.closeLock();

        this.stream = null;
    }

    // For Player

    getUsers() {
        return globalVars.ublock;
    }

    async addPlayer(userId: string, name: string): Promise<Player> {
        if (await this.findPlayerByName(name)) {
            throw new Error('You are already on the system - you may only be on once at a time');
        }

        const found = await this.findPlayer((p) => (!p.isMobile() && !p.name));
        if (!found) {
            throw new Error('Sorry AberMUD is full at the moment');
        }

        const player = new Player(found.playerId, name);
        await this.setPlayer(player.playerId, player);
        return player;
    }

    async getPlayer(playerId: number): Promise<Player | null> {
        const players: Player[] = await this.getUsers();
        return players[playerId];
    }

    async setPlayer(playerId: number, player: Player): Promise<void> {
        globalVars.ublock[playerId] = player;
        return Promise.resolve();
    }

    async findPlayer (condition: (p: Player) => boolean): Promise<Player | null> {
        for (let playerId = 0; playerId < 48; playerId += 1) {
            const player = await this.getPlayer(playerId);
            if (!player) {
                continue;
            }
            if (condition(player)) {
                return player;
            }
        }
        return null;
    }

    async findPlayerByName (name: string): Promise<Player | null> {
        const search = name.toLowerCase();
        return await this.findPlayer((player: Player) => {
            const playerName = player.name.toLowerCase();
            return (playerName === search)
                || ((playerName.substr(0, 4) === 'the ') && (playerName.substr(4) === search));
        });
    }

    async findVisiblePlayerByName (name: string, user: Player, isBlind: boolean): Promise<Player | null> {
        const player = await this.findPlayerByName(name);
        if (player && await canSeePlayer(user, player, isBlind)) {
            setPronouns(player);
            return player;
        } else {
            return null;
        }
    }

    // For Item
    async getItem(itemId: number): Promise<Item | null> {
        const items: Item[] = await this.getItems();
        return items[itemId];
    }

    async findItem (player:Player, condition: (i: Item) => boolean): Promise<Item | null> {
        for (let itemId = 0; itemId < Item.numobs; itemId += 1) {
            const item = await this.getItem(itemId);
            if (!item) {
                continue;
            }
            if (iscarrby(item, player) || ishere(item, player)) {
                if (condition(item)) {
                    return item;
                }
            }
        }
        return null;
    }

}

export default World;