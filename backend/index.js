// ... other routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/twilio', require('./routes/twilio'));

app.get('/', (req, res) => {
// ... rest of the file
