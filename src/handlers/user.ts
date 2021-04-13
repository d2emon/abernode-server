import express from 'express';
import log from '../helpers/log';
import User from '../models/user';
import MessageOfTheDay from '../models/messageOfTheDay';

export const newUser = async (req: express.Request, res: express.Response) => {
    const {
        username,
        password,
    } = req.params;

    if (await User.findByName(username)) {
        return res.json({ error: 'No!' });
    }

    const user = new User({
        username,
        password,
    });
    const errors = await user.save();
    return res.json({ errors });
}

/**
 * The whole login system is called from this
 * @param req
 * @param res
 */
export const login = async (req: express.Request, res: express.Response) => {
    const {
        userId,
        username,
        password,
    } = req.params;

    const user = await User.findByName(username);
    if (!user) {
        return res.json({ error: 'No!' });
    }
    if (!user.checkPassword(password)) {
        return res.json({ error: 'No!' });
    }

    const message = new MessageOfTheDay();
    await message.load();

    log.info(`Game entry by ${username} : UID ${userId}`);

    return res.json({
        result: true,
        messageOfTheDay: message.getMessage(),
    });
}

export const showUser = async (req: express.Request, res: express.Response) => {
    // Admin only
    const {
        username,
    } = req.params;
    const user = await User.findByName(username);
    return user
        ? res.json({ user: user.getData() })
        : res.json({ error: 'No user registered in that name' });
    /*
    {
        username,
        password: 'default',
        // 'E..'
    }
     */
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    // Admin only
    const {
        username,
    } = req.params;
    const user = await User.findByName(username);
    if (!user) {
        return res.json({ error: 'Cannot delete non-existent user' })
    }
    await user.remove();
    return res.json({ result: 1 })
}

export const editUser = async (req: express.Request, res: express.Response) => {
    // Admin only
    const {
        userId,
        username,
        password,
    } = req.params;
    const user = new User({
        username,
        password,
    });
    const errors = await user.update(userId);
    return res.json({ errors });
}

/**
 * Change your password
 * @param req
 * @param res
 */
export const changePassword = async (req: express.Request, res: express.Response) => {
    const {
        username,
        password,
        newPassword,
        verifyPassword,
    } = req.params;
    const user = await User.findByName(username);
    if (!user) {
        return res.json({ error: 'Cannot delete non-existent user' })
    }
    const errors = await user.changePassword(password, newPassword, verifyPassword);
    return res.json({ errors });
}
