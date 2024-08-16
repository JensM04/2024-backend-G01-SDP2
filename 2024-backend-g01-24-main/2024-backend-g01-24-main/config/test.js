module.exports = {
    port:9000,
    log: {
        level:'silly',
        disabled: false,
    },
    cors: {
        origins: '*',
        maxAge: 60 * 60 * 1000,
    },
    auth: {
        jwt: {
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
            expirationInterval: 24 * 60 * 60 * 1000, // ms (24 hour)
            issuer: 'b2bportaal.hogent.be',
            audience: 'b2bportaal.hogent.be',
        },
    },
};