import express from "express";
import AdminUseCase from "../../useCase/adminUseCase";
import AdminRepo from "../repository/adminRepo";
import PackageRepo from "../repository/packageRepo";
import Jwt from "../utils/jwt";
import Bcrypt from "../utils/bcryption";
import AdminController from "../../adaptors/adminController";

const jwt = new Jwt();
const bcrypt = new Bcrypt();
const adminRepo = new AdminRepo();
const packageRepo = new PackageRepo();

const adminUseCase = new AdminUseCase(adminRepo, jwt, bcrypt, packageRepo);
const controller = new AdminController(adminUseCase);
const router = express.Router();

router.post("/login", (req, res) => controller.adminLogin(req, res));
router.post("/google_login", (req, res) => controller.googleLogin(req, res));

router.get("/travelers", (req, res) => controller.getTravelersList(req, res));
router.patch("/traveler_action", (req, res) =>
  controller.block_unblock_Traveler(req, res)
);

router.get("/hosts", (req, res) => controller.getHostsList(req, res));
router.patch("/host_action", (req, res) =>
  controller.block_unblock_Host(req, res)
);
router.get("/packages", (req, res) => controller.getPackagesList(req, res));
router.patch("/package_action", (req, res) =>
  controller.package_Actions(req, res)
);

export default router;
