import * as express from "express";
import { catchErrors } from "../utils/error";
import * as controller from "./controller";

const router = express.Router();

router.get("/login", catchErrors(controller.login));
router.get("/oauth", catchErrors(controller.callback));

export default router;
