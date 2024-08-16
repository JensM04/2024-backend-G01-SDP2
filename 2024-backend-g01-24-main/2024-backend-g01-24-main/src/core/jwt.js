const config = require('config');
const jwt = require('jsonwebtoken');

const { getLogger } = require('./logging');

const JWT_AUDIENCE = config.get('auth.jwt.audience');
const JWT_SECRET = config.get('auth.jwt.secret');
const JWT_ISSUER = config.get('auth.jwt.issuer');
const JWT_EXPIRATION_INTERVAL = config.get('auth.jwt.expirationInterval');

const generateJWT = (user, bedrijfId) => {
    const tokenData = {
        userId: user.ID,
        role: user.DTYPE,
        bedrijfId: bedrijfId
    };

    const signOptions = {
        expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
        subject: 'auth',
    };

    return new Promise((resolve, reject) => {
        jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
            if (err) {
                getLogger().error('Error while signing new token:', err.message);
                return reject(err);
            }
            return resolve(token);
        });
    });
};

const verifyJWT = (authToken) => {

    const verifyOptions = {
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
        subject: 'auth',
    };

    return new Promise((resolve, reject) => {
        jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
            if (err || !decodedToken) {
                getLogger().error('Error while verifying token:', err.message);
                return reject(err || new Error('Token could not be parsed'));
            }
            return resolve(decodedToken);
        });
    });
};

module.exports = {
    generateJWT,
    verifyJWT,
};