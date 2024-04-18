import express from "express";
import AdminUseCase from "../../useCase/adminUseCase";
import AdminRepo from "../repository/adminRepo";

import Jwt from "../utils/jwt";
import Bcrypt from "../utils/bcryption";
import AdminController from "../../adaptors/adminController";

const jwt = new Jwt();
const bcrypt = new Bcrypt();
const adminRepo = new AdminRepo();

const adminUseCase = new AdminUseCase(adminRepo, jwt, bcrypt);
const controller = new AdminController(adminUseCase);
const router = express.Router();

router.post("/login", (req, res) => controller.adminLogin(req, res));
router.post("/google_login", (req, res) => controller.googleLogin(req, res));

export default router;
