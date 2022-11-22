import {User, UserRole} from "@prisma/client";
import {UserRoles} from "./enums";

export interface UserWithRoles extends User {
    roles?: UserRole[];
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface JwtUserPayload {
    id: string;
    email: string;
    roles: UserRole["name"][];
}

export interface RefreshTokenPayload {
    id: string;
}
