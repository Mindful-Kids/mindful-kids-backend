const router = require("express").Router();
const multer = require("../middlewares/multer");
const adminController = require("../controllers/admin_controller");

router.post("/login", adminController.login);
// router.post("/signup", multer.single("image"), adminController.signup);

module.exports = router;