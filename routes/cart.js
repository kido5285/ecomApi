const { verifyTokenAndAuth, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const Cart = require("../models/Cart");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

//create cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedCart);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json("Cart deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
});

// //get one cart
router.get("/find/:userid", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userid});
    return res.status(200).json(cart);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// // //get ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        return res.status(200).json(carts);
    } catch (e) {
        return res.status(500).json(e);
    }
})

module.exports = router;
