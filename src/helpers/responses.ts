import Messages from '../models/messages';

export interface GameOptions {
    deactivate?: boolean;
    dirty?: boolean;
    keyboard?: boolean;
    reprint?: boolean;
}

export interface GameResponse {
    code: number | null;
    finalMessage?: string;
    messages: string;
    options: GameOptions;
    prompt?: string;
    title?: string;
}

export const successResponse = async (
    messages?: string,
    options: GameOptions = {},
): Promise<GameResponse> => ({
    code: null,
    // finalMessage
    messages: messages || '',
    options,
    // title
})

export const errorResponse = async (
    message: string,
    code: number = 0,
    options: GameOptions = {},
): Promise<GameResponse> => {
    const messages = await Messages.getUserMessages(null, {});
    return {
        code: code || 0,
        finalMessage: `\n<br />\n\n${message}\n\n<br />\n`,
        messages: messages.messages,
        options: {
            deactivate: options.deactivate,
            dirty: messages.dirty || options.dirty,
            keyboard: options.keyboard,
            reprint: options.reprint,
        }
        // title
    };
};
