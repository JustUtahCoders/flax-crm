import express from "express";
import { router } from "./Router.js";
import bodyParser from "body-parser";
import "./DB.js";
import "./RouteImports.js";

const app = express();
app.use(bodyParser.json());
app.use(router);

const port = process.env.PORT || 7600;

app.listen(port);

console.log(`Listening on http://localhost:${port}`);
