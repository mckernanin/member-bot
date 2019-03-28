import * as express from "express";
import { catchErrors } from "../utils/error";
import * as controller from "./controller";

const router = express.Router();

router.get("/check", catchErrors(controller.check));
router.get("/setup", catchErrors(controller.setup));

export default router;
