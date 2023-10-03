const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const {
    firstName,
    lastName,
    email,
    gender,
    type,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !gender ||
    !type ||
    !req.file
  )
    return res.status(422).json({ message: "Required fields are not filled." });

  const upload = await cloudinary.v2.uploader
    .upload(req.file.path, { folder: process.env.CLOUDINARY_FOLDER_NAME })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred while uploading image." });
    });

  const careTaker = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: Boolean(gender),
    type: type,
    image: upload.secure_url,
  };

  try {
    const newCareTaker = await prisma.careTaker.create({
      data: careTaker
    });

    res.status(200).json({
      message: "Care Taker added successfully.",
      careTakerId: newCareTaker.id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while adding care Taker." });
  }
};

module.exports = {
  login,
  signup,
};
