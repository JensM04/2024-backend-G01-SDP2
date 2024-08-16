const Router = require('@koa/router');
const Joi = require('joi');

const validate = require('../core/validation');
const notificatieService = require('../service/notificatie');
const {
    requireAuthentication
} = require('../core/auth');


/**
 * @swagger
 * tags:
 *   name: Notificaties
 *   description: vertegenwoordigt een notificatie van een gebruiker (klant/leverancier)
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Notificatie:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - datum
 *             - notificatieSoort
 *             - status
 *             - bestellingid
 *             - tekst
 *           properties:
 *             datum:
 *               type: "string"
 *               format: "date"
 *             notificatieSoort:
 *               type: "string"
 *             status:
 *               type: "string"
 *             bestellingid:
 *               type: integer
 *             tekst:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Notificatie"
 *     NotificatieList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Notificatie"
 *     PostNotificatie:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - notificatieSoort
 *             - datum
 *             - tekst
 *             - status
 *             - avatar
 *             - bestellingid
 *             - gebruikerid
 *           properties:
 *             notificatieSoort:
 *               type: "string"
 *             datum:
 *               type: "string"
 *               format: "date"
 *             tekst:
 *               type: "string"
 *             status:
 *               type: "string"
 *             avatar:
 *               type: "string"
 *             bestellingid:
 *               type: integer
 *             gebruikerid:
 *               type: integer
 *           example:
 *             $ref: "#/components/examples/PostNotificatie"
 *      
 *   examples:
 *     Notificatie:
 *       id: 12
 *       datum: "2024-04-25T14:39:43.000Z"
 *       notificatieSoort: "Betalingsherinnering"
 *       status: "ongelezen"
 *       bestellingid: 1
 *       tekst: "Apple heeft een betaling verzocht voor bestelling 1"
 *     PostNotificatie:
 *       id: 13
 *       notificatieSoort: "Betalingsherinnering"
 *       datum: "2024-04-25T14:39:43.000Z"
 *       tekst: "Apple heeft een betaling verzocht voor bestelling 1"
 *       status: "nieuw"
 *       avatar: "Apple"
 *       bestellingid: 1
 *       gebruikerid: 2
 */

/**
 * @swagger
 * /api/notificaties?pagina=1&rijen=10:
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
 *     summary: Vraag alle notificaties op voor de ingelogde gebruiker met paginatie
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Een lijst met notificaties
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotificatieList"
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 */

const getAlleNotificaties = async (ctx) => {
    const {userId: gebruikerId} = ctx.state.session;
    const query = ctx.request.query;
    for (let item in query){
        if(!isNaN(query[item])){
            query[item] = parseInt(query[item]);
        }
    }

    const notificaties = await notificatieService.getAll({gebruikerId, ...query});

    ctx.body = notificaties;
};

getAlleNotificaties.validationScheme = {
    query: {
        pagina: Joi.number().integer().min(0),
        rijen: Joi.number().integer().positive(),
        notificatieSoort: Joi.number().integer().min(0).optional(),
        content: Joi.string().optional(),
        bestelling: Joi.number().integer().min(0).optional(),
        vanDatum: Joi.string().length(24).optional(),
        totDatum: Joi.string().length(24).optional(),
    }
}; 

/**
 * @swagger
 * /api/notificaties/recent:
 *   get:
 *     summary: Vraag de 5 meest recente notificaties op die nieuw of ongelezen zijn
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Een lijst met de nieuwste nieuwe/ongelezen notificaties (max. 5)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotificatieList"
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 */

const getRecenteNotificaties = async (ctx) => {
    const gebruiker = ctx.state.session;
    const notificaties = await notificatieService.getRecenteNotificaties({gebruiker});

    ctx.body = notificaties;
};

getRecenteNotificaties.validationScheme = null;

/**
 * @swagger
 * /api/notificaties/{id}:
 *   get:
 *     summary: Vraag een enkele notificatie van de ingelogde gebruiker op
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De gevraagde notificatie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notificatie"
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 *       404:
 *         description: De gevraagde notificatie bestaat niet (niet voor jou), deze foutmelding werkt nog niet zo god
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
 *                   description: Extra information about the specific not found error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Notification not found"
 */

const getNotificatieById = async (ctx) => {
    const ingelogdeGebruiker = Number(ctx.state.session.userId);
    const notificatie = await notificatieService.getById(Number(ctx.params.id), ingelogdeGebruiker);

    ctx.body = notificatie;
};

getNotificatieById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive()
    })
};

