import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const server = express();

const swaggerDoc = YAML.load('./swagger.yaml');

server.use('/api/swagger/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Swagger service came online at port", PORT);
});
