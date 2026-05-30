const CreditHistory = require("../models/CreditHistory");
const { getCreditBalance } = require("../services/credit.service");

const getBalance = async (req, res, next) => {
  try {
    const balance = await getCreditBalance(req.user._id);

    res.json({ credits: balance });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await CreditHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  getHistory
};
