
const express = require('express');
const router = express.Router();

const postsRoutes = require("./posts");

const isAuthenticated = require("../middleware/isAuthenticated");

router.use("/posts", isAuthenticated, postsRoutes);

const authRoutes = require("./auth");
router.use("/auth", authRoutes);

module.exports = router;
