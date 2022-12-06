import { Router } from 'express';
import db from '../database/DatabaseGateway.js';
import {StatusCode} from "../utils/enums.js";
import {authorizeSuperAdmin} from "../security/middleware.js";

const router = Router();

router.get('/', authorizeSuperAdmin, async (req, res) => {
    const translations = await db.translations.findAll();
    res.send(translations);
});

router.get('/:page', async (req, res) => {
    const results = await db.translations.findByPage(req.params.page);

    const locale = req.query.locale as string || 'en';

    let translations: {[key: string]: string} = {};
    for (const result of results) {
        if (result.translations && typeof result.key === "string") {
            const tl = result.translations as {[key:string]: string}
            translations[result.key] = tl[locale];
        }
    }

    res.send(translations);
});

router.post('/', authorizeSuperAdmin, async (req, res) => {
    const { _id, page, key, translations } = req.body;

    if (
        !page || !key || !translations ||
        typeof page !== "string" ||
        typeof key !== "string" ||
        typeof translations !== "object"
    ) {
        res.status(StatusCode.BAD_REQUEST).send({
            status: StatusCode.BAD_REQUEST,
            error: "Bad Request",
            message: "page or key is missing or of an invalid type"
        });
        return;
    }

    const translation = await db.translations.findByPageAndKey(page, key);
    if (translation) {
        req.body._id = translations._id;
    }

    const result = await db.translations.upsert(req.body);
    res.status(StatusCode.CREATED).send(result);
});

export default router;
