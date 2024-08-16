const Router = require('@koa/router');

const installUserRouter = require('./user');
const installBestellingRouter = require('./bestelling');
const installNotificatieRouter = require('./notificatie');
const installProductenInBestellingRouter = require('./productenInBestelling');
const installBedrijfRouter = require('./bedrijf');
const installProductenRouter = require('./producten');
const installBetalingRouter = require('./betaling');
const installHealthRouter = require('./health');

/**
 * @swagger
 * components:
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           format: "int32"
 *       example:
 *         id: 123
 *     ListResponse:
 *       required:
 *         - count
 *       properties:
 *         count:
 *           type: integer
 *           description: Het aantal items dat is opgehaald
 *           example: 1
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     idParam:
 *       in: path
 *       name: id
 *       description: Id van het item dat je wil ophalen/updaten/verwijderen
 *       required: true
 *       schema:
 *         type: integer
 *         format: "int32"
 */



/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
    const router = new Router({
        prefix: '/api',
    });

    //import routes
    installUserRouter(router);
    installBestellingRouter(router);
    installNotificatieRouter(router);
    installProductenRouter(router);
    installProductenInBestellingRouter(router);
    installBedrijfRouter(router);
    installBetalingRouter(router);
    installHealthRouter(router);


    app.use(router.routes())
        .use(router.allowedMethods());
};