const handleError = () => (err, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.statusMessage,
        message: err.message,
    });
};

module.exports = { handleError };