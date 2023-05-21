const express = require("express");
const router = express.Router();
const product = require("../controller/product");

// midleware to get pagination info
router.use((req, res, next) => {
    page = parseInt(req.query.page) || 1;
    page_items = parseInt(req.query.page_items) || 10;

    req.pagination = {
        page,
        page_items,
        skip: (page - 1) * page_items,
        limit: page_items,
    };

    next();
});


router.get("/", product.getAllProducts);
router.get("/categories", product.getProductCategories);
router.get("/category/:category", product.getProductsInCategory);
router.get("/search", product.getSearchProducts);
router.get("/:id", product.getProduct);
router.post("/", product.addProduct);
router.put("/:id", product.editProduct);
router.patch("/:id", product.editProduct);
router.delete("/:id", product.deleteProduct);

module.exports = router;
