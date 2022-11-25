import express from 'express';
import {ErrMsg} from "./util/enums.js";
import db from './database/DatabaseGateway.js';
import JwtUtil from './security/jwt.js';
import AuthRouter from "./routers/AuthRouter.js";
import KeyRouter from "./routers/KeyRouter.js";
import OrgRouter from "./routers/OrgRouter.js";
import AdminRouter from "./routers/AdminRouter";

db.initDb()
.catch(err => {
    console.error("\n" + ErrMsg.INIT_DB_FAIL + "\n");
    console.error(err);
    process.exit(1);
});

JwtUtil.verifyEnv()
.catch(err => {
    console.error("\n" + err);
    process.exit(1);
});

const server = express();

server.use(express.json());

server.use('/api/auth/keys', KeyRouter);
server.use('/api/auth/orgs', OrgRouter);
server.use('/api/auth', AuthRouter);
server.use('/api/admin', AdminRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Authentication Service came online on port', PORT);
})
