const Koa = require('koa');
const config = require('config');

const { initializeLogger, getLogger } = require('./core/logging');
const {initializeData, shutdownData} = require('./data/');
const installMiddleware = require('./core/installMiddelwares');
const installRest = require('./rest');
const { closeIo, createWebSocketServer } = require('./websocket');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

module.exports = async function createServer() {
    initializeLogger({
        level: LOG_LEVEL,
        disabled: LOG_DISABLED,
        defaultMeta: {
            NODE_ENV,
        },
    });

    await initializeData();

    const app = new Koa();

    if (NODE_ENV != 'test') {
        createWebSocketServer(app);
    }
    
    installMiddleware(app);

    installRest(app);

    return {
        getApp() {
            return app;
        },
        start() {
            return new Promise((resolve) => {
                const port = config.get('port');
                app.listen(port);
                getLogger().info(`🚀 Server listening on http://localhost:${port}`);
                resolve();
            });
        },
        async stop() {
            //cleanup
            app.removeAllListeners();
            await shutdownData();
            closeIo();
            getLogger().info('Goodbye');
        }
    };
};