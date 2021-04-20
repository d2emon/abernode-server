import {User} from './unprocessed/dummy';
import World from './unprocessed/opensys';
import {handleEvents, setLocationId} from './unprocessed/tk';
import {visual} from "./messageProcessor";
import {GENDER_MALE, PlayerFlags} from "../models/player";
import {sendAdminMessage, sendGlobalMessage} from "./events";

// TODO: Remove them
const gamecom = async (action: string): Promise<void> => {};
const initme = async () => Promise.resolve();
const randperc = () => 0;

interface MyData {
    brief: boolean;
    my_gender: string;
    my_lev: number;
    my_sex: PlayerFlags;
    my_str: number;
    newEvents: boolean;
}

const MODE_SPECIAL = 'MODE_SPECIAL';
const MODE_GAME = 'MODE_GAME';

export interface ActionResponse {
    messages: string[];
    newEvents: boolean;
    user: User;
}

const gameStart = async (user: User): Promise<ActionResponse> => {
    const my: MyData = {
        brief: false,
        my_gender: GENDER_MALE,
        my_lev: 0,
        my_sex: {
            disableSnoop: false,
        },
        my_str: 0,
        newEvents: false,
    }

    user.mode = MODE_GAME;
    user.locationId = -5;
    await initme();

    const world = await World.load();
    await world.setPlayer(
        user.playerId,
        {
            playerId: user.playerId,
            flags: my.my_sex,
            gender: my.my_gender, // TODO: Calculate
            helping: null,
            isMobile: false, // TODO: Calculate
            level: my.my_lev,
            locationId: 0,
            name: '',
            strength: my.my_str,
            visible: (my.my_lev < 10000) ? 0 : 10000,
            weapon: null,
        },
    );

    await sendAdminMessage(
        user.name,
        user.locationId,
        visual(user.name, `[ ${user.name} has entered the game ]\n`),
    );

    const messages = await handleEvents(user);
    user.locationId = (randperc() > 50) ? -5 : -183;
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