import {
    APPEND,
    READ_WRITE,
    WRITE,
    Stream,
} from '../helpers/stream';

class Snoop extends Stream {
    private static readonly STREAM_NAME = 'SNOOP';

    private static open (userId: string, permissions: string): Promise<Stream> {
        return Stream.openLock(
            `${Snoop.STREAM_NAME}${userId}`,
            permissions,
            () => {},
        )
    }

    static async start (userId: string): Promise<void> {
        const stream = await Snoop.open(userId, WRITE);
        await stream.addValue(' ');
        await stream.closeLock();
    }

    static async read (userId: string): Promise<string | null> {
        try{
            const stream = await Snoop.open(userId, READ_WRITE);
            const messages: string[] = await stream.getStrings(127, (s) => `|${s}`);
            // await stream.truncate(0);
            await stream.closeLock();

            // Get messages without snooping

            return messages.join('\n');
        } catch (e) {
            return null;
        }
    }

    static async write (userId: string, value: string): Promise<void> {
        try {
            const stream = await Snoop.open(userId, APPEND);
            await stream.addValue(value);
            await stream.closeLock();
        } catch (e) {
        }
    }
}

export default Snoop;
