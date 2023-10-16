const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");
const careTakerControllers = require("../controllers/caretaker_controllers");

/*CareTaker*/
router.post("/login", careTakerControllers.login);
router.post("/signup", careTakerControllers.signup);
router.post("/update-profile", verifyToken, careTakerControllers.updateProfile);
router.post(
  "/update-profile-image",
  [verifyToken, multer.single("image")],
  careTakerControllers.updateProfile
);

/*Children*/
router.get("/get-children", verifyToken, careTakerControllers.getChildren);
router.post("/add-child", verifyToken, careTakerControllers.addChild);
router.post("/update-child", verifyToken, careTakerControllers.updateChild);
router.post(
  "/update-child-image",
  [verifyToken, multer.single("image")],
  careTakerControllers.updateChildImage
);
router.post(
  "/get-unselected-enviroments",
  verifyToken,
  careTakerControllers.getUnselectedEnviroments
);
router.delete("/delete-child", verifyToken, careTakerControllers.deleteChild);

module.exports = router;
