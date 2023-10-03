const router = require("express").Router();
const authController = require("../controllers/auth_controllers");
const multer = require("../middlewares/multer");

router.post("/login", authController.login);
router.post("/signup",  multer.single("image"), authController.signup);

module.exports = router;
