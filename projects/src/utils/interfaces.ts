// ===== Module declarations ===== //

declare module "express-serve-static-core" {
    interface Request {
        user: {
            id: string,
            email: string,
            roles: string[],
            orgs: { org_id: string, role: string }[],
        }
    }
}

export interface AuthUser {
    id: string;
    email: string;
    roles: string[];
    orgs: { org_id: string, role: string }[]
}

export interface Project {
    id?: string;
    organization_id: string;
    name: string;
    description: string;
    type: string; // TODO: Define project types
    project_data?: object;
    created_at?: Number;
    updated_at?: Number;
    status: string; // TODO: Define project status
    start_date?: Number;
    end_date?: Number;
    members?: string[]
}
