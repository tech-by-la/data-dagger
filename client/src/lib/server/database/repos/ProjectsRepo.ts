import type { Project} from "$lib/server/util/interfaces";
import mongoose, {
    type SchemaDefinition,
    type SchemaDefinitionType,
    type Connection, Schema
} from "mongoose";
import Logger from "$lib/server/util/Logger";
import {ProjectStatus} from "$lib/server/util/enums";

const {Types: {ObjectId}} = mongoose;

export default class ProjectsRepo {

    private readonly db: Connection;

    private readonly model;

    constructor(db: Connection) {
        this.db = db;

        const ProjectSchema = new Schema(projectsDefinition, {
            versionKey: false,
            timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', currentTime: Date.now },
            minimize: false,
            strict: true,
            toObject: {
                transform: (doc, ret) => {
                    ret.id = ret._id.toHexString();
                    delete ret._id;
                }
            }
        });

        this.model = this.db.model('Project', ProjectSchema);
    }

    /*
     * ADMIN FUNCTION ONLY!
     */
    public async all() {
        return await this.model.find()
            .then(result => result.map(p => p.toObject()));
    }

    public async count() {
        return await this.model.count();
    }

    public async countbyOrg(organization_id: string) {
        return await this.model.count({ organization_id, enabled: true });
    }

    /*
     * ADMIN FUNCTION ONLY! Use findEnabledById instead
     */
    public async findById(_id: string) {
        if (!ObjectId.isValid(_id)) return
        return await this.model.findOne({ _id });
    }

    public async findEnabledById(_id: string) {
        if (!ObjectId.isValid(_id)) return
        return await this.model.findOne({ _id, enabled: true })
            .then(project => project?.toObject() as Project)
            .catch();
    }

    public async findAllByUser_id(user_id: string) {
        return await this.model.find({ members: user_id, enabled: true })
            .then(result => result.map(p => p.toObject()));
    }

    public async findAllByOrg_id(organization_id: string) {
        return await this.model.find({ organization_id, enabled: true })
            .then(result => result.map(p => p.toObject()));
    }

    public async create(data: Project) {
        try {
            return await this.model.create({
                organization_id: data.organization_id,
                name: data.name,
                description: data.description,
                type: data.type,
                status: data.status,
                project_data: null, // TODO: implement project data
                members: data.members,
            });
        } catch (err) {
            Logger.error("CreateProjectError", err);
        }
    }

    public async update(data: typeof projectsDefinition) {
        try {
            return await this.model.updateOne({ _id: data.id }, {
                $set: {
                    name: data.name,
                    description: data.description,
                    type: data.type,
                    status: data.status,
                    enabled: data.enabled,
                    members: data.members,
                }
            });
        } catch (err) {
            Logger.error("UpdateProjectError:", err);
        }
    }

    public async join(_id: string, user_id: string) {
        if (!ObjectId.isValid(_id)) return
        return await this.model.updateOne({ _id }, { $push: { members: user_id }});
    }

    public async leave(_id: string, user_id: string) {
        if (!ObjectId.isValid(_id)) return
        return await this.model.updateOne({ _id }, { $pull: { members: user_id }});
    }

    public async delete(project_id: string, owner_orgs: string[]) {
        try {
            return await this.model.deleteOne({
                $and: [
                    {_id: project_id},
                    {organization_id: { $in: owner_orgs }}
                ]
            });
        } catch (err) {
            Logger.error("DeleteProjectError:", err);
        }
    }
}

const projectsDefinition: SchemaDefinition<SchemaDefinitionType<Project>> = {
    organization_id:    { type: String, required: true},
    name:               { type: String, unique: true, required: true, dropDups: true},
    description:        "String",
    type:               "String",
    created_at:         Number,
    updated_at:         Number,
    status:             { type: String, default: ProjectStatus.PENDING },
    enabled:            { type: Boolean, default: true },
    members:            ["String"]
}

