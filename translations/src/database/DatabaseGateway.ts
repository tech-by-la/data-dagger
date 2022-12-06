import TranslationRepo from "./repos/TranslationRepo.js";
import * as mongoose from "mongoose";
import {Connection} from "mongoose";

interface IDatabaseGateway {
    translations: TranslationRepo;
}

class DatabseGateway implements IDatabaseGateway {
    private readonly db: Connection;

    public readonly translations: TranslationRepo;

    constructor() {
        const url = process.env.DATABASE_URL;
        if (!url) throw Error('DATABASE_URL is missing in environment');

        this.db = mongoose.createConnection(url)
        this.translations = new TranslationRepo(this.db);
    }
}

export default new DatabseGateway();
