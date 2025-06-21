const Order = require('../models/Order');
const { initiateCall } = require('../services/twilioService');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/Admin
const createOrder = async (req, res) => {
  const { customerName, contactNumber, address, deliveryTime, deliveryPartner } = req.body;

  try {
    const order = new Order({
      customerName,
      contactNumber,
      address,
      deliveryTime,
      deliveryPartner, // This should be the User ID of a delivery partner
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'Admin') {
      // Admin can see all orders
      orders = await Order.find({}).populate('deliveryPartner', 'name email');
    } else {
      // Delivery partner can only see orders assigned to them
      orders = await Order.find({ deliveryPartner: req.user._id }).populate('deliveryPartner', 'name email');
    }
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('deliveryPartner', 'name email');

    if (order) {
        // Ensure that delivery partner can only access their own orders
        if (req.user.role !== 'Admin' && order.deliveryPartner._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Not authorized to view this order' });
        }
      res.json(order);
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
    const { status, deliveryPartner } = req.body;
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Check if user is authorized to update this order
             if (req.user.role !== 'Admin' && order.deliveryPartner._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ msg: 'Not authorized to update this order' });
            }

            order.status = status || order.status;
            if (req.user.role === 'Admin') {
                order.deliveryPartner = deliveryPartner || order.deliveryPartner;
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);

        } else {
            res.status(404).json({ msg: 'Order not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await Order.findByIdAndDelete(req.params.id);
            res.json({ msg: 'Order removed' });
        } else {
            res.status(404).json({ msg: 'Order not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Dispatch an order and initiate AI call
// @route   POST /api/orders/:id/dispatch
// @access  Private/Admin
const dispatchOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = 'out for delivery';
            
            // Initiate Twilio Call Service
            const callSid = await initiateCall(order.contactNumber, order._id);

            // Log the call initiation
            order.callLogs.push({
                callSid,
                status: 'initiated',
            });
            
            await order.save();

            res.json({ msg: `Order dispatched, call initiated with SID: ${callSid}`, order });

        } else {
            res.status(404).json({ msg: 'Order not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  dispatchOrder,
}; 