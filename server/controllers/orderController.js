import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const { address, paymentMethod, paymentId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.offerPrice || item.product.price,
    }));

    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      totalAmount,
      paymentMethod,
      paymentId: paymentId || null,

      estimatedDeliveryDate,

      statusTimeline: {
        preparing: {
          status: true,
          date: new Date(),
        },
      },

      currentStatus: "PREPARING",
    });

    cart.items = [];
    await cart.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Order placement failed" });
  }
};
