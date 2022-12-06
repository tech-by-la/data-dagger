import {Translation} from "../../utils/interfaces";
import mongoose, {Connection, Schema, Types} from "mongoose";
import {translationDefinition} from "../../utils/schema-definitions.js";

class TranslationRepo {
    private readonly db: Connection;
    private readonly model;

    constructor(db: Connection) {
        this.db = db;
        this.model = this.db.model(
            'Translation',
            new Schema(translationDefinition, { versionKey: false })
        );
    }

    public async findAll() {
        return await this.model.find();
    }

    public async findByPage(page: string) {
        return await this.model.find({page});
    }

    public async findByPageAndKey(page: string, key: string) {
        return await this.model.findOne({page, key});
    }

    public async upsert(translation: Translation) {
        const _id = translation._id ?? new mongoose.Types.ObjectId();

        return await this.model.findOneAndUpdate({_id},  {
            page: translation.page,
            key: translation.key,
            translations: translation.translations
        }, { upsert: true, new: true }).catch(() => null);
    }

    public async deleteMany(ids: string[]) {
        await this.model.deleteMany({ _id: { $in: ids } }).catch();
    }
}

export default TranslationRepo;
