import express from "express";
import { authMiddleware } from "../middlewares/configAuthMiddleware";
import audienceController from "../controllers/audienceController";

const router = express.Router();

router.use(authMiddleware);

router.get("/", audienceController.getAll);
router.post("/", audienceController.create);
router.put("/:id", audienceController.update);
router.delete("/:id", audienceController.remove);

export default router;
