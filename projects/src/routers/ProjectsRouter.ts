import { Router } from 'express';
import db from '../database/DatabaseGateway.js';
import {StatusCode} from "../utils/enums.js";

const router = Router();

/*
 * Get all projects for a logged-in user
 */
router.get('/', async (req, res) => {
    const projects = await db.projects.findAllByUser_id(req.user.id);
    res.send({ data: projects });
});

/*
 * Get project by id
 */
router.get('/:project_id', async (req, res) => {
    const project_id = req.params.project_id;

    const project = await db.projects.findById(project_id);

    if (!project) {
        res.status(StatusCode.NOT_FOUND).send({});
        return;
    }

    const isMember = req.user.orgs.find(o => o.org_id === project.organization_id);
    if (!isMember) {
        res.status(StatusCode.UNAUTHORIZED).send({ message: "You are not a member of this org"});
        return;
    }

    res.send({data: project});
});

/*
 * Get all projects for an organization
 */
router.get('/org/:org_id', async (req, res) => {
    const org_id = req.params.org_id;

    const isMember = req.user.orgs.find(org => org.org_id === org_id);
    if (!isMember) {
        res.status(StatusCode.UNAUTHORIZED).send({ message: "You are not a member of this org"});
        return;
    }

    const projects = await db.projects.findAllByOrg_id(org_id);
    res.send({data: projects});
});

/*
 * Create new project
 */
router.post('/', async (req, res) => {
    const { organization_id, name, status, description, start_date, end_date, type } = req.body;

    // Verify Request data
    if (
        !organization_id || typeof organization_id !== "string" ||
        !name            || typeof name !== "string" ||
        !description     || typeof description !== "string" ||
        !status          || typeof status !== "string" ||
        !type            || typeof type !== "string" ||
        (start_date && typeof start_date !== "number") ||
        (end_date && typeof end_date !== "number")
    ) {
        res.status(StatusCode.BAD_REQUEST).send({ message: "Bad Request" });
        return;
    }

    const isMember = req.user.orgs.find(org => {
        return org.org_id === organization_id && (org.role === "OWNER" || org.role === "MODERATOR");
    });

    // Authorize Organization and Org Role
    if (!isMember) {
        res.status(StatusCode.UNAUTHORIZED).send({message: "You are not OWNER or MODERATOR in this organization"});
        return;
    }

    const data = {
        organization_id, name, description, status, type, start_date, end_date, members: []
    }

    const project = await db.projects.create(data);

    res.send({data: project});
});

/*
 * Organization member can use this endpoint to join a project
 */
router.put('/join', async (req, res) => {
    const { project_id } = req.body;

    if (!project_id || typeof project_id !== "string") {
        res.status(StatusCode.BAD_REQUEST).send({});
        return;
    }

    const project = await db.projects.join(project_id, req.user);

    // Can both mean the project was not found or the user is no a member of the org
    if (!project) {
        res.status(StatusCode.NOT_FOUND).send({});
        return;
    }

    res.send({ data: project });
});

/*
 * Delete project (Organization OWNER only)
 */
router.delete('/', async (req, res) => {
    const { project_id } = req.body;

    if (!project_id || typeof project_id !== "string") {
        res.status(StatusCode.BAD_REQUEST).send({ project_id, isBob: typeof project_id !== "string"});
        return;
    }

    const owner_orgs = req.user.orgs
        .filter(o => o.role === 'OWNER')
        .map(o => o.org_id);

    const deleted = await db.projects.delete(project_id, owner_orgs);

    res.status(deleted?.deletedCount ? StatusCode.NO_CONTENT : StatusCode.FORBIDDEN).send();
});

export default router;
