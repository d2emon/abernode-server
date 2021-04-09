import {
    encode,
} from './crypt';
import {
    Stream
} from './stream';
import {
    getPassword,
    getUser,
    getUserId,
} from './user';

const SALT = 'XX';

// lowercase(str) => str.toLowerCase()
// uppercase(str) => str.toUpperCase()
// trim(str) => str.trim()
// any(ch, str) => str.indexOf(ch)

export const getEncodedPassword = async (): Promise<string> => getPassword()
    .then(value => encode(value, SALT));
export const parseUsername = (input: string): string => input.trim();
export const parseUserData = (input: string) => {
    const data = input.split('.');
    return {
        username: (data.length > 0) && data[0],
        password: (data.length > 1) && data[1],
    };
}
export const parseObjectData = (input: string) => {
    const data = input.split(':');
    return [
        (data.length > 0) && data[0],
        (data.length > 1) && data[1],
        (data.length > 2) && data[2],
    ];
}

// addchar(str, ch) => str + ch
// numarg(str) => parseInt(str, 10)

export const listStream = async (name: string, dest: Stream): Promise<void> => {
    const a: Stream = new Stream(name, 'r');
    await a.load(() => { throw new Error(`[Cannot find file -> ${name}]`) });
    await a.getStrings(127, dest.addValue);
}
export const readData = (src: Stream, pos: number, len: number): Promise<any> => src
    .setPos(pos * 64 * 4)
    .then(() => src.getValue(len * 4));
export const writeData = (dst: Stream, block: any, pos: number, len: number): Promise<any> => dst
    .setPos(pos * 64 * 4)
    .then(() => dst.setValue(len * 4));
export const getUserName = () => getUser(getUserId()).name;
