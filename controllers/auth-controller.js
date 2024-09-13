import User from "../models/user-model.js";
import bcrypt from "bcrypt";

const registration = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ error: true, message: "User Already Exist" });
    }

    const userCreated = await User.create({ username, email, phone, password });
    res.status(201).json({ error: false, message: userCreated });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({error:true, message: "Invalid Credetials" });
    }

    const user = await bcrypt.compare(password, userExist.password);

    if (user) {
      res.status(200).json({
        message: "Login Success",
        token: await userExist.generateToken(),
        UserId: userExist._id.toString(),
        userName: userExist.username,
        email: userExist.email,
        phone: userExist.phone,
      });
    } else {
      res
        .status(400)
        .json({ error: true, message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server error" });
  }
};

export { registration, login };
