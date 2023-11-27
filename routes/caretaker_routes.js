const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");
const careTakerControllers = require("../controllers/caretaker_controllers");

/*CareTaker*/
router.post("/login", careTakerControllers.login);
router.post("/send-verification-code", careTakerControllers.sendVerificationCode);
router.post("/verify-verification-code", careTakerControllers.verifyVerificationCode)
router.post("/signup", careTakerControllers.signup);
router.get("/get-caretaker", verifyToken, careTakerControllers.getCareTaker);
router.get(
  "/get-caretaker-type/:id",
  verifyToken,
  careTakerControllers.getCareTakerType
);
router.post("/update-profile", verifyToken, careTakerControllers.updateProfile);
router.post(
  "/update-profile-image",
  [verifyToken, multer.single("image")],
  careTakerControllers.updateProfileImage
);

/*Children*/
router.get("/get-child/:id", verifyToken, careTakerControllers.getChildInfo);
router.get("/get-children", verifyToken, careTakerControllers.getChildren);

router.post("/add-child", verifyToken, careTakerControllers.addChild);
router.delete("/delete-child/:id", verifyToken, careTakerControllers.deleteChild);
router.post("/update-child", verifyToken, careTakerControllers.updateChild);
router.post(
  "/update-child-image",
  [verifyToken, multer.single("image")],
  careTakerControllers.updateChildImage
);

module.exports = router;
