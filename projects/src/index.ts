import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from "./utils/Logger.js";
import ProjectsRouter from "./routers/ProjectsRouter.js";
import {authenticate} from "./security/middleware.js";

const server = express();

if (process.env.ENVIRONMENT === 'development') {
    Logger.warn("WARNING:", "CORS is enabled");
    server.options('/api/auth', cors());
    server.use(cors({
        credentials: true,
        origin: (origin, callback) => {

            callback(null, true);
        }
    }));
}

server.use(helmet());
server.use(express.json());

server.get('/api/projects/status', (req, res) => res.send());

server.use(authenticate);
server.use('/api/projects/', ProjectsRouter);


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    Logger.log('Projects Service came online on port', PORT);
});
