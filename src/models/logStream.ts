import {
    APPEND,
    WRITE,
    Stream,
} from '../helpers/stream';

class LogStream extends Stream {
    private static readonly STREAM_NAME = 'mud_log';

    private static stream: Stream | null = null;

    static isActive (): boolean {
        return !!LogStream.stream;
    }

    static async open (): Promise<void> {
        let stream = new Stream(LogStream.STREAM_NAME, APPEND);
        await stream.load(async () => {
            stream = new Stream(LogStream.STREAM_NAME, WRITE);
            await stream.load(() => {
                throw new Error('Cannot open log file mud_log');
            });
        });
        LogStream.stream = stream;
    }

    static async close (): Promise<void> {
        await LogStream.stream.close();
        LogStream.stream = null;
    }

    static async log (message: string) {
        if (!LogStream.isActive()) {
            return;
        }
        await LogStream.stream.addValue(message);
    }

    static async logBuffer (message: string): Promise<void> {
        if (!LogStream.isActive()) {
            return;
        }
        await LogStream.stream.addValue(message);
    }
}

export default LogStream;
