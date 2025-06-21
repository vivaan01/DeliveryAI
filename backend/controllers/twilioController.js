const Order = require('../models/Order');
const twilio = require('twilio');
const { getIntent } = require('../services/nlpService');
const { sendSms } = require('../services/twilioService');

const handleVoiceResponse = async (req, res) => {
  const { orderId } = req.query;
  const { SpeechResult, Confidence, CallSid } = req.body;

  console.log(`Voice response for order ${orderId}: "${SpeechResult}" (Confidence: ${Confidence})`);

  try {
    // Get intent from NLP service
    const intent = await getIntent(SpeechResult);
    console.log(`Intent classified as: ${intent}`);

    // Update the order with the call log
    const order = await Order.findOneAndUpdate(
      { _id: orderId, 'callLogs.callSid': CallSid },
      {
        $set: {
          'callLogs.$.status': 'completed',
          'callLogs.$.customerResponse': SpeechResult,
          'callLogs.$.intent': intent,
        }
      },
      { new: true }
    ).populate('deliveryPartner', 'contactNumber name');

    if (!order) {
        console.error(`Could not find order with ID ${orderId} and CallSid ${CallSid} to update.`);
        // Respond to Twilio to prevent a timeout error on their end
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('We could not find your order details. Please contact support.');
        twiml.hangup();
        return res.type('text/xml').send(twiml.toString());
    }

    // Handle response based on intent
    let smsMessage = `DeliveryAI Update for Order for ${order.customerName}: Customer response was '${SpeechResult}' (Intent: ${intent}).`;
    if (intent === 'NOT_AVAILABLE' || intent === 'OUT_OF_LOCATION') {
        smsMessage = `DeliveryAI Alert for ${order.customerName}'s Order: Customer is not available (Response: '${SpeechResult}'). Please coordinate.`;
        order.status = 'rescheduled';
        await order.save();
    }

    // Send SMS to delivery partner if they exist
    if (order.deliveryPartner && order.deliveryPartner.contactNumber) {
        await sendSms(order.deliveryPartner.contactNumber, smsMessage);
    }

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Thank you for your response. We have updated the delivery partner. Goodbye.');
    twiml.hangup();

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (error) {
    console.error('Error handling voice response:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  handleVoiceResponse,
}; 