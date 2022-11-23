import {User, UserRole} from "@prisma/client";
import {UserRoles} from "./enums";
import {Request} from "express";

declare module "express-serve-static-core" {
    interface Request {
        user: {
            id: string,
            email: string,
            roles: string[],
        }
    }
}

export interface UserWithRoles extends User {
    roles?: UserRole[];
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface OrgRequestBody {
    name: string;
    contact_email: string;
    contact_phone?: string;
}

export interface JwtUserPayload {
    id: string;
    email: string;
    roles: UserRole["name"][];
}

export interface RefreshTokenPayload {
    id: string;
}
