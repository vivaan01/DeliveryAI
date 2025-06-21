const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'out for delivery', 'completed', 'rescheduled', 'cancelled'],
    default: 'pending',
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  callLogs: [{
    callSid: String,
    status: String,
    customerResponse: String,
    intent: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema); 