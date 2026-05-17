import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadRouter from "./lead";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadRouter);

export default router;
