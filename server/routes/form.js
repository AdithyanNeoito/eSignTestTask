import express from "express";
import { getForm } from "../controllers/form.js";
const router = express.Router();

router.get("/", getForm);

export default router;
