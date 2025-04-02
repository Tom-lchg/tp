import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    return app;
};

export default setupServer;
