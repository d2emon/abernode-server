import {listStream} from './blib';
import {setPronouns} from './pronouns';
import {Stream} from './stream';
import {
    canSeePlayer,
    Player,
} from '../models/player';

export interface MessageProcessorOptions {
    isBlind?: boolean;
    isDeaf?: boolean;
    isLogging?: boolean;
    isSnoopedBy?: string | null;
    newLine?: boolean; // false
    showCommands?: boolean;
    snoopedPlayerId?: number;
}

const isdark = (): boolean => false;
const fpbns = (name: string): Player | null => null;

export const showFile = (filename: string) => `[f file="${filename}" /]`;
export const sound = (name: string, message: string) => `[P name="${name}" /][d]${message}[/d]`;
export const visual = (name: string, message: string) => `[s name="${name}"]${message}[/s]`;
export const showPlayer = (name: string) => `[p name="${name}" /]`;
export const playerVisual = (name: string, message: string) => `[D name="${name}" /][c]${message}[/c]`;
export const userInput = (message: string) => `[l]${message}[/l]\n`;

// f: ifShowFile(input)
// P: ifHearPlayer(input)
// d: ifSound(input)
// s: ifVisual(input)
// p: ifShowPlayer(input)
// D: ifSeePlayer(input)
// c: ifPlayerVisual(input)
// l: ifUserInput(input)

const messageControl = (
    options: { [k: string]: number },
    control: (v: { [k: string]: string }, o: Stream) => Promise<any>,
) => async (values: { [k: string]: string }, charId: number, stream: Stream) => {
    const result: string[] = [];
    await control(values, stream);
    /*
    return {
        result,
        lastCharId,
    };
     */
    return result;

};

const playerName = async (
    name: string,
    user: Player | null,
    options: MessageProcessorOptions,
    show?: (o: MessageProcessorOptions) => boolean,
): Promise<string> => {
    if (show && !show(options)) {
        return '';
    }
    const player = await fpbns(name);
    if (canSeePlayer(user, player, options.isBlind)) {
        setPronouns(player);
        return name;
    } else {
        return 'Someone';
    }
}

const ifShowFile = (debugMode: boolean) => messageControl(
    { filename: 128 },
    async (values: {  [k: string]: string }, output: Stream) => {
        const { filename } = values;
        if (debugMode) {
            await output.addValue(`[FILE ${filename}]`);
        }
        await listStream(filename, output);
    },
);

const ifHearPlayer = (user: Player, options: MessageProcessorOptions) => messageControl(
    { name: 24 },
    async (values: {  [k: string]: string }, output: Stream) => output.addValue(await playerName(
        values.name,
        user,
        options,
        (o: MessageProcessorOptions) => o.isDeaf,
    )),
)

const ifSound = (user: Player, options: MessageProcessorOptions) => messageControl(
    { message: 256 },
    async (values: {  [k: string]: string }, output: Stream) => {
        if (options.isDeaf) {
            return;
        }
        await output.addValue(values.message);
    },
)

const ifVisual = (user: Player, options: MessageProcessorOptions) => messageControl(
    {
        name: 23,
        message: 256,
    },
    async (values: {  [k: string]: string }, output: Stream) => {
        const player = await fpbns(values.name);
        if (!canSeePlayer(user, player, options.isBlind)) {
            return;
        }
        setPronouns(player);
        await output.addValue(values.message);
    },
)

const ifShowPlayer = (user: Player, options: MessageProcessorOptions) => messageControl(
    { name: 24 },
    async (values: {  [k: string]: string }, output: Stream) => output.addValue(await playerName(
        values.name,
        user,
        options,
    )),
)

const ifSeePlayer = (user: Player, options: MessageProcessorOptions) => messageControl(
    { name: 24 },
    async (values: {  [k: string]: string }, output: Stream) => output.addValue(await playerName(
        values.name,
        user,
        options,
        (o: MessageProcessorOptions) => o.isBlind,
    )),
)

const ifPlayerVisual = (user: Player, options: MessageProcessorOptions) => messageControl(
    { message: 256 },
    async (values: {  [k: string]: string }, output: Stream) => {
        if (isdark() || options.isBlind) {
            return;
        }
        await output.addValue(values.message);
    },
)

const ifUserInput = (user: Player, options: MessageProcessorOptions) => messageControl(
    { action: 127 },
    async (values: {  [k: string]: string }, output: Stream) => {
        if (!options.showCommands) {
            return;
        }
        await output.addValue(values.action);
    },
)
