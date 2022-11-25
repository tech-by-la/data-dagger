import {User, UserRole, OrgUser, EOrgRole} from "@prisma/client";
import {RequestKeys, UserRoles} from "./enums";
import {Request} from "express";

// ===== Module declarations ===== //

declare module "express-serve-static-core" {
    interface Request {
        user: {
            id: string,
            email: string,
            roles: string[],
            orgs: UserOrgs
        }
    }
}


// ===== Types ===== //

type UserOrgs = { org_id: string, role: EOrgRole }[]


// ===== User Interfaces ===== //

export interface UserInfo extends User {
    roles?: UserRole[];
    orgs?: OrgUser[]
}


// ===== Request/Response body definitions ===== //

export interface UserRequestBody {
    email: string;
    password: string;
}

export interface OrgRequestBody {
    name: string;
    contact_email: string;
    contact_phone?: string;
}

export interface InviteRequestBody {
    org_id: string;
    emails: string[];
}

export interface InviteResponseBody {
    alreadyJoined?: string[];
    invalid?: string[];
    invited?: string[];
    tooEarly?: string[];
}


// ===== JWT Payloads ===== //

export interface JwtUserPayload {
    email: string;
    roles: UserRole["name"][];
    orgs: UserOrgs
}

export interface RefreshTokenPayload {
    token: string; // should be unique
}
