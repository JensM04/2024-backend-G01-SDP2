module.exports = {
    log: {
        level: 'info',
        disabled: false,
    },
    port:9000,
    auth: {
        jwt: {
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
            expirationInterval: 24 * 60 * 60 * 1000, // ms (24 hour)
            issuer: 'b2bportaal.hogent.be',
            audience: 'b2bportaal.hogent.be',
        },
    },
    cors: {
        origins: ['https://two024-frontend-g01-24.onrender.com'],
        maxAge: 3 * 60 * 60,
    }
};