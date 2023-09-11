const connection = require("../config/db");

const getEnvironments = async (req, res) => {
  // TODO: check jwt token

  const query =
    "SELECT environment.id, environment.name, environment.image_path as environmentImage, children.image_path as childrenImage FROM environment LEFT JOIN child_environment ON environment.id = child_environment.env_id LEFT JOIN children ON children.id = child_environment.child_id";

  connection.request().query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    const environments = result.recordset;
    const aggregatedData = {};

    environments.forEach((item) => {
      const { id, childrenImage, ...rest } = item;

      if (!aggregatedData[id]) {
        aggregatedData[id] = {
          id,
          ...rest,
          childrenImages: [],
        };
      }

      aggregatedData[id].childrenImages.push(childrenImage);
    });

    const aggregatedResult = Object.values(aggregatedData);
    res.status(200).json({ result: aggregatedResult });
  });
};

module.exports = {
  getEnvironments,
};
