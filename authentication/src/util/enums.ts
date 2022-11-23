export enum UserRoles {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum Cookies {
    JWT = "jwt",
    REFRESH_TOKEN = "refresh_token",
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    FOUND = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export enum HttpErrMsg {
    MISSING_CREDENTIALS = "Email or password was not provided.",
    BAD_CREDENTIALS = "Email or password is incorrect.",
    USER_DISABLED = "This account is disabled",
    EMAIL_IN_USE = "Email address is already in use",
    INVALID_EMAIL = "A valid email address was not provided",
    PASSWORD_TOO_SHORT = "Password needs to be at least 6 characters long",
    INTERNAL_ERROR = "An error occurred. Please try again later",
    INVALID_REFRESH_TOKEN = "No valid refresh token was provided",
    RESOURCE_NOT_FOUND = "The requested resource was not found",
}

export enum ErrMsg {
    MISSING_ENV = "Missing Environment Variable:",
    INIT_DB_FAIL = "An error occurred while populating the database with default values.",
}

export enum Warnings {
    MISSING_PRIVATE_JWT_KEY = "Warning: No keyfile found for private-jwt.pem",
    MISSING_PUBLIC_JWT_KEY = "Warning: No keyfile found for public-jwt.pem",
    MISSING_PRIVATE_REF_KEY = "Warning: No keyfile found for private-ref.pem",
    MISSING_PUBLIC_REF_KEY = "Warning: No keyfile found for public-ref.pem",
}
