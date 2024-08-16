const crypto = require('crypto');

function hashPassword(password, salt) {
  
    return crypto.createHash('sha256').update(password+salt).digest('hex');
}

const verifyPassword = async (password, salt, passwordHash) => {
    const newHash = hashPassword(password,salt);
    return newHash === passwordHash;
};

module.exports = {
    hashPassword,
    verifyPassword,
};