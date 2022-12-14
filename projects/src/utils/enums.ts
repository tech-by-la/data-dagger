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

export enum ProjectStatus {
    PENDING = 'pending',
    READY = 'ready',
    ACTIVE = 'active',
    FINISHED = 'finished',
    ARCHIVED = 'archived',
}
