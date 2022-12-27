import type {User, UserRole, OrgUser, EOrgRole} from "@prisma/client";
import type {JwtPayload} from "jsonwebtoken";

// ===== Types ===== //

type UserOrgs = { org_id: string, role: EOrgRole }[]


// ===== User Interfaces ===== //

export interface UserInfo extends User {
    roles?: UserRole[];
    orgs?: OrgUser[]
}

export interface AuthUser {
    id: string;
    email: string;
    roles: string[];
    orgs: { org_id: string, role: EOrgRole }[]
}

// ===== Request/Response body definitions ===== //

export interface UserRequestBody {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

export interface OrgRequestBody {
    name: string;
    contact_email: string;
    contact_phone?: string;
}

export interface InviteResponseBody {
    alreadyJoined?: string[];
    invalid?: string[];
    invited?: string[];
    tooEarly?: string[];
}

// ===== DB Interfaces ===== //

export interface Project {
    id?: string;
    organization_id: string;
    name: string;
    description: string;
    type: string; // TODO: Define project types
    project_data?: object;
    created_at?: number;
    updated_at?: number;
    status: string; // TODO: Define project status
    enabled?: boolean;
    start_date?: number;
    end_date?: number;
    members?: string[]
}

// ===== JWT Payloads ===== //

export interface JwtUserPayload extends JwtPayload{
    email: string;
    roles: UserRole["name"][];
    orgs: UserOrgs
}

export interface RefreshTokenPayload extends JwtPayload {
    token: string; // should be unique
}

// ===== WFS/XML/GEOJSON ===== //

export interface Feature {
    properties: {
        project_id: string;
        id: number;
        ogc_fid: number;
        ogr_fid: number;
        navn?: string;
        name?: string;
        checked: boolean;
        result?: string;
    };
    geometry: {
        type: string;
        coordinates: [ [number, number][] ],
    }
}
