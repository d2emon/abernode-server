import {PlayerFlags} from './player';
import {APPEND, READ_WRITE, Stream} from '../helpers/stream';

export interface UserData {
    name: string;
    score: number;
    strength: number;
    flags: PlayerFlags;
    level: number;
}

class UserStream extends Stream {
    private static async open (permissions: string = READ_WRITE): Promise<UserStream> {
        return await UserStream.openLock(
            'UAF_RAND',
            permissions,
            () => {
                throw new Error('Cannot access UAF');
            },
        ) as UserStream;
    }

    private async getUsers(): Promise<UserData[]> {
        return this.getStrings(1, user => user);
    }

    async find(name: string): Promise<UserData | null> {
        const users: UserData[] = await this.getUsers();
        const search = name.toLowerCase();
        return users.find((user: UserData) => (user.name.toLowerCase() === search));
    }

    async findAll(name: string): Promise<UserData[]> {
        const users: UserData[] = await this.getUsers();
        const search = name.toLowerCase();
        return users.filter((user: UserData) => (user.name.toLowerCase() === search));
    }

    static async findUser (name: string): Promise<UserData | null> {
        const stream = await UserStream.open();
        const user = await stream.find(name);
        await stream.closeLock();
        return user;
    }

    private async findUsers (name: string): Promise<UserData[]> {
        const users = await this.getUsers();
        const search = name.toLowerCase();
        return users.filter((user) => (user.name.toLowerCase() === search));
    }

    private static async getUser (name: string): Promise<UserStream> {
        const stream = await UserStream.open();
        const user = await stream.find(name);
        if (!user) {
            await stream.closeLock();
            return null;
        }
        return stream;
    }

    private static async findUserRecord (): Promise<UserStream> {
        const stream = await UserStream.open();
        const user = await stream.find('');
        return user ? stream : await UserStream.open(APPEND);
    }

    private static async getUserPosition (name: string): Promise<UserStream> {
        const stream = await UserStream.open();
        const users = await stream.findUsers(name);
        return users.length ? stream : await UserStream.findUserRecord();
    }

    static async saveUser (user: UserData): Promise<UserData> {
        try {
            // await Messages.addUserMessage(user, `\nSaving ${user.name}\n`)

            const stream = await UserStream.getUserPosition(user.name);
            await stream.addValue(user);
            await stream.closeLock();

            return user;
        } catch (e) {
            // Truncate stream
            throw new Error('Save Failed - Device Full?');
        }
    }

    static async deleteUser (name: string): Promise<void> {
        try {
            const stream = await UserStream.open();
            const users = await stream.findUsers(name);
            await Promise.all(users.map((user: UserData) => {
                if (name.toLowerCase() !== user.name.toLowerCase()) {
                    throw new Error('Panic: Invalid Persona Delete');
                }
                return stream.addValue({
                    ...user,
                    name: '',
                    level: -1,
                });
            }));
            await stream.closeLock();
        } catch (e) {
        }
    }
}

export default UserStream;
