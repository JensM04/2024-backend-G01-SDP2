module.exports = {
    port:9000,
    log: {
        level:'silly',
        disabled: false,
    },
    auth: {
        jwt: {
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
            expirationInterval: 24 * 60 * 60 * 1000, // ms (24 hour)
            issuer: 'b2bportaal.hogent.be',
            audience: 'b2bportaal.hogent.be',
        },
    },
    cors: {
        origins: ['http://localhost:5173'],
        maxAge: 3 * 60 * 60,
    }
};