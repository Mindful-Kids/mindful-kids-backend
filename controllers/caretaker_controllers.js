const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const connection = require("../config/db");

const getProfile = async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      console.log(err);
      res.status(403).json({ message: "Forbidden" });
    } else {
      res.status(200).json({ message: "Profile accessed!", authData });
    }
  });
};

const addChild = async (req, res, next) => {
  const {
    first_name,
    last_name,
    gender,
    dateOfBirth,
    hobbies,
    description,
    parent,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !gender ||
    !dateOfBirth ||
    !hobbies ||
    !description ||
    !req.file
  )
    return res.status(422).json({ message: "Required fields are not filled." });

  const upload = await cloudinary.v2.uploader
    .upload(req.file.path)
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred while uploading image." });
    });

  const query = `INSERT INTO children (first_name, last_name, gender, date_of_birth, parent, description, image_path) VALUES ('${first_name}', '${last_name}', '${gender}', '${dateOfBirth}', '${parent}', '${description}', '${upload.secure_url}')`;
  try {
    connection.query(query, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      console.log(result);
      res.status(200).json({ message: "Child added successfully." });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while adding child." });
  }
};

module.exports = {
  getProfile,
  addChild,
};
