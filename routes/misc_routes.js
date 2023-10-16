const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const miscControllers = require("../controllers/misc_controllers");

router.get("/get-lookup", miscControllers.getLookup);
router.post("/verify-token", verifyToken, miscControllers.verifyToken);

module.exports = router;
