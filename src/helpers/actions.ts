import {User} from './unprocessed/dummy';
import World from './unprocessed/opensys';
import {handleEvents, setLocationId} from './unprocessed/tk';
import {visual} from "./messageProcessor";

// TODO: Remove them
const setPlayer = async (world: World, playerId: number, player: any) => Promise.resolve();
const gamecom = async (action: string): Promise<void> => {};
const initme = async () => Promise.resolve();
const sendsys = async (sender: string, receiver: string, code: number, locationId: number, payload: any) => Promise.resolve();
const randperc = () => 0;

const MODE_SPECIAL = 'MODE_SPECIAL';
const MODE_GAME = 'MODE_GAME';

export interface ActionResponse {
    messages: string[];
    newEvents: boolean;
    user: User;
}

const gameStart = async (user: User): Promise<ActionResponse> => {
    const my = {
        brief: false,
        my_lev: 0,
        my_sex: 0,
        my_str: 0,
        newEvents: false,
    }

    user.mode = MODE_GAME;
    user.locationId = -5;
    await initme();

    const world = await World.load();
    await setPlayer(
        world,
        user.playerId,
        {
            flags: my.my_sex,
            helping: null,
            level: my.my_lev,
            strength: my.my_str,
            visible: (my.my_lev < 10000) ? 0 : 10000,
            weapon: null,
        },
    );

    await sendsys(
        user.name,
        user.name,
        -10113,
        user.locationId,
        visual(user.name, `[ ${user.name} has entered the game ]\n`),
    );

    const messages = await handleEvents(user);
    user.locationId = (randperc() > 50) ? -5 : -183;
    await setLocationId(user, user.locationId, my.brief);

    await sendsys(
        user.name,
        user.name,
        -10000,
        user.locationId,
        visual(user.name, `${user.name} has entered the game\n`),
    );

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