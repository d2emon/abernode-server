export interface UserData {
    userId: string;
    name: string;
}

export const getUser = (userId: string): UserData => ({
    userId,
    name: '',
});
export const getUserId = (): string => '';
export const getPassword = (): Promise<string> => Promise.resolve('');
