const express = require("express");
const router = express.Router();
const { authController } = require("../../../controller");
const middleware = require("../../../middleware");


router.post(
  "/register",
  middleware.use("validator.register"),
  authController.register
)

router.post(
  "/login",
  middleware.use("validator.login"),
  authController.login
);

module.exports = router;
