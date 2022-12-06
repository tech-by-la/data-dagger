import express from 'express';
import TranslationsRouter from "./routers/TranslationsRouter.js";

const server = express();

server.use(express.json());

server.use('/api/tl', TranslationsRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Translations Service came online on port', PORT);
});
