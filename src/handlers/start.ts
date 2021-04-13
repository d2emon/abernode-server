import express from 'express';
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