/**
 * @swagger
 * /api/notificaties/bestelling/{id}:
 *   get:
 *     summary: Zoek de laatste notificatie van een bepaalde bestelling
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De gevonden notificatie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notificatie"
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 *       404:
 *         description: Er bestaat geen notificatie met deze bestellingid
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
 *                   description: Extra information about the specific not found error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "NOT_FOUND"
 *                 details: "Er is geen notificatie met id: 10."
 */
const getLaatsteNotificatieByBestellingId = async (ctx) => {
    const laatsteNotif = await notificatieService.getLaatsteNotificatieByBestellingId(ctx.params.id);
    ctx.body = laatsteNotif;
    return laatsteNotif;
};

getLaatsteNotificatieByBestellingId.validationScheme = {
    params: Joi.object({
        id: Joi.string()
    })
};

/**
 * @swagger
 * /api/notificaties/{id}:
 *   put:
 *     summary: Verander de status van een notificatie
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       description: De nieuwe status van de notificatie
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: De gevraagde notificatie met een geüpdatete status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Notificatie"
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 *       404:
 *         description: De gevraagde notificatie bestaat niet (De ingelogde gebruiker heeft geen notificatie met dit id)
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
 *                   description: Extra information about the specific not found error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "NOT_FOUND"
 *                 details: "Er is geen notificatie met id: 10."
 */

const updatedNotificatieById = async (ctx) => {
    const updatedNotificatie = await notificatieService.updateById(Number(ctx.params.id),{
        ...ctx.request.body,
        gebruikerid: Number(ctx.state.session.userId),
        status: ctx.request.body.status
    });
    
    ctx.body = updatedNotificatie;
};

updatedNotificatieById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive()
    }),

    body: Joi.object({
        status: Joi.string()
    })
};

/**
 * @swagger
 * /api/notificaties:
 *   put:
 *     summary: Verander de status van "nieuw" naar "ongelezen" voor elke notificatie van de ingelogde gebruiker
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: De gevraagde notificatie met een geüpdatete status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *               example: 
 *                 count: 12
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 */
const updateNotificatieOngelezen = async (ctx) => {
    const ongelezenNotificaties = await notificatieService.setNotificatiesOngelezen(Number(ctx.state.session.userId));
    ctx.body = ongelezenNotificaties;
};

updateNotificatieOngelezen.validationScheme = null;

/**
 * @swagger
 * /api/notificaties:
 *   post:
 *     summary: Maak een nieuwe notificatie
 *     tags:
 *      - Notificaties
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: De nieuwe notificatie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostNotificatie"
 *       401:
 *         description: Je bent niet ingelogd
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
 *                 code: "UNAUTHORIZED"
 *                 details: "You need to be signed in"
 *       404:
 *         description: Er bestaat geen notificatie met deze bestellingid
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
 *                   description: Extra information about the specific not found error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "NOT_FOUND"
 *                 details: "Er is geen notificatie met id: 10."
 */
const createNotificatie = async (ctx) => {
    const {bestellingId, klantId, leverancierId} = ctx.request.body;
    const nieuweNotificatie = await notificatieService.createNotificatie(bestellingId, klantId, leverancierId);
    ctx.body = nieuweNotificatie;
    ctx.status  = 201;
};

createNotificatie.validationScheme = {
    body: Joi.object({
        bestellingId: Joi.number().integer().positive(),
        klantId: Joi.number().integer().positive(),
        leverancierId: Joi.number().integer().positive()
    })
};


const checkNotificationUserId = async (ctx, next) => {
    const {userId} = ctx.state.session;
    const notificatie = await notificatieService.getById(Number(ctx.params.id), userId);


    if(ctx.state.session.userId !== notificatie.gebruikerid) {
        ctx.throw(403, 'You are not allowed to view this notification', {
            code: 'FORBIDDEN',
        });
    }

    return next();
};

module.exports = (app) => {
    const router = new Router({
        prefix: '/notificaties',
    });

    router.get('/', requireAuthentication, validate(getAlleNotificaties.validationScheme), getAlleNotificaties);
    router.get('/recent', requireAuthentication, validate(getRecenteNotificaties.validationScheme), getRecenteNotificaties);
    router.get('/:id', requireAuthentication, validate(getNotificatieById.validationScheme), checkNotificationUserId, getNotificatieById);
    router.get('/bestelling/:id', validate(getLaatsteNotificatieByBestellingId.validationScheme), getLaatsteNotificatieByBestellingId);
    router.put('/:id', requireAuthentication, validate(updatedNotificatieById.validationScheme),  updatedNotificatieById);
    router.put('/', requireAuthentication, validate(updateNotificatieOngelezen.validationScheme), updateNotificatieOngelezen);
    router.post('/', requireAuthentication, validate(createNotificatie.validationScheme), createNotificatie);
    app.use(router.routes())
        .use(router.allowedMethods());
};