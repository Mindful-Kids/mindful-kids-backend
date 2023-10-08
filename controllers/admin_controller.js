const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while logging in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occurred while logging in." });
  }

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid credentials, could not log you in!",
    });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "super_secret",
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error occurred while logging in.",
    });
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const deleteCareTaker = async (req, res) => {
  const { careTakerId } = req.body;
  try {
    await prisma.careTaker.update({
      where: {
        id: parseInt(careTakerId),
      },
      data: { status: false },
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while deleting caretaker." });
  }
}

module.exports = {
  login,
  deleteCareTaker,
};
