import {UserData} from "../../models/userData";
import {GENDER_MALE} from "../../models/player";

export const EVENT_DISABLED: number = undefined;
export const EVENT_START: number = null;

export interface User {
    userId: string;
    active: boolean;
    eventId: number | undefined | null;
    locationId: number;
    playerId: number;
    mode: string;
    name: string;
    data: UserData;
}

export interface GlobalVars {
    programName: string[];

    in_fight: number;
    numobs: number;
    objinfo: any[];
    ublock: any[];

    user: User;
}

export const globalVars: GlobalVars = {
    programName: [
        '',
        '',
    ],

    in_fight: 0,
    numobs: 0,
    objinfo: [],
    ublock: [],

    user: {
        userId: '',
        active: false,
        eventId: EVENT_START,
        locationId: 0,
        mode: '',
        name: '',
        playerId: 0,
        data: {
            flags: {
                disableSnoop: false,
                gender: GENDER_MALE,
            },
            level: 0,
            name: '',
            score: 0,
            strength: 0,
        }
    },
};

export const onTimeout = async (): Promise<void> => Promise.resolve();
