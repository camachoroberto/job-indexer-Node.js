import express from "express";
import landing from "./../../services/landing/";
import login from "./../../services/login/";

const router = express.Router();

router.get("/", landing);
router.get("/login", login);

module.exports = router;
