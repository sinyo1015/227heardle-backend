import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import INITIALIZE from "./initializer";
import path from "path";
import routes from "./routes";
import cors from "cors";

INITIALIZE();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.use("/cropped_music", express.static(__dirname + '../../cropped_music'));

routes(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
