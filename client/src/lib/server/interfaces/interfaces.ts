export interface UserPayload {
    email: string;
    roles: string[];
    orgs: OrgPayload[];
}

export interface OrgPayload {
    org_id: string;
    role: string;
}
