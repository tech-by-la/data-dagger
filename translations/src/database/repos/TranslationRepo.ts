import {Translation} from "../../utils/interfaces";
import {Connection, Schema} from "mongoose";
import {translationDefinition} from "../../utils/schema-definitions.js";

class TranslationRepo {
    private readonly db: Connection;
    private readonly model;

    constructor(db: Connection) {
        this.db = db;
        this.model = this.db.model('Translation', new Schema(translationDefinition));
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
        return await this.model.updateOne({_id: translation._id},  {
            page: translation.page,
            key: translation.key,
            translations: translation.translations
        }, { upsert: true });
    }
}

export default TranslationRepo;
