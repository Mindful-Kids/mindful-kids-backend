const cloudinary = require("../config/cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getEnvironments = async (req, res) => {
  try {
    const environments = await prisma.enviroments.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        name: true,
        image: true,
        enviromentPath: true,
      },
    });

    return res.status(200).json({ message: "success", data: environments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while retreiving enviroments." });
  }
};

const addEnvironment = async (req, res) => {
  const { name, startAge, endAge, enviromentPath, addedById } = req.body;
  console.log(req.file);
  if (
    !name ||
    !startAge ||
    !endAge ||
    !enviromentPath ||
    !addedById ||
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

  const enviroment = {
    name: name,
    startAge: parseInt(startAge),
    endAge: parseInt(endAge),
    enviromentPath: enviromentPath,
    addedById: parseInt(addedById),
    image: upload.secure_url,
  };

  try {
    const newEnviroment = await prisma.enviroments.create({
      data: enviroment,
    });

    res.status(200).json({
      message: "Enviroment added successfully.",
      environmetId: newEnviroment.id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while adding enviroment." });
  }
};

const getSelectedEnviroments = async (req, res) => {
  const childId = req.params.id;
  if (!childId)
    return res.status(422).json({ message: "Required fields are not filled." });

  try {
    const environments = await prisma.$transaction(async (prisma) => {
      const allEnvironments = await prisma.enviroments.findMany({
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      const childEnvironments = await prisma.enviroments.findMany({
        where: {
          ChildEnviroments: {
            some: {
              childId: parseInt(childId),
            },
          },
        },
        select: {
          id: true,
        },
      });

      const environments = allEnvironments.map((env) => ({
        ...env,
        isSelected: childEnvironments.some(
          (childEnv) => childEnv.id === env.id
        ),
      }));

      return environments;
    });

    return res.status(200).json({ message: "success", data: environments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while fetching enviroments." });
  }
};

const getUnselectedEnviroments = async (req, res) => {
  const childId = req.params.id;
  try {
    const unselectedEnvironments = await prisma.enviroments.findMany({
      where: {
        NOT: {
          ChildEnviroments: {
            some: {
              childId: parseInt(childId),
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return res
      .status(200)
      .json({ message: "success", data: unselectedEnvironments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while retreiving enviroments." });
  }
};

module.exports = {
  getEnvironments,
  addEnvironment,

  getUnselectedEnviroments,
  getSelectedEnviroments,
};
