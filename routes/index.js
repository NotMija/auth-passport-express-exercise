const express = require('express');
const router = express.Router();

router.use("/posts", require("./posts"))
router.use('/auth', require('./auth'));

router.use((req, res, next) => {
    // Lógica del middleware aquí
    next();
  });

module.exports = router;
