import express from "express";
import { authMiddleware } from "../middlewares/configAuthMiddleware";
import overrideController from "../controllers/overrideController";

const router = express.Router();

router.use(authMiddleware);

router.post("/", overrideController.create);
router.put("/:id", overrideController.update);
router.delete("/:id", overrideController.remove);
router.get("/", overrideController.getAll);

export default router;
