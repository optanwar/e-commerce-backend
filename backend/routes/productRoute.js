const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController');
const { isAuthenticated ,authorizeRoles } = require('../middleware/auth');


const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/admin/product/new').post(isAuthenticated, authorizeRoles("admin"), createProduct);

router.route('/admin/product/:id').put(isAuthenticated, authorizeRoles("admin"), updateProduct).delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

router.route('/product/:id').get(getProductDetails);

router.route("/review").put(isAuthenticated, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticated, deleteReview);


module.exports = router;