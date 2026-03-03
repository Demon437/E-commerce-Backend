const router = require("express").Router();
const {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");

const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;