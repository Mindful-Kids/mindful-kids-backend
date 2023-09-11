const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const careTakerControllers = require("../controllers/caretaker_controllers");

// TODO: Add verifyToken middleware to all routes

router.get("/profile", careTakerControllers.getProfile);
router.post("/add-child", careTakerControllers.addChild);

module.exports = router;
