import {
    Stream
} from './stream';

export const defaultStream: Stream = new Stream('', '');

/**
 * Getstr() with length limit and filter ctrl
 * @param prompt
 * @param maxLength
 */
export const getFromKeyboard = async (prompt: string, maxLength: number): Promise<string> => {
    await defaultStream.addValue(prompt);
    return  await defaultStream.getString(maxLength);
    // Remove special symbols
}
