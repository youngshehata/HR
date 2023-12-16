require("dotenv").config();
const Token = require("../models/TokenModel");
const { generateAccessToken } = require("../utilities/jwtGenerator");
const jwt = require("jsonwebtoken");

const authenticateJWT = async (req, res, next) => {
  const cookies = req.cookies;
  // if user has no tokens
  if (Object.keys(cookies).length === 0) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies["jwt"];
  const accessToken = cookies["token"];
  if (!accessToken && !refreshToken) {
    return res.sendStatus(401);
  }

  try {
    // if user has no access token but has the refresh token
    let validRegenration = true;

    if (!accessToken) {
      const newAccessToken = await generateAccessToken(refreshToken);
      if (!newAccessToken) {
        validRegenration = "error";
      } else {
        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 15,
        });
        return res.redirect(req.originalUrl);
      }
    }

    if (validRegenration) {
      return next();
    } else if (validRegenration === "error") {
      return res.sendStatus(401);
    }
    //  else {
    //   return res.sendStatus(401);
    // }

    // if user has both just validate the access token
    const validAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!validAccessToken) {
      // thats suspicious
      await Token.deleteOne({ token: refreshToken });
      res.clearCookie("jwt");
      res.clearCookie("token");
      return res.sendStatus(401);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    if (error.message === "invalid signature") {
      await Token.deleteOne({ token: refreshToken });
      res.clearCookie("jwt");
      res.clearCookie("token");
    }
    return res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
