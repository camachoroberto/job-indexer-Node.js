import express from "express";
import landing from "./../../services/landing/";
import login from "../../services/user/login";
import register from "../../services/user/register"

const router = express.Router();

router.get("/", landing);
router.get("/login", login);
router.get("/register", register);

module.exports = router;
