export interface UserPayload {
    email: string;
    roles: string[];
    orgs: OrgPayload[];
}

export interface OrgPayload {
    org_id: string;
    role: string;
}

export interface LoginResponse {
    id: string;
    email: string;
    idToken: string;
    expiresIn: number;
    refreshToken: string;
}
