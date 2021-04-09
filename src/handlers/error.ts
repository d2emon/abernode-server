import express from 'express'

class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

const errorResponse = (message: string, code?: number, data?: any) => ({
    error: {
        code: code || 500,
        message,
        data,
    },
})

export const error404 = (req: express.Request, res: any) => res
    .status(404)
    .json(errorResponse('Not Found', 404))

export const errorHandler = (env: string) => (error: HttpException, req: express.Request, res: express.Response) => res
    .status(error.status || 500)
    .json(errorResponse(
        error.message,
        error.status,
        (env === 'development') ? error : undefined,
    ))
