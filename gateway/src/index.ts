import httpProxy from 'http-proxy';
import express from 'express';
import Util from "./util.js";
import {Path} from "./enums.js";

const server = express();
const proxy = httpProxy.createProxyServer({});

// Target IPs
const targets = {
    CLIENT: process.env.CLIENT,
    AUTH: process.env.AUTH,
    SWAGGER: process.env.SWAGGER,
    PROJECTS: process.env.PROJECTS,
    TRANSLATIONS: process.env.TRANSLATIONS
}

// Verify IPs
Util.verifyTargets(targets);

server.use
server.use((req, res) => {
    console.log(Util.getDate(), "Request made to", req.url);

    const path = req.url.split('/'); // "", "/[1]", "/[2]", "/[3]", etc.

    if (path[1] === Path.API) {
        switch (path[2]) { // service
            case Path.AUTH:
                proxy.web(req, res, { target: targets.AUTH });
                return;
            case Path.SWAGGER:
                proxy.web(req, res, { target: targets.SWAGGER });
                return;
            case Path.PROJECTS:
                proxy.web(req, res, { target: targets.PROJECTS });
                return;
            case Path.TRANSLATIONS:
                proxy.web(req, res, { target: targets.TRANSLATIONS });
                return;
            case Path.STATUS:
                res.send();
                return;
            default:
                res.status(404).send();
                return;
        }

    } else {
        proxy.web(req, res, {
            target: targets.CLIENT,
        });
    }

    proxy.on('error', (err) => {
        console.log(Util.getDate(), err);
        res.status(404).send();
        return;
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('API Gateway came online on port', PORT);
});
