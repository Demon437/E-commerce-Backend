const router = require("express").Router();
const {
    createOrder,
    getMyOrders
} = require("../controllers/order.controller");

const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

module.exports = router;