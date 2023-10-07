const router = require("express").Router();
const environmentController = require("../controllers/environment_controllers");
const multer = require("../middlewares/multer");

// TODO: Add verifyToken middleware to all routes

router.get("/all", environmentController.getEnvironments);
router.post(
  "/add",
  multer.single("image"),
  environmentController.addEnvironment
);

module.exports = router;
