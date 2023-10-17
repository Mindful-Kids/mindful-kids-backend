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
    type: existingUser.typeId,
    gender: existingUser.genderId,
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

  if (!firstName || !lastName || !email || !password || !genderId || !typeId)
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
    lastName: lastName,
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
    console.log(error);
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

const updateProfile = async (req, res) => {
  const careTakerId = req.authData.id;
  const { firstName, lastName, email, password, genderId, typeId } = req.body;

  if (!firstName || !lastName || !password || !genderId || !typeId || !email)
    return res.status(422).json({ message: "Required fields are not filled." });
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.careTakers.update({
      where: {
        id: careTakerId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        genderId: parseInt(genderId),
        typeId: parseInt(typeId),
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
    await prisma.careTakers.update({
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

const getChildrens = async (req, res) => {
  const parentId = req.authData.id;
  try {
    const childrens = await prisma.children.findMany({
      where: {
        parentId: parentId,
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

const getChildren = async (req, res) => {
  const { id } = req.body;
  try {
    const children = await prisma.children.findUnique({
      where: {
        id: id,
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

const getChildHobbies = async (req, res) => {
  const childId = req.params.id;
  try {
    const hobbies = await prisma.hobbies.findMany({
      where: {
        ChildHobbies: {
          some: {
            childId: parseInt(childId), // You can change this to the desired childId
          },
        },
        status: true,
      },
    });

    hobbies.forEach((item) => delete item.status);
    return res.status(200).json({ message: "success", data: hobbies });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children hobbies." });
  }
};

const getChildTraits = async (req, res) => {
  const childId = req.params.id;
  try {
    const traits = await prisma.traits.findMany({
      where: {
        ChildTraits: {
          some: {
            childId: parseInt(childId), // You can change this to the desired childId
          },
        },
        status: true,
      },
    });

    traits.forEach((item) => delete item.status);
    return res.status(200).json({ message: "success", data: traits });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children traits." });
  }
};

const getHobbies = async (req, res) => {
  try {
    const hobbies = await prisma.hobbies.findMany({
      where: {
        status: true,
      },
    });

    hobbies.forEach((item) => delete item.status);
    return res.status(200).json({ message: "success", data: hobbies });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching hobbies." });
  }
};

const getTraits = async (req, res) => {
  try {
    const traits = await prisma.traits.findMany({
      where: {
        status: true,
      },
    });

    traits.forEach((item) => delete item.status);
    return res.status(200).json({ message: "success", data: traits });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching traits." });
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
    !lastName ||
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
    lastName: lastName,
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
    !description
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

const assignEnviroments = async (req, res) => {
  const { childId, enviromentId } = req.body;
  if (!childId || !enviromentId)
    return res.status(422).json({ message: "Required fields are not filled." });

  const childEnviroment = {
    childId: parseInt(childId),
    enviromentId: parseInt(enviromentId),
  };
  try {
    const newChildEnviroment = await prisma.childEnviroments.create({
      data: childEnviroment,
    });

    res.status(200).json({
      message: "success",
      careTakerId: newChildEnviroment.id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while adding care Taker." });
  }
};

const getChildEnviroments = async (req, res) => {
  const { childId } = req.body;
  if (!childId)
    return res.status(422).json({ message: "Required fields are not filled." });
  try {
    const environments = await prisma.enviroments.findMany({
      where: {
        ChildEnviroments: {
          some: {
            childId: childId,
          },
        },
      },
      select: {
        id: true,
        image: true,
        enviromentPath: true,
      },
    });

    return res.status(200).json({ message: "success", data: environments });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  login,
  signup,
  getCareTaker,
  updateProfile,
  updateProfileImage,
  getChildren,
  getChildHobbies,
  getChildTraits,
  getChildrens,
  getHobbies,
  getTraits,
  addChild,
  deleteChild,
  updateChild,
  updateChildImage,
  getUnselectedEnviroments,
  assignEnviroments,
  getChildEnviroments,
};
