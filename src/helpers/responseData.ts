export type Errors = { [field: string]: string[] };

export interface ResponseData {
    result: number;
    errors: Errors;
    message: string;
}