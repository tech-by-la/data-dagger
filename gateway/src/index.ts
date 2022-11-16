import httpProxy from 'http-proxy';
import express from 'express';
import Util from "./util.js";
import {Path} from "./enums.js";

const server = express();
const proxy =httpProxy.createProxyServer({});

// Target IPs
const targets = {
    CLIENT: process.env.CLIENT,
}

// Verify IPs
Util.verifyTargets(targets);

server.use(express.json());

server.use((req, res) => {
    proxy.on('error', (err) => {
        console.log(err);
        res.status(404).send();
        return;
    });

    const path = req.path.split('/'); // "", "/[1]", "/[2]", "/[3]", etc.

    if (path[1] === Path.API) {
        switch (path[2]) { // service
            default:
                res.status(404).send();
        }

    } else {
        proxy.web(req, res, {
            target: targets.CLIENT,
        });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('API Gateway came online on port', PORT);
});

