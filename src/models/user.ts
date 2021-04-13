import {
    APPEND,
    READ_ONLY,
    READ_WRITE,
    WRITE,
    Stream,
} from '../helpers/stream';
import validate, {
    FieldErrors,
    ValidateFunction,
    validators,
    validateFields, Validator,
} from '../helpers/validate';
import Item from "./item";

const USERS_STREAM = 'PFL';
const TEMP_STREAM = 'PFT';

const open = async (permissions: string): Promise<Stream> => {
    try {
        return await Stream.openLock(
            USERS_STREAM,
            permissions,
            () => { throw new Error(); },
        );
    } catch (e) {
        throw new Error('No persona file');
    }
}

const withStream = async (permissions: string, callback: (stream: Stream) => any) => {
    const stream = await open(permissions);
    const result = await callback(stream);
    await stream.close();
    return result;
};

export interface UserData {
    username: string;
    password: string;
}

/**
 * Check for legality of names
 */
const validateUsername = (message: string): Validator => value => {
    if (!value) {
        return undefined;
    }

    const username = value.toLowerCase();

    for (let i = 0; i < username.length; i += 1) {
        if ((username[i] < 'a') || (username[i] > 'z')) {
            return message;
        }
    }

    return undefined;
}

const validateReserved = (message: string): Validator => value => {
    if (!value) {
        return undefined
    }
    if (User.reservedWords.indexOf(value.toLowerCase()) >= 0) {
        return message;
    }
    return undefined;
}

const validateUnique = (message: string) => async (value: string) => {
    if (!value) {
        return undefined
    }
    if (await Item.findByName(value)) {
        return message;
    }
    return undefined;
}


class User {
    username: string;

    private readonly password: string;


    static reservedWords = [
        'the',
        'me',
        'myself',
        'it',
        'them',
        'him',
        'her',
        'someone',
        'there',
    ];

    constructor(data: UserData) {
        this.username = data.username.trim();
        this.password = data.password;
    }

    private static async validateUsername (value: string): Promise<string[]> {
        return validate([
            validators.required('ERROR'),
            validateUsername('ERROR'),
            validators.noChars('Illegal characters in user name', '. '),
            validateReserved('Sorry I cant call you that'),
            validators.maxLength('ERROR', 10),
            validateUnique('I can\'t call you that , It would be confused with an object'),
        ])(value);
    }

    private static async validatePassword (value: string): Promise<string[]> {
        return validate([
            validators.required('ERROR'),
            validators.noChars('Illegal character in password', '.,'),
        ])(value);
    }

    private encrypt (): string {
        return `${this.username}.${this.password}....`;
    }

    private static decrypt (value: string): User {
        return new User({
            username: value,
            password: value,
        });
    }

    private static async copyStream(src: string, dst: string, condition: (user: User) => boolean): Promise<void> {
        const input = await Stream.openLock(
            src,
            READ_WRITE,
            () => { throw new Error(); },
        );
        const output = await Stream.openLock(
            dst,
            WRITE,
            () => { throw new Error(); },
        );

        await input.getStrings(128, (value) => {
            if (condition(User.decrypt(value))) {
                return output.addValue(value);
            }
        })

        await output.close();
        await input.close();
    }

    private static async removeUser(username: string): Promise<void> {
        const search = username.toLowerCase();
        await User.copyStream(
            USERS_STREAM,
            TEMP_STREAM,
            user => (user.username.toLowerCase() !== search),
        );
        await User.copyStream(
            TEMP_STREAM,
            USERS_STREAM,
            () => true,
        );
    }

    /**
     * Main login code
     */
    checkPassword(password: string): boolean {
        return password === this.password;
    }

    static async findByName(username: string): Promise<User | null> {
        const search = username.toLowerCase().trim();
        return await withStream(
            READ_ONLY,
            async (stream) => {
                const data = await stream.getStrings(255, User.decrypt);
                return data.find((user) => (search === user.username.toLowerCase()))
            },
        );
    }

    async remove(): Promise<void> {
        await User.removeUser(this.username);
    }

    private async addUser(): Promise<void> {
        await withStream(
            APPEND,
            (stream) => stream.addValue(this.encrypt()),
        );
    }

    async save (): Promise<FieldErrors | null> {
        const fieldErrors: FieldErrors | null = await validateFields(
            {
                username: this.username,
                password: this.password,
            },
            {
                username: User.validateUsername,
                password: User.validatePassword,
            },
        );
        if (fieldErrors) {
            return fieldErrors;
        }
        await this.addUser();
        return null;
    }

    async update(username: string): Promise<FieldErrors> {
        await User.removeUser(username);
        return await this.save();
    }

    async changePassword(oldPassword: string, newPassword: string, verifyPassword: string): Promise<FieldErrors> {
        const validateOldPassword: ValidateFunction = validate([
            (value: string): string | undefined => {
                if (!value) {
                    return undefined;
                }
                if (!this.checkPassword(value)) {
                    return 'Incorrect Password';
                }
                return undefined;
            },
        ]);
        const validateVerifyPassword: ValidateFunction = validate([
            (value: string): string | undefined => {
                if (!value) {
                    return undefined;
                }
                if (verifyPassword !== newPassword) {
                    return 'NO!';
                }
                return undefined;
            },
        ]);

        const fieldErrors: FieldErrors | null = await validateFields(
            {
                oldPassword,
                newPassword,
                verifyPassword,
            },
            {
                oldPassword: validateOldPassword,
                newPassword: User.validatePassword,
                verifyPassword: validateVerifyPassword,
            },
        );
        if (fieldErrors) {
            return fieldErrors;
        }

        const user = new User({
            username: this.username,
            password: newPassword,
        })
        return user.update(this.username);
    }

    getData(): UserData {
        return {
            username: this.username,
            password: this.password,
        };
    }
}

export default User;
