// routes/index.js
const express = require("express");

const tempRoute = require("./tempRoute");
const auth = require("./auth");
const routePost = require("./routePost");

const router = express.Router();

router.use("/api", tempRoute);
router.use("/api", auth);
router.use("/api", routePost);

module.exports = router;
