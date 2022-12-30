import type {User, UserRole, OrgUser, EOrgRole} from "@prisma/client";
import type {JwtPayload} from "jsonwebtoken";
import type {ProjectStatus, ProjectType} from "$lib/server/util/enums";

// ===== Types ===== //

type UserOrgs = { org_id: string, role: EOrgRole }[]


// ===== User Interfaces ===== //

export interface UserInfo extends User {
    roles?: UserRole[];
    orgs?:  OrgUser[]
}

export interface AuthUser {
    id:     string;
    email:  string;
    roles:  string[];
    orgs:   { org_id: string, role: EOrgRole }[]
}

// ===== Request/Response body definitions ===== //

export interface UserRequestBody {
    email:       string;
    password:    string;
    first_name?: string;
    last_name?:  string;
}

export interface OrgRequestBody {
    name:           string;
    contact_email:  string;
    contact_phone?: string;
}

export interface InviteResponseBody {
    alreadyJoined?: string[];
    invalid?:       string[];
    invited?:       string[];
    tooEarly?:      string[];
}

// ===== DB Interfaces ===== //

export interface Project {
    id?:             string;
    organization_id: string;
    name:            string;
    description:     string;
    type:            ProjectType;
    created_at?:     number;
    updated_at?:     number;
    status:          ProjectStatus; // TODO: Define project status
    enabled?:        boolean;
    members?:        string[]
}

export interface FeatureClone {
    fid:         string;
    checked:     boolean;
    project_id:  string;
    accessed_at: Date;
    accessed_by: string;
}

// ===== JWT Payloads ===== //

export interface JwtUserPayload extends JwtPayload{
    email: string;
    roles: UserRole["name"][];
    orgs:  UserOrgs
}

export interface RefreshTokenPayload extends JwtPayload {
    token: string; // should be unique
}

// ===== WFS/XML/GEOJSON ===== //

export interface Feature {
    geometry: {
        type:        string;
        coordinates: [ [number, number][] ],
    };
    properties: {
        project_id: string;
        id:         number;
        ogc_fid:    number;
        ogr_fid:    number;
        navn?:      string;
        name?:      string;
        checked:    boolean;
        result?:    string;
    };
}

export interface CommentFeature {
    name: string;
    status: string;
    org_proj: string;
    description: string;
    action: string;
    reported_by: string;
    feature: {
        values_: {
            geometry: {
                flatCoordinates: number[];
            }
        }
    }
}
