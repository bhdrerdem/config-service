import express from "express";
import configRoutes from "../routes/configurationRoutes";
import audienceRoutes from "../routes/audienceRoutes";
import overrideRoutes from "../routes/overrideRoutes";

const router = express.Router();

router.use("/configurations", configRoutes);
router.use("/audiences", audienceRoutes);
router.use("/overrides", overrideRoutes);

export default router;
