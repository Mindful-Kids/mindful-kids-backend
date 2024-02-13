const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { userOTPs, generateOTP } = require("../lib/utils");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const login = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password)
    return res.status(422).json({ message: "Required fields are not filled." });

  let existingUser;
  try {
    existingUser = await prisma.careTakers.findUnique({
      where: {
        email: Email,
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
    isValidPassword = await bcrypt.compare(Password, existingUser.password);
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
        res.status(500).json({
          message: "An error occurred while generating token.",
        });
      }
      res.json({ message: "success", data: careTaker, token });
    }
  );
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(422).json({ message: "Sender Email is not provided." });

  const existingUser = await prisma.careTakers.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser)
    return res
      .status(403)
      .json({ message: "Account with this email already exists." });

  const otp = generateOTP();

  const mailOptions = {
    from: `Mindful Kids ${process.env.EMAIL_USER}`,
    to: email,
    subject: "Mindful Kids OTP",
    text: `Your One-time password(OTP) is: ${otp}`,
  };

  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ error: "Failed to send OTP" });
      } else {
        userOTPs[email] = otp;
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send verification code" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = userOTPs[email];

  if (storedOTP && storedOTP === otp) {
    delete userOTPs[email];
    return res.status(200).json({ message: "Verification Successfull" });
  } else {
    return res.status(400).json({ message: "Invalid verification code" });
  }
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

const updateProfile = async (req, res) => {
  const careTakerId = req.authData.id;
  const { firstName, lastName, genderId, typeId } = req.body;
  if (!firstName || !genderId || !typeId)
    return res.status(422).json({ message: "Required fields are not filled." });

  try {
    const updatedCareTaker = await prisma.careTakers.update({
      where: {
        id: careTakerId,
      },
      data: {
        firstName: firstName,
        lastName: lastName ?? "",
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
    return res
      .status(500)
      .json({ message: "Error occurred while updating profile image." });
  }
};

const getChildren = async (req, res) => {
  const parentId = req.authData.id;
  try {
    const children = await prisma.$transaction(async (prisma) => {
      const children = await prisma.children.findMany({
        where: {
          parentId: parseInt(parentId),
          status: true,
        },
      });
      children.forEach((item) => delete item.status);
      children.forEach((item) => delete item.parentId);

      await Promise.all(
        children.map(async (child) => {
          const traits = await prisma.traits.findMany({
            where: {
              ChildTraits: {
                some: {
                  childId: parseInt(child.id),
                },
              },
              status: true,
            },
          });
          child.traits = traits.map((item) => {
            delete item.status;
            return item;
          });
        })
      );

      await Promise.all(
        children.map(async (child) => {
          const hobbies = await prisma.hobbies.findMany({
            where: {
              ChildHobbies: {
                some: {
                  childId: parseInt(child.id),
                },
              },
              status: true,
            },
          });
          child.hobbies = hobbies.map((item) => {
            delete item.status;
            return item;
          });
        })
      );

      return children;
    });

    return res.status(200).json({
      message: "success",
      data: children,
    });
  } catch (error) {
    console.log(error);
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

  if (!firstName || !genderId || !dateOfBirth || !hobbies || !traits)
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
    return res
      .status(500)
      .json({ message: "Error occurred while adding child." });
  }
};

const deleteChild = async (req, res) => {
  const childId = req.params.id;
  try {
    await prisma.children.update({
      where: {
        id: parseInt(childId),
      },
      data: { status: false },
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while deleting child." });
  }
};

const updateChild = async (req, res) => {
  // const parentId = req.authData.id;
  const {
    id,
    firstName,
    lastName,
    genderId,
    dateOfBirth,
    hobbies,
    traits,
    description,
    environments,
  } = req.body;

  if (!id || !firstName || !genderId || !dateOfBirth || !hobbies || !traits)
    return res.status(422).json({ message: "Required fields are not filled." });

  const newHobbies = hobbies.split(",").map((id) => parseInt(id));
  const newTraits = traits.split(",").map((id) => parseInt(id));
  const updatedHobbies = [];
  const updatedTraits = [];
  let newEnvironments = null;
  if (environments) {
    newEnvironments = environments.split(",").map((id) => parseInt(id));
  }

  try {
    const updatedChild = await prisma.$transaction(async (prisma) => {
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

      await prisma.childEnviroments.deleteMany({
        where: {
          childId: parseInt(id),
        },
      });

      if (environments) {
        await Promise.all(
          newEnvironments.map(async (enviroment) => {
            const newChildEnviroment = await prisma.childEnviroments.create({
              data: {
                childId: parseInt(id),
                enviromentId: parseInt(enviroment),
              },
            });
            return newChildEnviroment;
          })
        );
      }

      await prisma.childHobbies.deleteMany({
        where: {
          childId: parseInt(id),
        },
      });

      await Promise.all(
        newHobbies.map(async (hobby) => {
          const createdChildHhobbies = await prisma.childHobbies.create({
            data: {
              childId: parseInt(id),
              hobbyId: parseInt(hobby),
            },
          });
          const hobbiesData = await prisma.hobbies.findUnique({
            where: {
              id: createdChildHhobbies.hobbyId,
            },
            select: {
              id: true,
              name: true,
            },
          });
          updatedHobbies.push(hobbiesData);
          updatedChild.hobbies = updatedHobbies;
          return createdChildHhobbies;
        })
      );

      await prisma.childTraits.deleteMany({
        where: {
          childId: parseInt(id),
        },
      });

      await Promise.all(
        newTraits.map(async (trait) => {
          const createdChildTrait = await prisma.childTraits.create({
            data: {
              childId: parseInt(id),
              traitId: parseInt(trait),
            },
          });
          const traitData = await prisma.traits.findUnique({
            where: {
              id: createdChildTrait.traitId,
            },
            select: {
              id: true,
              name: true,
            },
          });
          updatedTraits.push(traitData);
          updatedChild.traits = updatedTraits;
          return createdChildTrait;
        })
      );
      return updatedChild;
    });

    res.status(200).json({
      message: "success",
      child: updatedChild,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating child." });
  }
};

const assignEnvironment = async (req, res) => {
  const { childId, environments } = req.body;
  if (!childId)
    return res.status(422).json({ message: "Required fields are not filled." });

  let newEnvironments = environments.split(",").map((id) => parseInt(id));

  console.log(newEnvironments);

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.childEnviroments.deleteMany({
        where: {
          childId: parseInt(childId),
        },
      });
      await Promise.all(
        newEnvironments.map(async (enviroment) => {
          const newChildEnviroment = await prisma.childEnviroments.create({
            data: {
              childId: parseInt(childId),
              enviromentId: parseInt(enviroment),
            },
          });
        })
      );
    });

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while assigning environment." });
  }
};

const updateChildImage = async (req, res) => {
  const { childId } = req.body;
  if (!req.file)
    return res.status(422).json({ message: "Required fields are not filled." });

  const upload = await cloudinary.v2.uploader
    .upload(req.file.path, { folder: process.env.CLOUDINARY_FOLDER_NAME })
    .catch((err) => {
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
    return res
      .status(500)
      .json({ message: "Error occurred while updating Image." });
  }
};

module.exports = {
  login,
  signup,
  sendOTP,
  verifyOTP,

  updateProfile,
  updateProfileImage,

  getChildren,
  addChild,
  deleteChild,
  updateChild,
  assignEnvironment,
  updateChildImage,
};
