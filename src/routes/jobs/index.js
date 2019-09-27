import express from "express";
const router = express.Router();

import list from "./../../services/jobs/list";

router.get("/", list);

module.exports = router;
