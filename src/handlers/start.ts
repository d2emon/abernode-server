import express from 'express';
import {
    syslog,
    talker,
} from '../helpers/unprocessed/dummy';
import {
    getCreatedTime,
    getStartedAt,
} from '../helpers/time';
import User from '../models/user';

/**
 * The initial routine
 * @param req
 * @param res
 */
export const startMud = async (req: express.Request, res: express.Response) => {
    const [
        createdAt,
        startedAt,
    ] = await Promise.all([
        getCreatedTime(),
        getStartedAt(),
    ]);
    return res.json({
        createdAt,
        startedAt,
    });
};

export const checkUser = async (req: express.Request, res: express.Response) => {
    const {
        username,
    } = req.params;
    const user = await User.findByName(username);
    return res.json({
        username: user && user.username,
    });
};

/**
 * Login routine
 * @param req
 * @param res
 */
export const afterLogin = async (req: express.Request, res: express.Response) => {
    const {
        userId,
        username,
    } = req.params;
    try{
        // Log entry
        await syslog(`Game entry by ${username} : UID ${userId}`);
        // Run system
        await talker(username, !username);
        return res.json({
            exitMessage: 'Bye Bye'
        });
    } catch (error) {
        return res.json({ error })
    }
}
