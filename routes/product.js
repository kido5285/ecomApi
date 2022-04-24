const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

//create prod
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProd = new Product(req.body);
  try {
    const savedProd = await newProd.save();
    return res.status(200).json(savedProd);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProd = await newProd.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedProd);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("Product deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
});

// //get one prod
router.get("/find/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    return res.status(200).json(prod);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// //get ALL prod
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCat = req.query.category;
  let prods;
  try {
    if (qNew) {
      prods = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCat) {
      prods = await Product.find({
        categories: {
          $in: [qCat],
        },
      });
    } else {
      prods = await Product.find();
    }
    return res.status(200).json(prods);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
