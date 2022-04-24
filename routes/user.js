const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.encrypt_key
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("user deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
});

//get one user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//get ALL user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find({}).sort({ _id: -1 }).limit(1)
      : await User.find({});
    users.filter((user) => {
      const { password, ...others } = user._doc;
      return others;
    });
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//get all users
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
