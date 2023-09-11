const jwt = require("jsonwebtoken");

const getProfile = async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.status(403).json({ message: "Forbidden" });
    } else {
      res.status(200).json({ message: "Profile accessed!", authData });
    }
  });
};

const addChild = async (req, res, next) => {};

module.exports = {
  getProfile,
  addChild,
};
