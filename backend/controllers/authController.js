const loginUser = async (req, res) => {
  try {
    // ... existing code ...
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all delivery partners
// @route   GET /api/auth/delivery-partners
// @access  Private/Admin
const getDeliveryPartners = async (req, res) => {
  try {
    const users = await User.find({ role: 'Delivery Partner' }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getDeliveryPartners,
};
