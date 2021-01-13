const Order = require('../models/order');
const User = require('../models/User');
const config = require('config');
const Stripe = require('stripe');
const stripe = Stripe(config.get('StripeAPIKey'));
const Cart = require('../models/Cart');

module.exports.get_orders = async (req,res) => {
    const userId = req.params.id;
    try{
        let order = await Order.findOne({userId});
        if(order){
            res.send(order);
        }
        else{
            res.send("You have not made any orders yet!");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.checkout = async (req,res) => {
    try{
        const userId = req.body.userId;
        const stripeToken = req.body.stripeToken;
        let user = await User.findOne({_id:userId});
        const userEmail = user.email;
        const userName = user.name;
        const address = req.body.address;
        const amount = req.body.bill;
        let cart = await Cart.findOne({userId});

        stripe.customers.create({
            email: userEmail,
            name: userName,
            source: stripeToken,
            address: address
        })
        .then((customer) => {
            return stripe.charges.create({
                amount: amount*100,
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => { 
            const items = cart.items;
            Order.create({
                userId,
                items: items,
                address: address,
                bill: amount
            }).then((order) => {
                res.send(order);
            })
            
        }) 
        .catch((err) => { 
            res.status(500).send(err) 
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}