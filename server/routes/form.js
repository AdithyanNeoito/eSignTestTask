import express from "express";
import { createForm } from "../controllers/form.js";
const router = express.Router();

router.post("/", createForm);

export default router;
