const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    console.log("here0");
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      console.log("here1");
      if (err) {
        console.log("here2");
        return res.status(403).json({ message: "forbidden" });
      } else {
        console.log("here3");
        console.log(authData)
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
