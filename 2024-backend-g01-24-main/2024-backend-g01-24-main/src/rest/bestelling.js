const Router = require('@koa/router');
const Joi = require('joi');

const validate = require('../core/validation');
const bestellingService = require('../service/bestelling');
const { requireAuthentication } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Bestellingen
 *   description: vertegenwoordigt een bestelling van een bedrijf aan een bedrijf
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bestelling:
 *       allOf:
 *         - type: object
 *           required:
 *             - datum
 *             - bedrag
 *           properties:
 *             id:
 *               type: "string"
 *               format: "uuid"
 *             datum:
 *               type: "string"
 *               format: "date"
 *             bedrag:
 *               type: "string"
 *             bestellingstatus:
 *               type: integer
 *             betaalstatus:
 *               type: integer
 *           example:
 *             $ref: "#/components/examples/Bestelling"
 *     BestellingenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Bestelling"
 *             huidigePagina:
 *                type: integer
 *                example: 1
 *             aantalRijen:
 *                type: integer
 *                example: 150
 *             aantalPaginas:
 *                type: integer
 *                example: 15
 *   examples:
 *     Bestelling:
 *       id: "b36a1474-b834-4375-b4d6-62a2ef553d5a"
 *       datum: "2020-06-26T05:41:00.000Z"
 *       bedrag: "314"
 *       bestellingstatus: 1
 *       betaalstatus: 1
 */

/**
 * @swagger
 * /api/bestellingen?pagina=1&rijen=10:
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
 *     summary: Vraag alle bestellingen op voor de ingelogde leverancier met paginatie
 *     tags:
 *      - Bestellingen
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Een lijst met bestellingen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestellingenList"
 */

const bestellingenQueryConverter = ({
    vanDatum,
    totDatum,
    bestellingstatus,
    betaalstatus,
    pagina,
    rijen,
    order_by,
    ...rest
}) => {
    const formattedQuery = {
        ...rest,
    };
    vanDatum && (formattedQuery.vanDatum = new Date(vanDatum));
    totDatum && (formattedQuery.totDatum = new Date(totDatum));
    bestellingstatus && (formattedQuery.bestellingstatus = Number(bestellingstatus));
    betaalstatus && (formattedQuery.betaalstatus = Number(betaalstatus));
    pagina && (formattedQuery.pagina = Number(pagina));
    rijen && (formattedQuery.rijen = Number(rijen));
    order_by && (formattedQuery.orderByVar = order_by);

    return formattedQuery;
};

const getAlleBestellingen = async (ctx) => {
    const query = bestellingenQueryConverter(ctx.request.query);

    const {
        role,
        bedrijfId 
    } = ctx.state.session;
    const bestellingenData = await bestellingService.getAll({role, bedrijfId, ...query});

    ctx.body = bestellingenData;
};

getAlleBestellingen.validationScheme = {
    query: {
        pagina: Joi.number().integer().min(0),
        rijen: Joi.number().integer().positive(),
        id: Joi.string().alphanum().optional(),
        bedrag: Joi.number().min(0).optional(),
        vanDatum: Joi.string().length(24).optional(),
        totDatum: Joi.string().length(24).optional(),
        bestellingstatus: Joi.number().min(0).optional(),
        betaalstatus: Joi.number().min(0).optional(),
        zoek:Joi.string().optional(),
        order:Joi.string().equal('asc', 'desc').optional(),
        order_by: Joi.string().optional()
    }
};


/**
 * @swagger
 * /api/bestellingen/{id}:
 *   get:
 *     summary: Vraag een enkele bestelling op 
 *     tags:
 *      - Bestellingen
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De gevraagde bestelling
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bestelling"
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
 *       400:
 *         description: You provided invalid data
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
 *                   description: Extra information about the specific error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "VALIDATION_FAILED"
 *                 details: "Id moet een uuid zijn"
 */

//bestelling by id: enkele bestelling opv id
const getBestellingById = async (ctx) => {
    const {role, bedrijfId} = ctx.state.session;
    const bestelling = await bestellingService.getById({
        id: ctx.params.id, bedrijfId, role});
    ctx.body = bestelling;
};

getBestellingById.validationScheme = {
    params: Joi.object({
        id: Joi.string(),
    })
};

module.exports = (app) => {
    const router = new Router({
        prefix: '/bestellingen',
    });

    router.get('/', requireAuthentication, validate(getAlleBestellingen.validationScheme), getAlleBestellingen);
    router.get('/:id', requireAuthentication, validate(getBestellingById.validationScheme), getBestellingById);
    app.use(router.routes())
        .use(router.allowedMethods());
};