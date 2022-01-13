/**
 * Key drivers
 */
import Messages from '../../models/messages';

export const key = {
    promptBuffer: '',
    keyBuffer: '',
}

const keyInputBefore = async (prompt: string, maxLength: number): Promise<{}> => {
    // gamego.signals.active = true;
    // gamego.signals.enabled = true;
    key.promptBuffer = prompt;

    await Messages.addUserMessage(g.user, prompt)
    await g.world.save();
    const messages = await Messages.getUserMessages(g.user, {});
    return {
        deactivate: true,
        dirty: false,
        messages: messages.messages,
    };
};

const keyInputAfter = async (prompt: string, maxLength: number): Promise<string> => {
    let result = '';
    for (let charId = 0; charId < maxLength; charId += 1) {
        const nextChar = await Promise.resolve('\n');
        if (nextChar === '\n') {
            break;
        }
        if (nextChar < '32') {
            continue;
        }
        if (nextChar === '127') {
            continue;
        }
        result += nextChar;
    }
    key.keyBuffer = result;
    // gamego.signals.enabled = false;
    // gamego.signals.active = false;

    return result;
};

export const reprint = async (): Promise<any> => {
    await g.world.save();
    const messages = await Messages.getUserMessages(g.user, { newLine: true });
    return {
        ...messages,
        prompt: `${key.promptBuffer}${key.keyBuffer}`,
    };
};