const router = require("express").Router();
const adminController = require("../controllers/admin_controller");

router.post("/login", adminController.login);
router.post("/delete-caretaker", adminController.deleteCareTaker)

module.exports = router;
