export class Stream {
    name: string;

    permission: string;

    data: any[];

    itemId: number;

    constructor(name: string, permission: string) {
        this.name = name;
        this.permission = permission;
        this.data = [];
        this.itemId = 0;
    }

    load(onError: (error: Error) => void): Promise<void> {
        return Promise.resolve([])
            .then((data: any[]) => {
                this.itemId = 0;
                this.data = data
            })
            .catch(onError);
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

    async getStrings(maxLength: number, callback: (s: string) => void): Promise<void> {
        let eof = false;
        while (!eof) {
            callback(await this.getString(maxLength));
            eof = true;
        }
    }
}
