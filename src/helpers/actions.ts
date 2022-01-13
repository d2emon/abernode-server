import {EVENT_START, User} from './unprocessed/dummy';
import World from './unprocessed/opensys';
import {handleEvents, setLocationId} from './unprocessed/tk';
import {visual} from "./messageProcessor";
import {GENDER_NEUTRAL, Player} from "../models/player";
import {sendAdminMessage, sendGlobalMessage} from "./events";
import randomizer from "./randomizer";

// TODO: Remove them
const gamecom = async (action: string): Promise<void> => {};

interface MyData {
    brief: boolean;
    newEvents: boolean;
}

export const MODE_SPECIAL = 'MODE_SPECIAL';
export const MODE_GAME = 'MODE_GAME';

export interface ActionResponse {
    messages: string[];
    newEvents: boolean;
    user: User;
}

const gameStart = async (user: User): Promise<ActionResponse> => {
    const my: MyData = {
        brief: false,
        newEvents: false,
    }

    const player: Player = new Player(user.playerId, user.name);
    // player.locationId = 0;
    // player.eventId = EVENT_START;
    player.strength = user.data.strength; // -1
    player.visibility = (user.data.level < 10000) ? 0 : 10000; // 0
    player.flags = user.data.flags;
    player.level = user.data.level; // 1
    // player.weaponId = null;
    // player.helping = null;

    const world = await World.load();
    await world.setPlayer(user.playerId, player);

    user.eventId = EVENT_START;
    user.locationId = -5;
    user.mode = MODE_GAME;

    await sendAdminMessage(
        user.name,
        0,
        visual(user.name, `[ ${user.name} has entered the game ]\n`),
    );

    const messages = await handleEvents(user);
    user.locationId = (randomizer() > 50) ? -5 : -183;
    await setLocationId(user, user.locationId, my.brief);

    await sendGlobalMessage(
        user.name,
        user.locationId,
        visual(user.name, `${user.name} has entered the game\n`),
    )

    await world.save();

    return {
        messages,
        newEvents: my.newEvents,
        user,
    };
};

export const specialAction = async (action: string, user: User): Promise<ActionResponse> => {
    const result: ActionResponse = {
        messages: [],
        newEvents: false,
        user,
    };

    if (!action) {
        return result;
    } else if (action[0] !== '.') {
        return result;
    } else if (action[1].toLowerCase() === 'q') {
        return result;
    } else if (action[1].toLowerCase() === 'g') {
        return gameStart(user);
    } else {
        throw new Error('Unknown . option');
    }
};

export const performAction = async (action: string, user: User): Promise<ActionResponse> => {
    const result: ActionResponse = {
        messages: [],
        newEvents: false,
        user,
    };
    const world = {
        save: async () => Promise.resolve(),
    };

    if (user.mode === MODE_GAME) {
        await gamecom(action);
        await world.save();
        return {
            ...result,
            newEvents: true,
        };
    } else {
        return await specialAction(action, user);
    }
}