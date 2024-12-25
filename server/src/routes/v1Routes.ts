import express from "express";
import configRoutes from "../routes/configurationRoutes";

const router = express.Router();

router.use("/configurations", configRoutes);

export default router;
