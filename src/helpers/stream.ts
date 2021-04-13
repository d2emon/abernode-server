export const LOCK_EX = 'LOCK_EX';
export const LOCK_UN = 'LOCK_UN';

export const READ_ONLY = 'r';
export const READ_WRITE = 'r+';
export const WRITE = 'w';
export const APPEND = 'a';

export class Stream {
    name: string;

    permission: string;

    data: any[];

    itemId: number;

    lockId: string;

    time: number;

    constructor(name: string, permission: string) {
        this.name = name;
        this.permission = permission;
        this.data = [];
        this.itemId = 0;
        this.lockId = LOCK_UN;
        this.time = 0;
    }

    load(onError: (error: Error) => void): Promise<void> {
        return Promise.resolve([])
            .then((data: any[]) => {
                this.itemId = 0;
                this.data = data
            })
            .catch(onError);
    }

    close(): Promise<void> {
        return Promise.resolve()
            .then(() => {
                this.itemId = 0;
                this.data = [];
            });
    }

    setPos(pos: number): Promise<void> {
        this.itemId = pos;
        return Promise.resolve();
    }

    addValue(value: any): Promise<number> {
        return Promise.resolve(value)
            .then(this.data.push);
    }

    getValue(maxLength: number): Promise<any> {
        return Promise.resolve(this.data[this.itemId]);
    }

    setValue(maxLength: number): Promise<any> {
        return Promise.resolve(this.data[this.itemId]);
    }

    getString(maxLength: number): Promise<string> {
        return this.getValue(maxLength || 255);
    }

    getNumber(): Promise<number> {
        return this.getValue(255)
            .then(() => 0);
    }

    async getStrings(maxLength: number, callback: (s: string) => any): Promise<any[]> {
        const results = [];
        let eof = false;
        while (!eof) {
            results.push(callback(await this.getString(maxLength)));
            eof = true;
        }
        return results;
    }

    async lock(lockId: string): Promise<void> {
        this.lockId = lockId;
    }


    static async openLock (name: string, permissions: string, onError: () => void): Promise<Stream> {
        const stream: Stream = new Stream(name, permissions);
        await stream.load(onError);
        // NOTE: Always open with R or r+ or w
        await stream.lock(LOCK_EX);
        return stream;
    }

    async closeLock(): Promise<void> {
        await this.lock(LOCK_UN);
        await this.close();
    }

    static async getContent(name: string, permissions: string) {
        const stream = new Stream(name, permissions);
        await stream.load(() => { throw new Error(); });
        const messages: string[] = await stream.getStrings(128, s => s);
        await stream.close();
        return messages.join('\n');
    }

    async getTime(): Promise<number> {
        return this.time;
    }
}
