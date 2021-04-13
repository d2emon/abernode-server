export type Fields = { [name: string]: any };
export type FieldErrors = { [name: string]: string[] };
export type Validator = (value: any) => string | undefined | Promise<string | undefined>;
export type ValidateFunction = (value: any) => Promise<string[]>;
export type Validators = { [name: string]: ValidateFunction };

export const validators = {
    maxLength: (message: string, length: number) => (value: string): string | undefined => {
        if (!value) {
            return undefined
        }
        if (value.length > length) {
            return message;
        }
        return undefined;
    },
    noChars: (message: string, restricted: string) => (value: string): string | undefined => {
        if (!value) {
            return undefined
        }
        for (let i = 0; i < restricted.length; i += 1) {
            if (value.indexOf(restricted[i]) >= 0) {
                return message
            }
        }
        return undefined;
    },
    required: (message: string) => (value: any): string | undefined => (!value ? message : undefined),
}

const validate = (validators: Validator[]): ValidateFunction => value => Promise
    .all(validators.map(validator => validator(value)))
    .then(errors => errors.filter(error => (error !== undefined)));

export default validate;

export const validationResult = (errors: FieldErrors): FieldErrors => Object.keys(errors).reduce(
    (result, field) => ({
        ...result,
        [field]: errors[field].length && errors[field],
    }),
    {}
);

export const validateFields = async (fields: Fields, validators: Validators): Promise<FieldErrors | null> => {
    const fieldErrors = Object.keys(fields).reduce(
        async (result, field) => {
            const validator = validators[field];
            if (!validator) {
                return result
            }
            const errors = await validator(fields[field]);
            if (!errors.length) {
                return result
            }
            return {
                ...result,
                [field]: errors,
            }
        },
        {},
    );
    return Object.keys(fieldErrors).length ? fieldErrors : null;
}
