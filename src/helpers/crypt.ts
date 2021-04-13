const SALT = 'XX';

export const encode = (value: string, salt: string): string => `${value}${salt}`;
