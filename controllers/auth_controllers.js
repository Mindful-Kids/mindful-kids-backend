const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const user = {
    name: "John Doe",
    email: "john@doe.com",
    password: "password",
  };
  jwt.sign(
    { user },
    process.env.JWT_SECRET,
    { expiresIn: "60s" },
    (err, token) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "An error occurred while generating token.",
        });
      }
      res.json({ token });
    }
  );
};

const signup = async (req, res, next) => {
  res.status(200).json({ message: "Signed up!" });
};

module.exports = {
  login,
  signup,
};
