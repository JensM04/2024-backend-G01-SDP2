const userService = require('../service/user');

const requireAuthentication = async (ctx, next) => {
    const  {authorization} = ctx.headers;

    const {authToken, ...session} = await userService.checkAndParseSession(authorization);

    ctx.state.session = session;
    ctx.state.authToken = authToken;

    return next();

};

const makeRequireRole = (wantedRole) => async(ctx,next) => {
    const {role} = ctx.state.session;
    userService.checkRole(wantedRole, role);

    return next();
};

module.exports = {requireAuthentication, makeRequireRole};