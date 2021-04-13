import {
    Stream,
} from './stream';

export const time = (): number => 0;

/**
 * Transform seconds to text
 * @param seconds
 */
const stringifyTime = (seconds: number): string => {
    const getHours = (seconds: number): string => {
        const hours = seconds / 3600;
        return (hours >= 2)
            ? '1 hour'
            : `${hours} hours`;
    }

    const getMinutes = (seconds: number): string => {
        const minutes = (seconds / 60) % 60;
        return (minutes === 1)
            ? '1 minute'
            : `${minutes} minutes.`;
    }

    const getSeconds = (seconds: number): string => {
        const secondsLeft = seconds % 60;
        return (secondsLeft === 1)
            ? '1 second'
            : `${secondsLeft} seconds`;
    }

    if (seconds > 24 * 60 * 60) {
        return 'Over a day!!!';
    } else if (seconds < 61) {
        return  `${getSeconds(seconds)}.`;
    } else if (seconds === 60) {
        return '1 minute.';
    } else if (seconds < 120) {
        return `1 minute and ${getSeconds(seconds)}.`;
    } else if ((seconds / 60) === 60) {
        return  '1 hour.';
    } else if (seconds < 3600) {
        return `${seconds / 60} minutes and ${getSeconds(seconds)}.`;
    } else {
        return `${getHours(seconds)} and ${getMinutes(seconds)}.`;
    }
};

/**
 * Check for all the created at stuff
 *
 * We use stats for this which is a UN*X system call
 */
export const getCreatedTime = async (): Promise<string> => {
    try {
        const stream = new Stream(process.env.EXE, '');
        await stream.load(() => {});
        const streamTime = await stream.getTime();
        await stream.close();

        return `This AberMUD was created: ${streamTime}`;
    } catch (e) {
        return `This AberMUD was created: &lt;unknown&gt;`;
    }
};

export const getStartedAt = async (): Promise<string> => {
    try {
        const a = new Stream(process.env.RESET_N, 'r');
        await a.load(() => { throw new Error('AberMUD has yet to ever start!!!'); });
        const startedAt = await a.getNumber();
        await a.close();
        return `Game time elapsed: ${stringifyTime(time() - startedAt)}`;
    } catch (e) {
        return e;
    }
};
