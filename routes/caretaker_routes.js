const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");
const careTakerControllers = require("../controllers/caretaker_controllers");

/*CareTaker*/
router.post("/login", careTakerControllers.login);
router.post("/signup", careTakerControllers.signup);
router.get("/get-caretaker", verifyToken, careTakerControllers.getCareTaker);
router.post("/update-profile", verifyToken, careTakerControllers.updateProfile);
router.post(
  "/update-profile-image",
  [verifyToken, multer.single("image")],
  careTakerControllers.updateProfileImage
);

/*Children*/
router.post("/get-children", verifyToken, careTakerControllers.getChildren);
router.get("/get-hobbies", verifyToken, careTakerControllers.getHobbies);
router.get("/get-traits", verifyToken, careTakerControllers.getTraits);
router.get(
  "/get-child-hobbies/:id",
  verifyToken,
  careTakerControllers.getChildHobbies
);
router.get(
  "/get-child-traits/:id",
  verifyToken,
  careTakerControllers.getChildTraits
);

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
router.post(
  "/assign-enviroment",
  verifyToken,
  careTakerControllers.assignEnviroments
);
router.post(
  "/get-child-enviroments",
  verifyToken,
  careTakerControllers.getChildEnviroments
);

module.exports = router;
