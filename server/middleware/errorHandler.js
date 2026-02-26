const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(err.message);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  res.status(500).json({ message: 'Server error' });
};

module.exports = errorHandler;
