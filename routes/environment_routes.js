const router = require("express").Router();
const environmentController = require("../controllers/environment_controllers");
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");

router.get("/all", verifyToken, environmentController.getEnvironments);
router.get(
  "/get-selected-environments/:id",
  verifyToken,
  environmentController.getSelectedEnviroments
);
router.get(
  "/get-unselected-environments/:id",
  verifyToken,
  environmentController.getUnselectedEnviroments
);
router.post(
  "/add",
  multer.single("image"),
  environmentController.addEnvironment
);

module.exports = router;
