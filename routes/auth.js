const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passlib = require('passlib');

//register
router.post("/register", async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(500).send("not enough info");
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    img: req.body.img,
    password: await passlib.create(req.body.password),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(500).json("Wrong credentials");
    }

    if (!(await passlib.verify(user.password, req.body.password))) {
      return res.status(401).json("Wrong password");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    );

    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
