const bodyParser = require('koa-bodyparser');
const config = require('config');
const koaCors = require('@koa/cors');
const koaHelmet = require('koa-helmet');
const emoji = require('node-emoji');
const { koaSwagger } = require('koa2-swagger-ui');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = require('../swagger.config');

const { getLogger } = require('./logging');
const ServiceError = require('./ServiceError');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';



module.exports = function installMiddelwares(app) {
    app.use(
        koaCors({
            origin: (ctx) => {
                if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
                    return ctx.request.header.origin;
                }
                // Not a valid domain at this point, let's return the first valid as we should return a string
                return CORS_ORIGINS[0];
            },
            allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
            maxAge: CORS_MAX_AGE,
        })
    );
    
    app.use(async (ctx, next) => {
        getLogger().info(`${emoji.get('fast_forward')} ${ctx.method} ${ctx.url}`);
  
        const getStatusEmoji = () => {
            if (ctx.status >= 500) return emoji.get('skull');
            if (ctx.status >= 400) return emoji.get('x');
            if (ctx.status >= 300) return emoji.get('rocket');
            if (ctx.status >= 200) return emoji.get('white_check_mark');
            return emoji.get('rewind');
        };
  
        try {
            await next();
  
            getLogger().info(
                `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`
            );
        } catch (error) {
            getLogger().error(
                `${emoji.get('x')} ${ctx.method} ${ctx.status} ${ctx.url}`,
                {
                    error,
                }
            );
  
            throw error;
        }
    });
  
    app.use(bodyParser());

    app.use(koaHelmet({
        // geen koahelmet in development, geeft problemen met Swagger
        contentSecurityPolicy: isDevelopment ? false : undefined,
    }));

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            getLogger(error).error('Error occured while handling a request', {error});
            let statusCode = error.status || 500;
            let errorBody = {
                code: error.code || 'INTERNAL_SERVER_ERROR',
                message: error.message || 'An error occurred',
                details: error.details || {},
                stack: undefined,
            };

            if (error instanceof ServiceError) {
                if (error.isNotFound){
                    statusCode = 404;
                } else if (error.isValidationFailed) {
                    statusCode = 400;
                } else if (error.isForbidden) {
                    statusCode = 403;
                } else if (error.isUnauthorized) {
                    statusCode = 401;
                }
            }

            ctx.status = statusCode;
            ctx.body = errorBody;
        }
    });

    if (isDevelopment) {
        const spec = swaggerJsdoc(swaggerOptions);
        // Install Swagger docs
        app.use(
            koaSwagger({
                routePrefix: '/swagger',
                specPrefix: '/openapi.json',
                exposeSpec: true,
                swaggerOptions: {
                    spec,
                },
            }),
        );
    }


    app.use(async (ctx, next) => {
        getLogger().info(JSON.stringify(ctx.request));
        getLogger().info(JSON.stringify(ctx.request.body));
        return next();
    });
};


