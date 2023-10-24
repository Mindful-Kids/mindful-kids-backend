const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSelectedEnviroments = async (req, res) => {
  const childId = req.params.id;
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

const assignEnviroment = async (req, res) => {
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
    return res
      .status(500)
      .json({ message: "Error occurred while fetching children traits." });
  }
};

module.exports = {
  getChildHobbies,
  getChildTraits,
  getUnselectedEnviroments,
  assignEnviroment,
  getSelectedEnviroments,
};
