const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

const addChild = async (req, res, next) => {
  const {
    firstName,
    lastName,
    gender,
    age,
    dateOfBirth,
    hobbies,
    status,
    description,
    parentId,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !gender ||
    !dateOfBirth ||
    !hobbies ||
    !age ||
    !description ||
    !status ||
    !parentId ||
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

  const child = {
    firstName: firstName,
    lastName: lastName,
    description: description,
    parentId: parseInt(parentId),
    dateOfBirth: new Date(dateOfBirth),
    gender: Boolean(gender),
    age: parseInt(age),
    status: Boolean(status),
    image: upload.secure_url,
  };

  try {
    const [newChild, newChildHobby] = await prisma.$transaction([
      prisma.children.create({ data: child }),
      prisma.childHobby.create({
        data: {
          childId: newChild.id,
          hobbyId: parseInt(hobbies),
        },
      }),
    ]);

    res.status(200).json({
      message: "Child added successfully.",
      childId: newChild.id,
      childHobby: newChildHobby.id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while adding child." });
  }
};

module.exports = {
  getProfile,
  addChild,
};
