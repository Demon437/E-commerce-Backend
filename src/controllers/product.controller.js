const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category, subcategory, brand, colors, sizes, material, fit, is_featured, is_best_seller, is_trending, images } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Product title is required" });
        }
        if (!price || price <= 0) {
            return res.status(400).json({ error: "Valid price is required" });
        }
        if (stock === undefined || stock < 0) {
            return res.status(400).json({ error: "Valid stock is required" });
        }
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }
        if (!images || images.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }

        const newProduct = await Product.create({
            title: title.trim(),
            description: description || '',
            price: Number(price),
            stock: Number(stock),
            category,
            subcategory: subcategory || 'shirts',
            brand: brand || '',
            colors: colors || [],
            sizes: sizes || [],
            material: material || '',
            fit: fit || 'regular',
            images,
            is_featured: Boolean(is_featured),
            is_best_seller: Boolean(is_best_seller),
            is_trending: Boolean(is_trending),
            rating: 0
        });

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: error.message || "Error creating product" });
    }
};

exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find()
        .populate("category")
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json(products);
};

exports.getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
};