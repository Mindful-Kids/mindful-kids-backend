const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const reportsControllers = require("../controllers/reports_controllers");

router.get("/generate", verifyToken, reportsControllers.generateReports);

module.exports = router;
