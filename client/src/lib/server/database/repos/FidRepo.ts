import {type Connection, Schema, type SchemaDefinition, type SchemaDefinitionType} from "mongoose";
import type {FeatureClone} from "$lib/server/util/interfaces";

export default class FidRepo {

    private readonly db: Connection;

    private readonly model;

    constructor(db: Connection) {
        this.db = db;

        const FidSchema = new Schema(fidDefinition);

        this.model = this.db.model('Fid', FidSchema);
    }

    public async findAllByProject(project_id: string) {
        return await this.model.find({ project_id });
    }

    /*
     * Access a fid that hasn't been accessed in the last 5 minutes and update accessed_at.
     * Also sets accessed_by so only that user can reset the accessed_at value to unlock the fid.
     */
    public async findOneAvailableAndLock(project_id: string, accessed_by: string) {
        return await this.model.findOneAndUpdate({
            project_id,
            checked: false,
            accessed_at: { $lt: Date.now() - (1000 * 60 * 5) } // 5 minutes
        }, {
            $set: { accessed_at: Date.now(), accessed_by }
        });
    }

    public async setChecked(fid: string) {
        return await this.model.updateOne({ fid }, { $set: { checked: true } });
    }

    /*
     * Unlocks a fid by resetting the accessed_at value.
     * Includes accessed_by in the filter for security.
     */
    public async unlock(fid:string, accessed_by: string) {
        return await this.model.updateOne(
            { fid, accessed_by }, { $set: { accessed_at: new Date(0) }});
    }

    public async insertMany(project_id: string, fids: string[]) {
        const data = fids.map(f => { return { fid: f, project_id } });
        return await this.model.insertMany(data);
    }


    public async deleteByProject(project_id: string) {
        return await this.model.deleteMany({ project_id });
    }
}

const fidDefinition: SchemaDefinition<SchemaDefinitionType<FeatureClone>> = {
    fid:         { type: String, required: true, unique: true },
    checked:     { type: Boolean, required: true, default: false },
    project_id:  { type: String, required: true },
    accessed_at: { type: Date, required: true, default: new Date(0) },
    accessed_by: "String",
}
