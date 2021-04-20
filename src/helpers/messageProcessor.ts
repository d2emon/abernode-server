import {listStream} from './blib';
import {
    Player,
} from '../models/player';
import {userCanSee} from "./unprocessed/weather";
import World from "./unprocessed/opensys";

export interface MessageProcessorOptions {
    isBlind?: boolean;
    isDeaf?: boolean;
    isLogging?: boolean;
    isSnoopedBy?: string | null;
    newLine?: boolean; // false
    showCommands?: boolean;
    snoopedPlayerId?: number;
}

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
    control: (v: { [k: string]: string }, w: World) => Promise<any>,
) => async (values: { [k: string]: string }, charId: number, world: World) => {
    return await control(values, world);
    /*
    return {
        result,
        lastCharId,
    };
     */

};

const visiblePlayer = async (
    world: World,
    user: Player,
    name: string,
    options: MessageProcessorOptions,
    callback?: (p: Player | null) => string,
): Promise<string> => {
    const player = await world.findVisiblePlayerByName(name, user, options.isBlind);
    if (player) {
        return callback ? callback(player) : player.name;
    } else {
        return callback ? callback(null) : 'Someone';
    }
}

const ifShowFile = (debugMode: boolean) => messageControl(
    { filename: 128 },
    async (values: {  [k: string]: string }) => {
        const { filename } = values;
        const result: string[] = [];
        if (debugMode) {
            result.push(`[FILE ${filename}]`);
        }
        const text = await listStream(filename);
        return result.join('\n') + text.join('\n');
    },
);

const ifHearPlayer = (user: Player, options: MessageProcessorOptions) => messageControl(
    { name: 24 },
    async (values: {  [k: string]: string }, world: World) => (!options.isDeaf) && await visiblePlayer(
        world,
        user,
        values.name,
        options,
    ),
)

const ifSound = (user: Player, options: MessageProcessorOptions) => messageControl(
    { message: 256 },
    async (values: {  [k: string]: string }) => !options.isDeaf && values.message,
)

const ifVisual = (user: Player, options: MessageProcessorOptions) => messageControl(
    {
        name: 23,
        message: 256,
    },
    async (values: {  [k: string]: string }, world: World) => await visiblePlayer(
        world,
        user,
        values.name,
        options,
        (player: Player) => (player ? values.message : ''),
    ),
)

const ifShowPlayer = (user: Player, options: MessageProcessorOptions) => messageControl(
    { name: 24 },
    async (values: {  [k: string]: string }, world: World) => await visiblePlayer(
        world,
        user,
        values.name,
        options,
    ),
)

const ifSeePlayer = (user: Player, options: MessageProcessorOptions) => messageControl(
    { name: 24 },
    async (values: {  [k: string]: string }, world: World) => (!options.isBlind) && await visiblePlayer(
        world,
        user,
        values.name,
        options,
    ),
)

const ifPlayerVisual = (user: Player, options: MessageProcessorOptions) => messageControl(
    { message: 256 },
    async (values: {  [k: string]: string }) => !options.isBlind && await userCanSee(user) && values.message,
)

const ifUserInput = (user: Player, options: MessageProcessorOptions) => messageControl(
    { action: 127 },
    async (values: {  [k: string]: string }) => options.showCommands && values.action,
)
