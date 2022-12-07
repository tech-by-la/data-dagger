import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import TranslationsRouter from "./routers/TranslationsRouter.js";

const server = express();

if (process.env.ENVIRONMENT === 'development') {
    console.log(process.env.ENVIRONMENT);
    server.options('/', cors());
    server.use(cors({
        credentials: true,
        origin: (origin, callback) => {
            callback(null, true);
        }
    }));
}

server.use(helmet());
server.use(express.json());

server.use('/api/tl', TranslationsRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Translations Service came online on port', PORT);
});
