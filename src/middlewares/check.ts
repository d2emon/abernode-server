import express from 'express';
import {
    READ_ONLY,
    READ_WRITE,
    Stream,
} from '../helpers/stream';

const DISABLED_STREAM = 'NOLOGIN';
const BANNED_STREAM = 'BAN_FILE';

const getAllowedHost = (): string => process.env.HOST_MACHINE;

/**
 * Check we are running on the correct host
 * see the notes about the use of flock();
 * and the affects of lockf();
 */
const checkHost = (host: string): string | undefined => {
    const allowed = getAllowedHost();
    return (host !== allowed)
        ? `AberMUD is only available on ${allowed}, not on ${host}`
        : undefined;
};

/**
 * Check if there is a no logins file active
 */
const checkDisabled = async (): Promise<string | undefined> => {
    try {
        return Stream.getContent(DISABLED_STREAM, READ_ONLY);
    } catch (e) {
        return undefined;
    }
}

/**
 * Check to see if UID in banned list
 * @param userId
 */
const checkBanned = async (userId: string): Promise<string | undefined> => {
    let result: string | undefined;
    const search = userId.toLowerCase();
    const stream: Stream = await Stream.openLock(BANNED_STREAM, READ_WRITE, () => {});
    await stream.getStrings(79, (s) => {
        if (s.toLowerCase() === search) {
            result = 'I\'m sorry- that userid has been banned from the Game';
        }
    });
    await stream.close();
    return result;
}

const check = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {
        host,
        userId,
    } = req.params;

    const checks = await Promise
        .all([
            checkHost(host),
            checkDisabled(),
            checkBanned(userId),
        ]);
    const errors = checks.filter(e => !!e);
    return errors ? res.json({ errors }) : next();
}

export default check;
