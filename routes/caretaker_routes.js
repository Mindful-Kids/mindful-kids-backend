const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const careTakerControllers = require("../controllers/caretaker_controllers");

router.get("/profile", verifyToken, careTakerControllers.getProfile);

module.exports = router;
