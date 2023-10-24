const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getLookup = async (req, res) => {
  try {
    const lookupArray = await prisma.lookup.findMany();

    let lookup = {};
    lookupArray.forEach(function (value) {
      let key = value["value"];
      lookup[key] = { id: value["id"], category: value["category"] };
    });
    res.status(200).json({ data: lookup });
  } catch (error) {
    res.status(500).json({ message: "Fix Lookup" });
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

const verifySession = async (req, res) =>
  res.status(200).json({ message: "verified" });

module.exports = {
  getLookup,
  getHobbies,
  getTraits,

  verifySession,
};
