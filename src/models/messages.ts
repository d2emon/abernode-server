import {
    User
} from '../helpers/unprocessed/dummy';
import log from '../helpers/log';
import {MessageProcessorOptions} from "../helpers/messageProcessor";
import Snoop from "./snoop";
import LogStream from "./logStream";

type MessagesStorage = { [userId: string]: string[] };

const storage: MessagesStorage = {};

interface MessagesOutput {
    dirty: boolean;
    messages: string;
    snoop: string;
}

class Messages {
    userId: string;

    constructor (userId: string) {
        this.userId = userId;
    }

    async resetMessages (): Promise<void> {
        try {
            storage[this.userId] = [];
            return Promise.resolve();
        } catch (e) {
            throw new Error('Out Of Memory');
        }
    }

    async addMessage (message: string): Promise<void> {
        const messages = storage[this.userId];
        if (!messages) {
            throw new Error('User not found');
        }
        if (message.length > 255) {
            throw new Error('Short Buffer overflow');
        }
        if (messages.length > 4095) {
            delete storage[this.userId];
            throw new Error('PANIC - Buffer overflow');
        }
        storage[this.userId].push(message);
        return Promise.resolve();
    }

    private async getMessages (): Promise<string[]> {
        return Promise.resolve(storage[this.userId]);
    }

    private async processMessages (options: MessageProcessorOptions): Promise<string> {
        const messages = await this.getMessages();
        return messages.join('\n');
    }

    static async addUserMessage (user: User, message: string): Promise<void> {
        try {
            const messages = new Messages(user.userId);
            await messages.addMessage(message);
        } catch (e) {
            log.info(`Buffer overflow on user ${user.name}`);
            throw new Error(e);
        }
    }

    static async getUserMessages (user: User, options: MessageProcessorOptions): Promise<MessagesOutput> {
        const messages = new Messages(user.userId);

        // Disable signals
        const [
            processed,
            snoop,
        ] = await Promise.all([
            await messages.processMessages(options),
            options.snoopedPlayerId && await Snoop.read(user.userId),
        ]);

        await Promise.all([
            options.isLogging && LogStream.log(processed),
            options.isSnoopedBy && Snoop.write(options.isSnoopedBy, processed),
            messages.resetMessages(),
        ]);
        // Enable signals

        return {
            dirty: !processed.length,
            messages: ((processed.length && options.newLine) ? '\n' : '') + processed,
            snoop,
        };
    }
}

export default Messages;
