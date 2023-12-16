const jwt = require("jsonwebtoken");
require("dotenv").config();
const Token = require("../models/TokenModel");
const User = require("../models/UserModel");

const generateTwoTokens = async (userObject) => {
  try {
    // creating plain object cuz userObject might be monogo object
    const cloneObject = { ...userObject };
    const accessToken = jwt.sign(cloneObject, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      cloneObject,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "18h",
      }
    );
    await Token.create({ user: userObject._id, token: refreshToken });
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
};

const generateAccessToken = async (refToken) => {
  try {
    // creating plain object cuz userObject might be monogo object

    const refreshTokenInDB = await Token.findOne({ token: refToken });
    if (!refreshTokenInDB) {
      return false;
    }

    // verify the refresh token
    const isValid = jwt.verify(
      refreshTokenInDB.token,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!isValid) {
      await Token.deleteOne(refreshTokenInDB);
      return false;
    }

    // getting the user
    const userInDB = await User.findById(refreshTokenInDB.user, "name");
    const userObject = { name: userInDB.name, _id: userInDB._id };

    const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    return accessToken;
  } catch (err) {
    console.log(err);
  }
};

module.exports.generateTwoTokens = generateTwoTokens;
module.exports.generateAccessToken = generateAccessToken;
