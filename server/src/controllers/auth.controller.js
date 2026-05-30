const User = require("../models/User");
const Project = require("../models/Project");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  credits: user.credits
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error("name, email, password are required");
      error.statusCode = 400;
      throw error;
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!normalizedName) {
      const error = new Error("name is required");
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password
    });

    await Project.create({
      userId: user._id,
      name: "Project dau tien"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      const error = new Error("Email or password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      const error = new Error("Email or password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({
    user: sanitizeUser(req.user)
  });
};

module.exports = {
  register,
  login,
  me
};
