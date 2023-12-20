const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");

const prisma = require("../prisma");

router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        userName: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      },
    });
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error)
    res.redirect('/auth/signup');
  }
});


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
