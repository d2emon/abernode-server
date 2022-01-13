/**
 * AberMUD II
 *
 * This game systems, its code scenario and design
 * are (C) 1987/88  Alan Cox,Jim Finnis,Richard Acott
 *
 * This file holds the basic communications routines
 */
import {
    getUserName,
    parseUserData,
    readData,
    writeData,
} from '../blib';
import World, {EventsMeta} from './opensys';
import {
    EVENT_START,
    User,
} from "./dummy";
import log from "../log";
import {sendAdminMessage, sendStopSnoopEvent} from "../events";
import {hasLight, isDark, userCanSee} from "./weather";
import {GENDER_MALE, Player} from "../../models/player";
import UserStream from "../../models/userData";

/*
extern long my_str;
extern long my_sex;
extern long my_lev;
extern FILE * openroom();
extern char * pname();
extern char * oname();
extern long ppos();
*/

/*
Data format for mud packets

Sector 0
[64 words]
0   Current first message pointer
1   Control Word
Sectors 1-n  in pairs ie [128 words]

[channel][controlword][text data]

[controlword]
0 = Text
- 1 = general request
*/

interface EventBlock {
    v0: number;
    code: number;
    users: {
        sender: string,
        receiver: string,
    };
    payload: string;
    force: boolean;
}

// TODO: Remove them
const gamrcv = async (block: EventBlock): Promise<string> => '';
const dumpstuff = async (playerId: number, locationId: number) => Promise.resolve();
const longwthr = async () => Promise.resolve();
const eorte = async (interrupt: boolean) => Promise.resolve();

interface EventResponse {
    code: number | null;
    message: string;
}

export const sendEvent = async (event: EventBlock) => {
    const world = await World.load();
    return await world.addEvent(event, revise(world));
}

const broadcast = (message: string) => sendEvent({
    v0: 0,
    code: -1,
    payload: message,
    users: {
        sender: '',
        receiver: '',
    },
    force: true,
});

const revise = (world: World) => async (eventId: number): Promise<boolean> => {
    let found = false;
    for(let i = 0; i < 16; i += 1) {
        const p = await world.getPlayer(i);
        if (p.name && (p.eventId !== undefined) && (p.eventId < eventId)) {
            found = true;
            await broadcast(`${p.name} has been timed out\n`);
            await dumpstuff(i, p.locationId);
            await world.setPlayer(
                i,
                {
                    ...p,
                    name: ''
                },
            );
        }
    }
    await longwthr();
    return found;
};

/**
 * Print appropriate stuff from data block
 * @param block
 * @param debugMode
 */
const outputEvents = async (block: EventBlock, debugMode: boolean): Promise<EventResponse> => {
    return {
        code: debugMode ? block.code : null,
        message: (block.code < -3)
            ? await gamrcv(block)
            : block.payload,
    };
}

export const handleEvents = async (user?: User, save: boolean = false, interrupt: boolean = false) => {
    let world: World;
    try {
        world = await World.load();
    } catch (e) {
        throw new Error('AberMUD: FILE_ACCESS : Access failed');
    }

    const meta = await world.getMeta();
    if (user.eventId === EVENT_START) {
        user.eventId = meta.lastEventId;
    }
    const messages: string[] = [];
    let eventId: number | null | undefined = user.eventId;
    while (eventId && (eventId < meta.lastEventId)) {
        const event = await world.getEvent(eventId);
        const output = await outputEvents(event, g.debug_mode);
        messages.push(`${output.code ? `\n<${event.code}>` : ''}${output.message}`);
        eventId += 1;
    }
    await saveEventId(user, world, eventId);
    await eorte(interrupt);
    g.rdes = 0;
    g.tdes = 0;
    g.vdes = 0;
    if (save) {
        await world.save();
    }
    return messages;
};

export const parseBlock = (block: EventBlock, username: string): EventBlock => {
    const users = block.users;
    const sender = users.sender;
    if (sender.toLowerCase().substr(0, 4) === 'the ') {
        if (sender.toLowerCase().substr(4) === username.toLowerCase()) {
            return block;
        }
    }
    return (sender.toLowerCase() === username.toLowerCase()) ? block : null;
}

const loose = async (): Promise<void> => {
    // No interruptions while you are busy dying
    // ABOUT 2 MINUTES OR SO

    // Deactivate user
    // Save world

    const world = await World.load();
    await dumpitems();
    const player = await world.getPlayer(g.user.userId);
    if (player.visible < 10000) {
        await sendAdminMessage(
            g.user.name,
            null,
            `${g.user.name} has departed from AberMUDII\n`,
        );
    }
    await world.setPlayer(g.user.userId, { name: '' });
    await world.save();

    if (!g.zapped) {
        await UserStream.saveUser({
            ...g.user.data,
            flags: player.flags,
        });
    }

    if (snoopedPlayer) {
        await sendStopSnoopEvent(g.user.userId, snoopedPlayer.name);
    }
};

const tk = {
    lastUpdate: 0,
};

export const saveEventId = async (user: User, world: World, eventId: number): Promise<void> => {
    user.eventId = eventId;
    if (Math.abs(eventId - tk.lastUpdate) < 10) {
        return;
    }
    await world.setPlayer(
        user.userId,
        { eventId },
    );
    tk.lastUpdate = eventId;
}

interface LocationData {
    death: boolean;
    description: string;
    noBrief: boolean;
    short?: string;
}

const loadLocation = async (location: any): Promise<LocationData | null> => {
    const locationData: LocationData = {
        death: false,
        description: '',
        noBrief: false,
    };

    await lodex(location);

    await location.getStrings(255, async (s) => {
        if (s === '#DIE') {
            locationData.death = true;
        } else if (s === '#NOBR') {
            locationData.noBrief = true;
        } else if (locationData.short === undefined) {
            locationData.short = s;
        } else {
            locationData.description += `${s}\n`;
        }
    });
    await location.close();

    return locationData;
}

export const lookIn = async (user: User, locationId: number, brief: boolean): Promise<string> => {
    const messages: string[] = [];

    if (g.ail_blind) {
        messages.push("You are blind... you can't see a thing!");
    }
    if (g.my_lev > 9) {
        await showname(locationId);
    }
    let dark = false;
    let location1;
    try {
        location1 = openroom(locationId, 'r');
        const locationData = await loadLocation(location1);

        const p: Player = await g.world.getPlayer(user.playerId);
        dark = !await userCanSee(p, p.locationId, g.world);

        if (dark) {
            messages.push('It is dark');
        } else {
            if (locationData.death) {
                g.ail_blind = 0;
                if (g.my_lev > 9) {
                    messages.push('<DEATH ROOM>');
                } else {
                    await loose('bye bye.....')
                }
            }
            if (!g.ail_blind) {
                messages.push(locationData.short);
                if (!brief || locationData.noBrief) {
                    messages.push(locationData.description);
                }
            }
        }
    } catch (e) {
        messages.push('');
        messages.push(`You are on channel ${locationId}`);
    }

    const world = await World.load();
    if (!dark) {
        if (!g.ail_blind) {
            await lisobs();
            if (user.mode === MODE_GAME) {
                await lispeople();
            }
        }
        messages.push('');
    }
    await onlook();

    return messages.join('\n');
}

export const setLocationId = async (user: User, locationId: number, brief: boolean): Promise<string> => {
    const world = await World.load();
    await world.setPlayer(user.userId, { locationId });
    await world.save();

    return lookIn(user, locationId, brief);
};
