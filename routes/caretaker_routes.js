const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const multer = require("../middlewares/multer");
const careTakerControllers = require("../controllers/caretaker_controllers");

// TODO: Add verifyToken middleware to all routes

router.post("/login", careTakerControllers.login);
router.post("/signup", multer.single("image"), careTakerControllers.signup);
router.get("/profile", careTakerControllers.getProfile);
router.get("/get-children", verifyToken, careTakerControllers.getChildren);
router.post(
  "/add-child",
  multer.single("image"),
  careTakerControllers.addChild
);

module.exports = router;
