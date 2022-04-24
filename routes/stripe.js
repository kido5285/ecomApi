const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SEC);

router.post('/payment', (req, response) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (err, res) => {
        if(err) {
            return response.status(500).json(err);
        } else {
            return response.status(200).json(err);
        }
    })
})

module.exports = router;