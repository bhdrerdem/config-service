import express from "express";
import configController from "../controllers/configurationController";
import { authMiddleware } from "../middlewares/configAuthMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/mobile", configController.getAllForMobile);
router.get("/:id", configController.getById);
router.get("/", configController.getAll);
router.post("/", configController.create);
router.put("/:id", configController.update);
router.delete("/:id", configController.remove);

export default router;
