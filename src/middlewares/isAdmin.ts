import express from "express";

const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {
        userId,
    } = req.params;

    return (userId !== 'admin') ? res.json({ error: 'ERROR' }) : next();
}

export default isAdmin;
