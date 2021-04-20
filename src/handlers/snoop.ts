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
const fpbn = async (name: string): Promise<any> => Promise.resolve(null);

interface RequestOptions {
    userId: string;
    adminUserId: string;
    isAdmin: boolean;
    isSuperuser: boolean;
    snoopTarget: number;
    user: {
        name: string,
    },
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
    senderUserId: string,
    receiver: string,
    isSuperuser: boolean,
): Promise<null | Player> => {
    const receiverId = await fpbn(receiver);
    if (!receiverId) {
        throw new Error('Who is that?');
    }

    const target = await world.getPlayer(receiverId);
    if ((!isSuperuser && (target.level >= 10)) || target.flags.disableSnoop) {
        throw new Error('Your magical vision is obscured');
    }

    await Promise.all([
        // addMessage(`Started to snoop on ${target.name}`)
        Snoop.start(senderUserId),
        sendStartSnoopEvent(senderUserId, target.name),
    ]);
    return target;
}

const stopSnoop = async (sender: string, receiver: Player): Promise<void> => {
    await sendStopSnoopEvent(sender, receiver.name);
};

export const actionLog = async (options: RequestOptions): Promise<GameResponse> => {
    if (options.userId !== options.adminUserId) {
        return errorResponse('Not allowed from this ID');
    }
    return options.isLogging
        ? stopLog()
        : startLog();
}

export const actionSnoop = async (options: RequestOptions): Promise<GameResponse> => {
    const {
        isAdmin, // my_lev >= 10
        isSuperuser, // my_lev >= 10000
        snoopTarget,
        user,
        wordbuf,
    } = options;
    const world = await World.load();

    if (!isAdmin) {
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
        const snoopedPlayer = await startSnoop(world, user.name, wordbuf, isSuperuser);
        return successResponse(messages.join('\n'));
        // snoopedPlayer
    } catch (e) {
        // messages
        return errorResponse(e);
    }
}
