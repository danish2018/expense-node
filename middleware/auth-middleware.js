import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Unauthorized HTTP,Token not Provided" });
  }
  const jwtToken = token.replace("Bearer ", "").trim();
  // console.log(jwtToken)

  try {
    const isVarified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const userData = await User.findOne({ email: isVarified.email }).select({
      password: 0,
    });

    req.user = userData;
    req.token = token;
    // req.userID = userData._id;
    req.userID = userData._id.toString();

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Unauthorized HTTP,Token not Provided" });
  }
};

export default authMiddleware;
