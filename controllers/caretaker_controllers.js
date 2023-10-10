const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await prisma.careTaker.findUnique({
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

  if (!existingUser)
    return res.status(401).json({ message: "Invalid credentials." });

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
    gender: existingUser.gender,
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
  const { firstName, lastName, email, password, gender, type } = req.body;

  if (!firstName || !lastName || !email || !password || !gender || !type)
    return res.status(422).json({ message: "Required fields are not filled." });

  const existingUser = await prisma.careTaker.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser)
    return res.status(422).json({ message: "User already exists." });

  const hashedPassword = await bcrypt.hash(password, 12);
  const image = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}+${lastName}&radius=50`;

  const careTaker = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    gender: Boolean(gender === "male"),
    type: type,
    image: image,
  };

  try {
    const newCareTaker = await prisma.careTaker.create({
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

const updateProfile = async (req, res) => {
  const careTakerId = req.authData.id;
  const { firstName, lastName, password, gender, type } = req.body;

  if (!firstName || !lastName || !password || !gender || !type)
    return res.status(422).json({ message: "Required fields are not filled." });
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.careTaker.update({
      where: {
        id: careTakerId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        gender: gender,
        type: type,
      },
    });
    res.status(200).json({
      message: "success",
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
    await prisma.careTaker.update({
      where: {
        id: parseInt(careTakerId),
      },
      data: {
        image: upload.secure_url,
      },
    });
    res.status(200).json({
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
    const children = await prisma.children.findMany({
      where: {
        parentId: parentId,
      },
    });
    return res.status(200).json({ message: "success", data: children });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children." });
  }
};

const addChild = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    age,
    dateOfBirth,
    hobbies,
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
    !parentId ||
    !req.file
  )
    return res.status(422).json({ message: "Required fields are not filled" });

  const image = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName}+${lastName}&radius=50`;

  const child = {
    firstName: firstName,
    lastName: lastName,
    description: description,
    parentId: parseInt(parentId),
    dateOfBirth: new Date(dateOfBirth),
    gender: Boolean(gender),
    age: parseInt(age),
    image: image,
  };

  const newHobbies = hobbies.split(" ").map((id) => parseInt(id));

  try {
    const [newChild] = await prisma.$transaction(async (prisma) => {
      const createdChild = await prisma.children.create({ data: child });
      const newChildHobby = await Promise.all(
        newHobbies.map(async (hobby) => {
          const newChildHobby = await prisma.childHobby.create({
            data: {
              childId: parseInt(createdChild.id),
              hobbyId: parseInt(hobby),
            },
          });
          return newChildHobby;
        })
      );

      return [createdChild, newChildHobby];
    });
    console.log(newChild[0]);
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
    childId,
    hobbiesId,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    hobbies,
    description,
  } = req.body;

  if (
    !childId ||
    !hobbiesId ||
    !firstName ||
    !lastName ||
    !gender ||
    !dateOfBirth ||
    !hobbies ||
    !description ||
    !req.file
  )
    return res.status(422).json({ message: "Required fields are not filled." });

  const existingHobbyIds = hobbiesId.split(" ").map((id) => parseInt(id));
  const newHobbies = hobbies.split(" ").map((id) => parseInt(id));

  try {
    const [updatedChild] = await prisma.$transaction([
      prisma.children.update({
        where: {
          id: parseInt(childId),
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          description: description,
          dateOfBirth: new Date(dateOfBirth),
          gender: Boolean(gender),
        },
      }),
      ...existingHobbyIds.map((previousHobbyId) =>
        prisma.childHobby.delete({
          where: {
            id: parseInt(previousHobbyId),
          },
        })
      ),
      ...newHobbies.map((hobbyIdToUpdate) =>
        prisma.childHobby.create({
          data: {
            childId: parseInt(childId),
            hobbyId: parseInt(hobbyIdToUpdate),
          },
        })
      ),
    ]);

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
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating Image." });
  }
};

const getUnselectedEnviroments = async (req, res) => {
  const { childId } = req.body;
  try {
    const environmentsNotInChildEnviroment = await prisma.enviroment.findMany({
      where: {
        NOT: {
          ChildEnviroment: {
            some: {
              childId: childId,
            },
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: "success", data: environmentsNotInChildEnviroment });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  login,
  signup,
  updateProfile,
  updateProfileImage,
  getChildren,
  addChild,
  deleteChild,
  updateChild,
  updateChildImage,
  getUnselectedEnviroments,
};
