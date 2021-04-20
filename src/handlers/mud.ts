import express from "express";

const execStream = (params: string[]): Promise<void> => Promise.resolve();

export const fastStart = async (req: express.Request, res: express.Response) => {
    const {
        username,
    } = req.params;
    try {
        await execStream([process.env.EXE, '   --}----- ABERMUD -----{--    Playing as ', username]);
        return res.json({ result: 1 });
    } catch (e) {
        return res.json({ error: 'mud.exe : Not found' });
    }
};

export const exitMud = async (req: express.Request, res: express.Response) => {
    return res.json({ code: 0 });
}

export const runMud = async (req: express.Request, res: express.Response) => {
    const {
        username,
    } = req.params;
    try {
        await execStream([process.env.EXE, '   --{----- ABERMUD -----}--      Playing as ', username]);
        return res.json({ result: 1 });
    } catch (e) {
        return res.json({ error: 'mud.exe : Not found' });
    }
}

export const testMode = async (req: express.Request, res: express.Response) => {
    // Admin only
    return res.json({ result: 1 });
}
