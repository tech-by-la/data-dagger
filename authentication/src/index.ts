import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import {ErrMsg} from "./util/enums.js";
import db from './database/DatabaseGateway.js';
import JwtUtil from './security/jwt.js';
import AuthRouter from "./routers/AuthRouter.js";
import KeyRouter from "./routers/KeyRouter.js";
import OrgRouter from "./routers/OrgRouter.js";
import AdminRouter from "./routers/AdminRouter.js";
import InviteRouter from "./routers/InviteRouter.js";
import UserRouter from "./routers/UserRouter.js";
import {authenticate, authorizeAdmin} from "./util/middleware.js";
import Logger from "./util/Logger.js";

db.initDb()
.catch(err => {
    Logger.error("\n" + ErrMsg.INIT_DB_FAIL + "\n");
    Logger.error(err);
    process.exit(1);
});

JwtUtil.verifyEnv()
.catch(err => {
    Logger.error("\n" + err);
    process.exit(1);
});

const server = express();

if (process.env.ENVIRONMENT === 'development') {
    Logger.warn("WARNING:", "CORS is enabled");
    server.options('/api/auth', cors())
    server.use(cors({
        credentials: true,
        origin: (origin, callback) => {
            callback(null, true);
        }
    }));
}

server.use(helmet());
server.use(express.json());

server.use('/api/auth/keys', KeyRouter);
server.use('/api/auth/orgs', authenticate, OrgRouter);
server.use('/api/auth/invite', authenticate, InviteRouter);
server.use('/api/auth/users', authenticate, UserRouter);
server.use('/api/auth/admin', authenticate, authorizeAdmin, AdminRouter);
server.use('/api/auth', AuthRouter);

server.get('/api/auth/status', (req, res) => res.send());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    Logger.log('Authentication Service came online on port', PORT);
})
