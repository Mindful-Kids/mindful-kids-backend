const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");
const careTakerControllers = require("../controllers/caretaker_controllers");

// TODO: Add verifyToken middleware to all routes

router.post("/login", careTakerControllers.login);
router.post("/signup", multer.single("image"), careTakerControllers.signup);
// router.get("/profile", careTakerControllers.getProfile);
router.get("/get-children", verifyToken, careTakerControllers.getChildren);
router.post("/add-child", multer.single("image"), careTakerControllers.addChild);
router.post("/update-child", careTakerControllers.updateChild);
router.post("/update-child-image", multer.single("image"), careTakerControllers.updateChildImage);
router.delete("/delete-child", careTakerControllers.deleteChild);

module.exports = router;
