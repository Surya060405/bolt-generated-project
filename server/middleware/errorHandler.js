/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle specific error types
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON payload sent.'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message
  });
};
