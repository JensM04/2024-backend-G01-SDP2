const Router = require('@koa/router');
const Joi = require('joi');

const validate = require('../core/validation');
const productenInBestellingService = require('../service/productenInBestelling');
const {
    requireAuthentication
} = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: ProductenInBestelling
 *   description: vertegenwoordigt alle producten uit een bestelling
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductInBestelling:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - aantal
 *             - b2bBestelling_bestellingId
 *             - productId
 *             - eenheidprijs
 *             - naam
 *           properties:
 *             aantal:
 *               type: integer
 *             b2bBestelling_bestellingId:
 *               type: integer
 *             productId:
 *               type: integer
 *             aantalInStock:
 *               type: integer
 *             eenheidprijs:
 *               type: "string"
 *             naam:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/ProductInBestelling"
 *     ProductenInBestelling:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ProductInBestelling"
 *   examples:
 *     ProductInBestelling:
 *       id: 182
 *       aantal: 2
 *       b2bBestelling_bestellingId: 42
 *       productId: 862
 *       aantalInStock: 86
 *       eenheidprijs: "871"
 *       naam: "Bruine suiker"
 */

/**
 * @swagger
 * /api/productenbestelling/{id}:
 *   get:
 *     summary: Vraag de producten op uit een specifieke bestelling
 *     tags:
 *      - ProductenInBestelling
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: een lijst van producten in de gevraagde bestelling
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductenInBestelling"
 *       403:
 *         description: Je kan enkel je eigen informatie opvragen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - code
 *                 - details
 *               properties:
 *                 code:
 *                   type: string
 *                 details:
 *                   type: string
 *                   description: Extra information about the specific forbidden error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "FORBIDDEN"
 *                 details: "You are not allowed to view this user's information"
 */

const getProductenByBestellingId = async (ctx) => {
    const { bedrijfId, bestellingId } = ctx.query;
    const productenData = await productenInBestellingService.getProductenByBestellingId(Number(bedrijfId), bestellingId);
    ctx.body = {
        productenInBestelling: productenData
    };
};

getProductenByBestellingId.validationScheme = {
    query: Joi.object({
        bedrijfId: Joi.string(),
        bestellingId: Joi.string(),
    })
};

module.exports = (app) => {
    const router = new Router({
        prefix: '/productenBestelling',
    });

    router.get('/',requireAuthentication, validate(getProductenByBestellingId.validationScheme), getProductenByBestellingId);
    app.use(router.routes())
        .use(router.allowedMethods());
};