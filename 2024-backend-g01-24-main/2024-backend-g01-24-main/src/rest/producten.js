const Router = require('@koa/router');

const productenService = require('../service/producten');

/**
 * @swagger
 * tags:
 *   name: Producten 
 *   description: vertegenwoordigt een product
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             naam:
 *               type: "string"
 *             aantalInStock:
 *               type: integer
 *             eenheidsprijs:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Product"
 *     ProductenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *             aantalPaginas:
 *               type: integer
 *               example: 15
 *   examples:
 *     Product:
 *       id: 1
 *       naam: "Iphone 15"
 *       aantalInStock: 30 
 *       eenheidsprijs: "800.00"
 */

const productenQueryConverter = ({
    pagina,
    rijen,
    ...rest
}) => {
    const formattedQuery = {
        ...rest
    };
    pagina && (formattedQuery.pagina = parseInt(pagina)); 
    rijen && (formattedQuery.rijen = parseInt(rijen)); 
    return formattedQuery;
};

/**
 * @swagger
 * /api/producten?pagina=1&rijen=10:
 *   parameters:
 *     - in: query
 *       name: pagina
 *       schema:
 *         type: integer
 *         example: 1
 *       description: Aantal pagina's die je wil opvragen
 *     - in: query
 *       name: rijen
 *       schema:
 *         type: integer
 *         example: 10
 *       description: Aantal rijen's die je wil opvragen
 *   get:
 *     summary: Vraag alle producten op 
 *     tags:
 *      - Producten
 *     responses:
 *       200:
 *         description: Een lijst met producten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductenList"
 */
const getAllProducten = async (ctx) => {
    const query = productenQueryConverter(ctx.query);

    const producten = await productenService.getAllProducten(query);
    ctx.body = producten;
};

module.exports = (app) => {
    const router = new Router({
        prefix: '/producten',
    });

    router.get('/', getAllProducten);
    app.use(router.routes()).use(router.allowedMethods());
};
