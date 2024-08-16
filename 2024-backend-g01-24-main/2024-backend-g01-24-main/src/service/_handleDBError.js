const ServiceError = require('../core/ServiceError');

const handleDBError = (error) => {
    const { code = '' } = error;

    if (code === 'ER_DUP_ENTRY') {
        switch (true) {
        default:
            return ServiceError.validationFailed('This item already exists');
        }
    }

    // Return error because we don't know what happened
    return error;
};

module.exports = handleDBError;