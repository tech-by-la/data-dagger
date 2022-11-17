import express from 'express';
import {ErrMsg} from "./util/enums.js";
import db from './database/DatabaseGateway.js';
import JwtUtil from './security/jwt.js';
import AuthRouter from "./routers/AuthRouter.js";

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
server.use(AuthRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Authentication Service came online on port', PORT);
})
