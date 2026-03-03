const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
    const { items } = req.body;

    let totalAmount = 0;

    for (let item of items) {
        const product = await Product.findById(item.product);
        totalAmount += product.price * item.quantity;

        await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -item.quantity }
        });
    }

    const order = await Order.create({
        user: req.user.id,
        items,
        totalAmount
    });

    res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.id })
        .populate("items.product");
    res.json(orders);
};