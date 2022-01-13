/**
 * Two Phase Game System
 */
import express from 'express';
import {
    EVENT_START,
    globalVars,
    onTimeout,
} from '../helpers/unprocessed/dummy';
import World from '../helpers/unprocessed/opensys';
import {handleEvents} from '../helpers/unprocessed/tk';
import {
    GameOptions,
    GameResponse,
    errorResponse,
    successResponse,
} from '../helpers/responses';
import {MODE_SPECIAL, specialAction} from "../helpers/actions";
import UserStream, {UserData} from "../models/userData";
import {GENDER_FEMALE, GENDER_MALE, GENDER_NEUTRAL} from "../models/player";
import log from "../helpers/log";
import Messages from "../models/messages";
import { User } from "../helpers/unprocessed/dummy";

const loose = async (
    message?: string,
    options: GameOptions = {},
    code: number = 0,
): Promise<GameResponse | null> => message
    ? errorResponse(message, code, options)
    : null;

const onSystemError = (): Promise<GameResponse | null> => loose(
    '',
    {
        deactivate: true,
        // dirty: false,
        // keyboard: true,
        reprint: false,
    },
    255,
);

const logout = (): Promise<GameResponse> => globalVars.in_fight
    ? successResponse('^C', {})
    : loose(
        'Byeeeeeeeeee  ...........',
        {
            deactivate: true,
            // dirty: false,
            // keyboard: true,
            reprint: false,
        },
    );

const getWait = async (): Promise<GameResponse> => {
    const world = await World.load();
    await handleEvents(globalVars.user, false, true);
    await onTimeout();
    await world.save();

    return await successResponse(
        '',
        {
            deactivate: false,
            dirty: false,
            // keyboard: true,
            reprint: true,
        },
    );
};

type SignalHandler = () => Promise<GameResponse>;

class Signals {
    static SIGHUP = 'SIGHUP';

    static SIGINT = 'SIGINT';

    static SIGTERM = 'SIGTERM';

    static SIGTSTP = 'SIGTSTP';

    static SIGQUIT = 'SIGQUIT';

    static SIGCONT = 'SIGCONT';

    static SIGALRM = 'SIGALRM';

    private readonly signals: { [code: string]: SignalHandler };

    constructor() {
        this.signals = {
            [Signals.SIGHUP]: onSystemError,
            [Signals.SIGINT]: logout,
            [Signals.SIGTERM]: logout,
            [Signals.SIGTSTP]: Signals.defaultHandler,
            [Signals.SIGQUIT]: Signals.defaultHandler,
            [Signals.SIGCONT]: onSystemError,
            [Signals.SIGALRM]: getWait,
        };
    }

    private static async defaultHandler(): Promise<GameResponse> {
        return successResponse('', {});
    }

    async signal(code: string): Promise<GameResponse> {
        const handler: SignalHandler = this.signals[code] || Signals.defaultHandler;
        return handler();
    }
}

export const start = async (req: express.Request, res: express.Response) => {
    const {
        name,
        userId,
    } = req.params;
    if (!name) {
        return res.json(errorResponse('Args!'));
    }
    try {
        log.info(`GAME ENTRY: ${name}[${userId}]`);

        const messagesCollection = new Messages(userId);
        await messagesCollection.resetMessages();

        const data = await UserStream.findUser(name);

        if (!data) {
            return res.json(successResponse(
                '\nSex (M/F) : ',
                {
                    // deactivate: false,
                    // dirty: false,
                    keyboard: true,
                    // reprint: true,
                },
            ));
        }

        const world = await World.load();
        const player = await world.addPlayer(userId, (name === 'Phantom') ? `The ${name}` : name);
        const user: User = {
            userId,
            playerId: player.playerId,
            active: false,
            eventId: EVENT_START,
            locationId: 0,
            mode: MODE_SPECIAL,
            name: player.name,
            data,
        };

        const messages = [
            'Entering Game ....',
            `Hello ${user.name}`,
        ];

        const events = await handleEvents(user, true);
        events.forEach(m => messages.push(m));

        const actionResult = await specialAction('.g', user);
        actionResult.messages.forEach(m => messages.push(m));

        // globalVars.newEvents = actionResult.newEvents;
        globalVars.user = {
            ...actionResult.user,
            active: true,
            eventId: EVENT_START,
        };
        return res.json(successResponse(
            messages.join('\n'),
            {
                // deactivate: false,
                // dirty: false,
                keyboard: true,
                // reprint: true,
            },
        ));
    } catch (e) {
        return res.json(errorResponse(e))
    }
};

export const setGender = async (req: express.Request, res: express.Response) => {
    const {
        name,
    } = req.params;
    const genderId = req.params.gender.toLowerCase();

    let gender: string;
    if (genderId === 'm') {
        gender = GENDER_MALE;
    } else if (genderId === 'f') {
        gender = GENDER_FEMALE;
    } else {
        return res.json(errorResponse('M or F'));
    }

    await UserStream.saveUser({
        name,
        score: 0,
        strength: 40,
        level: 1,
        flags: {
            gender,
            disableExorcise: false,
            canChangeFlags: false,
            canEdit: false,
            isDebugger: false,
            canUsePatch: false,
            disableSnoop: false,
        },
    });

    return res.json(successResponse(
        'Creating character....\n',
        {
            // deactivate: false,
            // dirty: false,
            keyboard: true,
            // reprint: true,
        },
        // Redirect to main
    ));
};

export const postSignal = async (req: express.Request, res: express.Response) => {
    const {
        signalCode,
    } = req.params;
    const signals = new Signals();
    const result = await signals.signal(signalCode);
    return res.json(result);
};
