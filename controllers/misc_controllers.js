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

const verifySession = async (req, res) =>
  res.status(200).json({ message: "verified" });

module.exports = {
  getLookup,
  verifySession,
};
