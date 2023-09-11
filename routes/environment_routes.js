const router = require("express").Router();
const environmentController = require("../controllers/environment_controllers");

// TODO: Add verifyToken middleware to all routes

router.get("/", environmentController.getEnvironments);

module.exports = router;
