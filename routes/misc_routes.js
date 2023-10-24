const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const miscControllers = require("../controllers/misc_controllers");

router.get("/get-lookup", miscControllers.getLookup);
router.get("/get-hobbies", verifyToken, miscControllers.getHobbies);
router.get("/get-traits", verifyToken, miscControllers.getTraits);
router.post("/verify-token", verifyToken, miscControllers.verifySession);

module.exports = router;
