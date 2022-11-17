export enum UserRoles {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    FOUND = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    ERROR = 500
}

export enum HttpErrMsg {
    MISSING_CREDENTIALS = "Email or password was not provided.",
    BAD_CREDENTIALS = "Email or password is incorrect.",
    USER_DISABLED = "This account is disabled",
}

export enum ErrMsg {
    MISSING_ENV = "Missing Environment Variable:",
    INIT_DB_FAIL = "An error occurred while populating the database with default values.",
}

export enum Warnings {
    MISSING_PRIVATE_KEY = "Warning: No keyfile found for private.pem",
    MISSING_PUBLIC_KEY = "Warning: No keyfile found for public.pem",
}
