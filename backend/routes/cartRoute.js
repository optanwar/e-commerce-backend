const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  mergeCart,
} = require('../controllers/cartContoller');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/cart').get(isAuthenticated, getCart);
router.route('/cart').post(isAuthenticated, addToCart);
router.route('/cart/merge').post(isAuthenticated, mergeCart);
router.route('/cart/:productId').delete(isAuthenticated, removeFromCart);
router.route('/cart/clear/all').delete(isAuthenticated, clearCart);

module.exports = router;
