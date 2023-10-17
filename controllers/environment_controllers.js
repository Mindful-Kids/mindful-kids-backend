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
    console.log("ERROR", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const addEnvironment = async (req, res) => {
  const { name, startAge, endAge, enviromentPath, addedById } = req.body;
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
    const newEnviroment = await prisma.enviroment.create({
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

module.exports = {
  getEnvironments,
  addEnvironment,
};
