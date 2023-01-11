import {Connection, Schema, type SchemaDefinition, type SchemaDefinitionType} from "mongoose";
import type {Log} from "$lib/server/util/interfaces";
import {LogType} from "$lib/server/util/enums";

export default class LogRepo {
    private readonly db: Connection;
    private readonly model;

    constructor(db: Connection) {
        this.db = db;

        const FidSchema = new Schema(schemaDefinition, {
            versionKey: false,
            minimize: false,
            strict: true,
            toObject: {
                transform: (doc, ret) => {
                    delete ret._id;
                    delete ret.read_by;
                    ret.date = formatDate(ret.date);
                }
            }
        });

        this.model = this.db.model('Logs', FidSchema);
    }

    public async saveLog(log: Log) {
        return await this.model.create(log);
    }

    public async getLogs(type: string, limit: number, user_id: string, page = 0) {
        const query = type === 'all' ? { $not: { type }} : { type };

        // Update found logs to be read by this user.
        // Doing it in separate query since there is no findManyAndUpdate function.
        await this.model.updateMany(
            {...query, read_by: { $not: {$in: user_id }}},
            { $push: { read_by: user_id }},
            {limit, skip: (limit * page), sort: { date: -1 }}
        );

        return await this.model.find(query, {}, {
            limit, skip: (limit * page), sort: { date: -1 }
        })
            .then(result => result.map(r => r.toObject()));
    }

    public async count(type: string) {
        const query = type === 'all' ? { $not: { type }} : { type };
        return await this.model.count(query);
    }

    public async countUnread(user_id: string) {
        const unread = { normal: 0, success: 0, warning: 0, error: 0, admin: 0 };
        unread.normal = await this.model.count({type:LogType.normal, read_by: { $not: { $in: user_id }}});
        unread.success = await this.model.count({type:LogType.success, read_by: { $not: { $in: user_id }}});
        unread.warning = await this.model.count({type:LogType.warning, read_by: { $not: { $in: user_id }}});
        unread.error = await this.model.count({type:LogType.error, read_by: { $not: { $in: user_id }}});
        unread.admin = await this.model.count({type:LogType.admin, read_by: { $not: { $in: user_id }}});
        return unread;
    }

    public async clearLogs(type: string) {
        const query = type === 'all' ? undefined : { type };
        return await this.model.deleteMany(query);
    }
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth()+1).toString().length < 2 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    const day = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate();
    const hour = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = date.getSeconds().toString().length < 2 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}

const schemaDefinition: SchemaDefinition<SchemaDefinitionType<Log>> = {
    date: { type: Date, required: true },
    log: { type: "String", required: true },
    type: { type: "String", required: true },
    read_by: ["String"],
}
