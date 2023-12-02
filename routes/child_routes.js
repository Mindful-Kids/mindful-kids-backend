const router = require("express").Router();
const verifyToken = require("../middlewares/verify_token");
const childControllers = require("../controllers/child_controllers");

router.get(
  "/get-child-hobbies/:id",
  verifyToken,
  childControllers.getChildHobbies
);
router.get(
  "/get-child-traits/:id",
  verifyToken,
  childControllers.getChildTraits
);
router.get(
  "/get-selected-environments/:id",
  verifyToken,
  childControllers.getSelectedEnviroments
);
router.get(
  "/get-unselected-environments/:id",
  verifyToken,
  childControllers.getUnselectedEnviroments
);

module.exports = router;
