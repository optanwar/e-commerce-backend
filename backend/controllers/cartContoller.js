const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.getCart = catchAsyncErrors(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  res.status(200).json({ success: true, cart: cart || { items: [] } });
});

exports.addToCart = catchAsyncErrors(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const index = cart.items.findIndex(i => i.product.toString() === productId);
  if (index > -1) {
    cart.items[index].quantity = quantity;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url || '',
    });
  }
  cart.updatedAt = Date.now();
  await cart.save();
  res.status(200).json({ success: true, cart });
});

exports.removeFromCart = catchAsyncErrors(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  cart.updatedAt = Date.now();
  await cart.save();
  res.status(200).json({ success: true, cart });
});

exports.clearCart = catchAsyncErrors(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.status(200).json({ success: true, message: 'Cart cleared' });
});

exports.mergeCart = catchAsyncErrors(async (req, res) => {
  const { guestItems } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });
  guestItems.forEach(guestItem => {
    const idx = cart.items.findIndex(i => i.product.toString() === guestItem.product);
    if (idx > -1) {
      cart.items[idx].quantity += guestItem.quantity;
    } else {
      cart.items.push(guestItem);
    }
  });
  cart.updatedAt = Date.now();
  await cart.save();
  res.status(200).json({ success: true, cart });
});
