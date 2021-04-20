import express from 'express';

export interface Mud {
    createdAt: string;
    startedAt: string;
    messageOfTheDay: string;
}

export interface User {
    userId: string;
    username: string;
}

export interface Request extends express.Request {
    user?: User;
    mud: Mud;
}
