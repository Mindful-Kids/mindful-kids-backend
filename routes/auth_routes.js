const router = require("express").Router();
const authController = require("../controllers/auth_controllers");

router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;
