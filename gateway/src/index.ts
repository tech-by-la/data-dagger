import http from "http";
import httpProxy from 'http-proxy';
import Util from "./util.js";
import {Path} from "./enums.js";

const proxy = httpProxy.createProxyServer({});

// Target IPs
const targets = {
    CLIENT: process.env.CLIENT,
    AUTH: process.env.AUTH,
    SWAGGER: process.env.SWAGGER,
    TRANSLATIONS: process.env.TRANSLATIONS
}

// Verify IPs
Util.verifyTargets(targets);

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    console.log(Util.getDate(), "Request made to", req.url);

    const path = req.url?.split('/'); // "", "/[1]", "/[2]", "/[3]", etc.
    if (!path) {
        res.writeHead(404).end();
        return;
    }

    if (path[1] === Path.API) {
        switch (path[2]) { // service
            case Path.AUTH:
                proxy.web(req, res, { target: targets.AUTH });
                return;
            case Path.SWAGGER:
                proxy.web(req, res, { target: targets.SWAGGER });
                return;
            case Path.TRANSLATIONS:
                proxy.web(req, res, { target: targets.TRANSLATIONS });
                return;
            case Path.STATUS:
                res.end();
                return;
            default:
                res.writeHead(404).end();
                return;
        }

    } else {
        proxy.web(req, res, {
            target: targets.CLIENT,
        });
    }

    proxy.on('error', (err) => {
        console.log(Util.getDate(), err);
        res.writeHead(404).end();
        return;
    });
}).listen(PORT, () => {
    console.log('API Gateway came online on port', PORT);
});
