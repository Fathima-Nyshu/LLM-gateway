function errorHandler(err, req, res, next) {
  console.error('ERROR MESSAGE:', err.message);
  console.error('STATUS:', err.response?.status);
  console.error('RESPONSE DATA:', err.response?.data);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

module.exports = errorHandler;