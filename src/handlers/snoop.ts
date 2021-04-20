import World from '../helpers/unprocessed/opensys';
import {
    errorResponse,
    successResponse,
    GameResponse,
} from '../helpers/responses';
import {sendStartSnoopEvent, sendStopSnoopEvent} from "../helpers/events";
import Snoop from "../models/snoop";
import LogStream from "../models/logStream";
import {Player} from "../models/player";

const brkword = async (): Promise<any> => Promise.resolve(null);

interface User {
    userId: string,
    isAdmin: boolean; // my_lev >= 10
    isBlind: boolean;
    isSuperuser: boolean; // my_lev >= 10000
    name: string,
    playerId: number,
}

interface RequestOptions {
    adminUserId: string;
    snoopTarget: number;
    user: User,
    wordbuf: string;
    // Session Vars
    isLogging: boolean;
}

const startLog = async (): Promise<GameResponse> => {
    // addMessage('Commencing Logging Of Session');
    try {
        await LogStream.open();
        return successResponse('The log will be written to the file \"mud_log\"');
    } catch (error) {
        return errorResponse(error);
    }
};

const stopLog = async (): Promise<GameResponse> => {
    await LogStream.log('\nEnd of log....\n\n');
    await LogStream.close();
    return successResponse('End of log');
};

const startSnoop = async (
    world: World,
    user: User,
    name: string,
): Promise<Player | null> => {
    // FIXME
    const snooper = await world.findPlayerByName(user.name);
    const snooped = await world.findVisiblePlayerByName(name, snooper, user.isBlind);
    if (!snooped) {
        throw new Error('Who is that?');
    }

    if ((!user.isSuperuser && (snooped.level >= 10)) || snooped.flags.disableSnoop) {
        throw new Error('Your magical vision is obscured');
    }

    await Promise.all([
        Snoop.start(user.userId),
        sendStartSnoopEvent(user.userId, snooped.name),
    ]);
    return snooped;
}

const stopSnoop = async (sender: string, receiver: Player): Promise<void> => {
    await sendStopSnoopEvent(sender, receiver.name);
};

export const actionLog = async (options: RequestOptions): Promise<GameResponse> => {
    if (options.user.userId !== options.adminUserId) {
        return errorResponse('Not allowed from this ID');
    }
    return options.isLogging
        ? stopLog()
        : startLog();
}

export const actionSnoop = async (options: RequestOptions): Promise<GameResponse> => {
    const {
        snoopTarget,
        user,
        wordbuf,
    } = options;
    const world = await World.load();

    if (!user.isAdmin) {
        return errorResponse('Ho hum, the weather is nice isn\'t it');
    }

    const messages: string[] = [];

    if (snoopTarget) {
        const snoopedPlayer = await world.getPlayer(snoopTarget);
        messages.push(`Stopped snooping on ${snoopedPlayer.name}`);
        await stopSnoop(user.name, snoopedPlayer);
    }

    if (await brkword() === null) {
        return successResponse(messages.join('\n'));
    }

    try {
        const snoopedPlayer = await startSnoop(world, user, wordbuf);
        messages.push(`Started to snoop on ${snoopedPlayer.name}`);
        return successResponse(messages.join('\n'));
    } catch (e) {
        // messages
        return errorResponse(e);
    }
}
