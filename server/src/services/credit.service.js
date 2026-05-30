const User = require("../models/User");
const CreditHistory = require("../models/CreditHistory");

const getCreditBalance = async (userId) => {
  const user = await User.findById(userId).select("credits");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user.credits;
};

const ensureEnoughCredits = async (userId, requiredAmount) => {
  const credits = await getCreditBalance(userId);

  if (credits < requiredAmount) {
    const error = new Error("Not enough credits");
    error.statusCode = 400;
    throw error;
  }
};

const deductCredits = async ({ userId, amount, description }) => {
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: userId,
      credits: { $gte: amount }
    },
    {
      $inc: {
        credits: -amount
      }
    },
    {
      new: true,
      select: "credits"
    }
  );

  if (!updatedUser) {
    const error = new Error("Not enough credits");
    error.statusCode = 400;
    throw error;
  }

  await CreditHistory.create({
    userId,
    type: "use",
    amount,
    description
  });

  return updatedUser.credits;
};

const topupCredits = async ({ userId, amount, description }) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        credits: amount
      }
    },
    {
      new: true,
      select: "credits"
    }
  );

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await CreditHistory.create({
    userId,
    type: "topup",
    amount,
    description
  });

  return updatedUser.credits;
};

module.exports = {
  getCreditBalance,
  ensureEnoughCredits,
  deductCredits,
  topupCredits
};
