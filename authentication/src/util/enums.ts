export enum UserRoles {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum OrgRoles {
    OWNER = "OWNER",
    MODERATOR = "MODERATOR",
    MEMBER = "MEMBER",
}

export enum Cookies {
    JWT = "jwt",
    REFRESH_TOKEN = "refresh_token",
}

export enum RequestKeys {
    answer = "answer",
    contact_email = "contact_email",
    contact_phone = "contact_phone",
    email = "email",
    emails = "emails",
    first_name = "first_name",
    last_name = "last_name",
    name = "name",
    org_id = "org_id",
    password = "password",
    remove = "remove",
    role = "role",
    user_id = "user_id",
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    FOUND = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export enum HttpErrMsg {
    DUPLICATE_ENTRIES = "Duplicate entries not allowed",
    BAD_CREDENTIALS = "Email or password is incorrect.",
    EMAIL_IN_USE = "Email address is already in use",
    ILLEGAL_ARGUMENT = "One or more illegal properties was found in the request body",
    INTERNAL_ERROR = "An error occurred. Please try again later",
    INVALID_EMAIL = "No valid email address was not provided",
    INVALID_REFRESH_TOKEN = "No valid refresh token was provided",
    INVALID_TYPE = "One or more properties in the request body was not of the expected type",
    INVALID_QUERY = "Invalid query parameters",
    MISSING_REQUIRED_FIELDS = "The request body does not contain all required fields",
    ORG_NAME_IN_USE = "Organization name is unavailable",
    PASSWORD_TOO_SHORT = "Password needs to be at least 6 characters long",
    PERMISSION_DENIED = "The user does not have permission to perform this action",
    RESOURCE_NOT_FOUND = "The requested resource was not found",
    UNAUTHORIZED = "Unauthorized",
    USER_DISABLED = "This account is disabled",
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
