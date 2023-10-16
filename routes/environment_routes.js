const router = require("express").Router();
const environmentController = require("../controllers/environment_controllers");
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");

router.get("/all", verifyToken, environmentController.getEnvironments);
router.post(
  "/add",
  multer.single("image"),
  environmentController.addEnvironment
);

module.exports = router;
