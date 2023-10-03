const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const login = async (req, res, next) => {

  const { email, password } = req.body;
  console.log(req.body);

  let existingUser;
  try {
    existingUser = await prisma.admin.findFirst({
      email: email,
    });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Error occurred while logging in." });
  }
  console.log(existingUser.password)

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: "Error occurred while logging in." });
  }

  if (isValidPassword) {
    return res
      .status(200)
      .json({
        message: "success", data: {
          email: existingUser.email
        }
      });
  } else {
    return res
      .status(500)
      .json({ message: "Error occurred while logging in." });
  }

};



module.exports = {
  login,
};
