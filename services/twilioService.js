const initiateCall = async (to, orderId) => {
  // ... existing code ...
} catch (error) {
  console.error('Failed to initiate call:', error);
  throw error;
}
};

const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to,
    });
    console.log(`SMS sent successfully. SID: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    // Not throwing error here to avoid breaking the voice call flow
  }
};

module.exports = {
  initiateCall,
  sendSms,
}; 