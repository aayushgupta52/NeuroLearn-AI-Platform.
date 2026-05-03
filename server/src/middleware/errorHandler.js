export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this data already exists'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};
