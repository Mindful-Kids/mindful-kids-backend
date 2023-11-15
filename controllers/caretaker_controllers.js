const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await prisma.careTakers.findUnique({
      where: {
        email: email,
        status: true,
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

  if (!isValidPassword)
    return res.status(401).json({ message: "Invalid credentials." });

  const careTaker = {
    id: existingUser.id,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    typeId: existingUser.typeId,
    genderId: existingUser.genderId,
    image: existingUser.image,
  };

  jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
    (err, token) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "An error occurred while generating token.",
        });
      }
      res.json({ message: "success", data: careTaker, token });
    }
  );
};

const signup = async (req, res) => {
  const { firstName, lastName, email, password, genderId, typeId } = req.body;

  if (!firstName || !email || !password || !genderId || !typeId)
    return res.status(422).json({ message: "Required fields are not filled." });

  const existingUser = await prisma.careTakers.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser)
    return res.status(422).json({ message: "User already exists." });

  const hashedPassword = await bcrypt.hash(password, 12);
  const image = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}${lastName}&radius=50`;

  const careTaker = {
    firstName: firstName,
    lastName: lastName ?? "",
    email: email,
    password: hashedPassword,
    genderId: parseInt(genderId),
    typeId: parseInt(typeId),
    image: image,
  };

  try {
    const newCareTaker = await prisma.careTakers.create({
      data: careTaker,
    });

    res.status(200).json({
      message: "success",
      careTakerId: newCareTaker.id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while adding care Taker." });
  }
};

const getCareTaker = async (req, res) => {
  const parentId = req.authData.id;
  try {
    const careTaker = await prisma.careTakers.findUnique({
      where: {
        id: parseInt(parentId),
        status: true,
      },
    });

    delete careTaker.status;
    return res.status(200).json({ message: "success", data: careTaker });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children." });
  }
};

const getCareTakerType = async (req, res) => {
  const typeId = req.params.id;
  try {
    const type = await prisma.lookup.findUnique({
      where: {
        id: parseInt(typeId),
      },
      select: {
        value: true,
      },
    });
    return res.status(200).json({ message: "success", data: type });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children." });
  }
};

const updateProfile = async (req, res) => {
  const careTakerId = req.authData.id;
  const { firstName, lastName, password, genderId, typeId } = req.body;
  if (!firstName || !password || !genderId || !typeId)
    return res.status(422).json({ message: "Required fields are not filled." });
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const updatedCareTaker = await prisma.careTakers.update({
      where: {
        id: careTakerId,
      },
      data: {
        firstName: firstName,
        lastName: lastName ?? "",
        password: hashedPassword,
        genderId: parseInt(genderId),
        typeId: parseInt(typeId),
      },
    });
    delete updatedCareTaker.status;
    res.status(200).json({
      message: "success",
      data: updatedCareTaker,

    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while uodating profile." });
  }
};

const updateProfileImage = async (req, res) => {
  const careTakerId = req.authData.id;
  if (!req.file)
    return res.status(422).json({ message: "Required fields are not filled." });
  const upload = await cloudinary.v2.uploader
    .upload(req.file.path, { folder: process.env.CLOUDINARY_FOLDER_NAME })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred while uploading image." });
    });
  try {
    await prisma.careTakers.update({
      where: {
        id: parseInt(careTakerId),
      },
      data: {
        image: upload.secure_url,
      },
    });
    res.status(200).json({
      image: upload.secure_url,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating profile image." });
  }
};

const getChildren = async (req, res) => {
  const parentId = req.authData.id;
  try {
    const childrens = await prisma.children.findMany({
      where: {
        parentId: parseInt(parentId),
        status: true,
      },
    });

    childrens.forEach((item) => delete item.status);
    return res.status(200).json({ message: "success", data: childrens });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children." });
  }
};

const getChildInfo = async (req, res) => {
  const childId = req.params.id;

  try {
    const children = await prisma.children.findUnique({
      where: {
        id: parseInt(childId),
        status: true,
      },
    });
    delete children.status;
    return res.status(200).json({ message: "success", data: children });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children." });
  }
};

const addChild = async (req, res) => {
  const parentId = req.authData.id;
  const {
    firstName,
    lastName,
    genderId,
    dateOfBirth,
    hobbies,
    traits,
    description,
  } = req.body;

  if (
    !firstName ||
    !genderId ||
    !dateOfBirth ||
    !hobbies ||
    !traits ||
    !description
  )
    return res.status(422).json({ message: "Required fields are not filled" });
  const image = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}${lastName}&radius=50`;

  const child = {
    firstName: firstName,
    lastName: lastName ?? "",
    description: description,
    parentId: parseInt(parentId),
    dateOfBirth: new Date(dateOfBirth),
    genderId: parseInt(genderId),
    image: image,
  };

  const newHobbies = hobbies.split(",").map((id) => parseInt(id));
  const newTraits = traits.split(",").map((id) => parseInt(id));

  try {
    const [newChild] = await prisma.$transaction(async (prisma) => {
      const createdChild = await prisma.children.create({ data: child });
      const newChildHobby = await Promise.all(
        newHobbies.map(async (hobby) => {
          const newChildHobby = await prisma.childHobbies.create({
            data: {
              childId: parseInt(createdChild.id),
              hobbyId: parseInt(hobby),
            },
          });
          return newChildHobby;
        })
      );

      const newChildTraits = await Promise.all(
        newTraits.map(async (trait) => {
          const newChildTrait = await prisma.childTraits.create({
            data: {
              childId: parseInt(createdChild.id),
              traitId: parseInt(trait),
            },
          });
          return newChildTrait;
        })
      );

      return [createdChild, newChildHobby, newChildTraits];
    });

    res.status(200).json({
      message: "success",
      childId: newChild.id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while adding child." });
  }
};

const deleteChild = async (req, res) => {
  const { childId } = req.body;
  try {
    await prisma.children.update({
      where: {
        id: parseInt(childId),
      },
      data: { status: 0 },
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while deleting child." });
  }
};

const updateChild = async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    genderId,
    dateOfBirth,
    hobbies,
    traits,
    description,
  } = req.body;

  if (!id || !firstName || !genderId || !dateOfBirth || !hobbies || !traits)
    return res.status(422).json({ message: "Required fields are not filled." });

  const newHobbies = hobbies.split(",").map((id) => parseInt(id));
  const newTraits = traits.split(",").map((id) => parseInt(id));

  try {
    const [updatedChild] = await prisma.$transaction(async (prisma) => {
      const updatedChild = await prisma.children.update({
        where: {
          id: parseInt(id),
        },
        data: {
          firstName: firstName,
          lastName: lastName ?? "",
          description: description,
          dateOfBirth: new Date(dateOfBirth),
          genderId: parseInt(genderId),
        },
      });

      await prisma.childHobbies.deleteMany({
        where: {
          childId: parseInt(id),
        },
      });
      await Promise.all(
        newHobbies.map(async (hobby) => {
          const newChildHobby = await prisma.childHobbies.create({
            data: {
              childId: parseInt(id),
              hobbyId: parseInt(hobby),
            },
          });
          return newChildHobby;
        })
      );

      await prisma.childTraits.deleteMany({
        where: {
          childId: parseInt(id),
        },
      });
      await Promise.all(
        newTraits.map(async (trait) => {
          const newChildTrait = await prisma.childTraits.create({
            data: {
              childId: parseInt(id),
              traitId: parseInt(trait),
            },
          });
          return newChildTrait;
        })
      );

      return [updatedChild];
    });

    res.status(200).json({
      message: "success",
      childId: updatedChild.id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating child." });
  }
};

const updateChildImage = async (req, res) => {
  const { childId } = req.body;
  if (!req.file)
    return res.status(422).json({ message: "Required fields are not filled." });

  const upload = await cloudinary.v2.uploader
    .upload(req.file.path, { folder: process.env.CLOUDINARY_FOLDER_NAME })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred while uploading image." });
    });

  try {
    const updatedChild = await prisma.children.update({
      where: {
        id: parseInt(childId),
      },
      data: {
        image: upload.secure_url,
      },
    });
    res.status(200).json({
      message: "success",
      childId: updatedChild.id,
      image: upload.secure_url,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating Image." });
  }
};

module.exports = {
  login,
  signup,

  getCareTaker,
  getCareTakerType,

  updateProfile,
  updateProfileImage,

  getChildren,
  getChildInfo,

  addChild,
  deleteChild,
  updateChild,
  updateChildImage,
};
