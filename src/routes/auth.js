const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

//Authenticate user
//api/auth
router.post(
  "/",
  [
    check("email", "Add a valid format email").isEmail(),
    check("password", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  authController.userAuthentication
);

module.exports = router;
