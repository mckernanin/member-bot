import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import authentication from "./authentication/routes";
import * as errors from "./utils/error";
import config from "./config";

const app = express();
app.set("port", config.port);
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("<h1>Hello world!</h1>"));
app.use("/v1/authentication", authentication);
app.use(errors.notFound);

if (config.env === "development") {
  app.use(errors.developmentErrors);
}
app.use(errors.productionErrors);

app.listen(app.get("port"), () => console.log("Warp drive active..."));
