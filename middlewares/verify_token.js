const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        return res.status(403).json({ message: "forbidden" });
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    console.log("bearerHeader is undefined");
    return res.status(403).json({ message: "forbidden" });
  }
};

module.exports = verifyToken;
