import { UserModel } from "../../database/user/user.model.js";
import { generateToken } from "./authentication.helper.js";

export const registerUser = async (req, res, next) => {
  try {
    const {
      body: { name, number, type, email, password },
    } = req;

    if (!email || !password) {
      return res.send({
        code: "201",
        success: true,
        message: "Payload is Required",
      });
    }

    let user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already exists" });

    user = new UserModel({ name, email, password, role: type, number });
    await user.save();

    return res.send({
      code: "200",
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.send({ error: error.message, code: "400", success: true });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;

    if (!email || !password) {
      return res.send({
        code: "201",
        success: true,
        message: "Email & password are Required",
      });
    }

    let user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.send({
        code: "201",
        success: true,
        message: "Invalid email or password",
      });
    }
    const token = await generateToken(user);

    return res.send({
      code: "200",
      success: true,
      message: "User registered successfully",
      data: { token, user: { id: user._id, name: user.name, email: user.email } }
    });
  } catch (error) {
    return res.send({ error: error.message, code: "400", success: true });
  }
};
