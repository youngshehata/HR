const bcrypt = require("bcrypt");
const User = require("../models/UserModel.js");
const { generateTwoTokens } = require("../utilities/jwtGenerator.js");
const Token = require("../models/TokenModel.js");

// *****************************************************************************************************
// **** CREATE ****
// *****************************************************************************************************

const createNewUser = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json(`Please provide valid username and password`);
    }
    if (!req.body.secretQuestion || !req.body.secretAnswer) {
      return res
        .status(400)
        .json(`Please provide valid secret question and secret answer`);
    }
    if (req.body.password.toString().length < 4) {
      return res.status(400).json(`Password minimum length of characters is 4`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedAnswer = await bcrypt.hash(req.body.secretAnswer, salt);
    const newUser = new User({
      name: req.body.username,
      password: hashedPassword,
      secretQuestion: req.body.secretQuestion,
      secretAnswer: hashedAnswer,
    });
    await newUser.save();

    //jwt generator
    const { accessToken, refreshToken } = await generateTwoTokens({
      _id: newUser._id,
      name: newUser.name,
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 18 * 60 * 60 * 1000,
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 15,
    });
    // res.status(200).json(accessToken);
    res.status(200).json("SUCCESS");
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** LOGIN ****
// *****************************************************************************************************

const login = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json(`Please provide valid username and password`);
    }
    const userFound = await User.findOne(
      { name: req.body.username },
      "name password"
    );
    if (!userFound) {
      return res.status(404).json("Invalid username or password");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      userFound.password
    );
    if (!validPassword) {
      return res.status(404).json("Invalid username or password");
    }

    //jwt generator
    const { accessToken, refreshToken } = await generateTwoTokens({
      _id: userFound._id,
      name: userFound.name,
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 18 * 60 * 60 * 1000,
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 15,
    });
    res.status(200).json("Logged in successfully");
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** LOGOUT ****
// *****************************************************************************************************

const logout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    // if user has no tokens
    if (Object.keys(cookies).length === 0) {
      return res.status(304).json(`Already logged out`);
    }

    // check if cookies contains the 2 tokens
    const refreshToken = cookies["jwt"];
    const accessToken = cookies["token"];
    if (!accessToken && !refreshToken) {
      return res.status(304).json(`Already logged out`);
    }

    // remove access token from cookies if exists
    if (accessToken) {
      res.clearCookie("token");
    }

    // remove refresh token from db and from cookies
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });
      res.clearCookie("jwt");
    }

    res.status(200).redirect("/");
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** CHECK ****
// *****************************************************************************************************

const checkForUsername = async (req, res, next) => {
  try {
    if (!req.body || !req.body.username) {
      return res.status(400).json(`Please provide valid username`);
    }

    const foundInDB = await User.findOne(
      { name: req.body.username },
      "secretQuestion"
    );
    if (!foundInDB) {
      return res.status(404).json("Invalid username");
    }

    res.status(200).json(foundInDB.secretQuestion);
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** RESET PASSWORD ****
// *****************************************************************************************************

const resetPassword = async (req, res, next) => {
  try {
    if (
      !req.body ||
      !req.body.username ||
      !req.body.secretAnswer ||
      !req.body.newPassword ||
      !req.body.newPasswordConfirm
    ) {
      return res.status(400).json(`Invalid values provided`);
    }

    if (req.body.newPassword !== req.body.newPasswordConfirm) {
      return res.status(400).json(`Password dosent match the confirmation`);
    }

    if (req.body.newPassword.toString().length < 4) {
      return res.status(400).json(`Password minimum length of characters is 4`);
    }

    const foundInDB = await User.findOne(
      { name: req.body.username },
      "secretAnswer password name"
    );
    if (!foundInDB) {
      return res.status(404).json("Invalid username");
    }

    const isValidAnswer = await bcrypt.compare(
      req.body.secretAnswer,
      foundInDB.secretAnswer
    );

    if (!isValidAnswer) {
      return res.status(400).json("Invalid answer");
    }

    const salt = await bcrypt.genSalt(10);
    const encPassword = await bcrypt.hash(req.body.newPassword, salt);

    await User.updateOne(foundInDB, { $set: { password: encPassword } });

    res.status(200).json("Password Updated");
  } catch (error) {
    next(error);
  }
};

module.exports.createNewUser = createNewUser;
module.exports.login = login;
module.exports.logout = logout;
module.exports.checkForUsername = checkForUsername;
module.exports.resetPassword = resetPassword;
