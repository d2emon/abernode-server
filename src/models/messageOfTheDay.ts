import {
    READ_ONLY,
    Stream,
} from '../helpers/stream';

const STREAM_NAME = 'MOTD';

class MessageOfTheDay {
    private data: string = '';

    constructor() {
        this.data = '';
    }

    async load() {
        try {
            this.data = await Stream.getContent(STREAM_NAME, READ_ONLY);
        } catch (e) {
            this.data = `[Cannot Find -> ${STREAM_NAME}]`;
        }
    }

    getMessage(): string {
        return this.data;
    }
}

export default MessageOfTheDay;
