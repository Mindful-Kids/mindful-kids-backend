const router = require("express").Router();
const adminController = require("../controllers/admin_controller");

router.post("/login", adminController.login);

module.exports = router;
