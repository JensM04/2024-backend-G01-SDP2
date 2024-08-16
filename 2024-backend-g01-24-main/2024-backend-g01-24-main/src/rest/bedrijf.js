const Router = require('@koa/router');
const Joi = require('joi');

const validate = require('../core/validation');
const bedrijfService = require('../service/bedrijf');
const {
    requireAuthentication
} = require('../core/auth');


/**
 * @swagger
 * tags:
 *   name: Bedrijven
 *   description: vertegenwoordigt een bedrijf 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bedrijf:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             email:
 *               type: "string"
 *               format: "email"
 *             isActief:
 *               type: boolean
 *             sector:
 *               type: "string"
 *             telefoonnummer:
 *               type: "string"
 *             uuid:
 *               type: "string"
 *               format: "uuid"
 *             website:
 *               type: "string"
 *             adres:
 *               type: object
 *               properties:
 *                 bus:
 *                   type: "string"
 *                 gemeente:
 *                   type: "string"
 *                 huisnummer:
 *                   type: integer
 *                 postcode:
 *                   type: integer
 *                 straat:
 *                   type: "string"
 *             BTWNr:
 *               type: "string" 
 *                
 *           example:
 *             $ref: "#/components/examples/Bedrijf"
 *     BedrijfUpdateRequest:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - bedrijfId
 *           properties:
 *             bedrijfId:
 *               type: integer
 *             email:
 *               type: "string"
 *               format: "email"
 *             naam: 
 *               type: "string"
 *             sector:
 *               type: "string"
 *             telefoonnummer:
 *               type: "string"
 *             websiteUrl:
 *               type: "string"
 *             bus:
 *               type: "string"
 *             gemeente:
 *               type: "string"
 *             huisnummer:
 *               type: integer
 *             postcode:
 *               type: integer
 *             straat:
 *               type: "string"
 *             BTWNr:
 *               type: "string"
 *                
 *           example:
 *             $ref: "#/components/examples/BedrijfUpdateRequest"
 *   examples:
 *     Bedrijf:
 *       id: 1
 *       email: "google@gmail.com"
 *       isActief: true
 *       sector: "IT"
 *       telefoonnummer: "0488888888"
 *       uuid: "7eb8dffd-3006-488a-bb5a-97c032873ae3"
 *       website: "www.google.com"
 *       adres:
 *         bus: null
 *         gemeente: "Gent"
 *         huisnummer: 2
 *         postcode: 9000
 *         straat: "Verderstraat"
 *       BTWNr: "BE1574381963" 
 *     BedrijfUpdateRequest:
 *       id: 1
 *       bedrijfId: 1
 *       email: "testbedrijf@gmail.com"
 *       naam: "test"
 *       sector: "IT"
 *       telefoonnummer: "043928349"
 *       websiteUrl: testbedrijf.be
 *       bus: null
 *       gemeente: "Gent"
 *       huisnummer: 1
 *       postcode: 9000
 *       straat: "Sesamstraat"
 *       BTWNr: "BE1574381963" 
 */

/**
 * @swagger
 * /api/bedrijven/:
 *   get:
 *     summary: Vraag het bedrijf op van de ingelogde gebruiker
 *     tags:
 *      - Bedrijven
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Het gevraagde bedrijf
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bedrijf"
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

const getBedrijf = async (ctx) => {
    const bedrijfId = ctx.state.session.bedrijfId;
    ctx.body = await bedrijfService.getById(bedrijfId);
};

getBedrijf.validationScheme = null;

/**
 * @swagger
 * /api/bedrijven/{id}:
 *   get:
 *     summary: Vraag een bedrijf op aan de hand van de id
 *     tags:
 *      - Bedrijven
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: Het gevraagde bedrijf
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bedrijf"
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

const getBedrijfById = async (ctx) => {
    const bedrijf = await bedrijfService.getById(Number(ctx.params.id));

    ctx.body = bedrijf;
};

getBedrijfById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive().required(),
    })
};

/**
 * @swagger
 * /api/bedrijven/{id}:
 *   put:
 *     summary: Update de gegevens van een bedrijf
 *     tags:
 *      - Bedrijven 
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De gevraagde notificatie met een geüpdatete status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedrijfUpdateRequest"
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
 *         description: Er zijn geen update requests voor het bedrijf met de opgegeven id
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
 *                 details: "Bedrijf with ID 11 not found"
 */
const updateBedrijfById = async (ctx) => {
    const updatedBedrijf = await bedrijfService.updateById(Number(ctx.params.id));

    ctx.body = updatedBedrijf;
};


updateBedrijfById.validationScheme = {
    params: Joi.object({
        id: Joi.string(),
    })
};

/**
 * @swagger
 * /api/bedrijven:
 *   post:
 *     summary: Dien een aanvraag in met de gegevens van je bedrijf die je wil aanpassen (indien dit goedgekeurd wordt door een admin, wordt de echte bedrijfentiteit aangepast)
 *     tags:
 *      - Bedrijven
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creëert een nieuw b2bBedrijfUpdateRequest object en geeft dit terug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedrijfUpdateRequest"
 */
// const bedrijfUpdateAnvraag = async(ctx) => {
//     try{
//         const aanvraag = await bedrijfService.aanvraagUpdate({...ctx.request.body});
//         ctx.body = aanvraag;
//     }    catch (error) {
//         throw handleDBError(error);
//     }
// };

// bedrijfUpdateAnvraag.validationScheme = {
//     body: Joi.object({
//         BEDRIJFID: Joi.number().integer().positive(),
//         EMAIL: Joi.string().email(),
//         NAAM: Joi.string(),
//         SECTOR: Joi.string(),
//         TELEFOONNUMMER: Joi.string(),
//         WEBSITEURL: Joi.string(),
//         GEMEENTE: Joi.string(),
//         HUISNUMMER: Joi.number().integer().positive(),
//         POSTCODE: Joi.number().integer().positive(),
//         STRAAT: Joi.string()

//     })
// };

/**
 * @swagger
 * /api/bedrijven:
 *   post:
 *     summary: Dien een aanvraag in met de gegevens van je bedrijf die je wil aanpassen (indien dit goedgekeurd wordt door een admin, wordt de echte bedrijfentiteit aangepast)
 *     tags:
 *      - Bedrijven
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creëert een nieuw b2bBedrijfUpdateRequest object en geeft dit terug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedrijfUpdateRequest"
 */
const bedrijfUpdateAnvraag = async(ctx) => {
    const  {authorization} = ctx.headers;
    const aanvraag = await bedrijfService.aanvraagUpdate(authorization, {...ctx.request.body});
    ctx.body = aanvraag;
    ctx.status = 201;
};

bedrijfUpdateAnvraag.validationScheme = {
    body: Joi.object({
        BEDRIJFID: Joi.number().integer().positive(),
        EMAIL: Joi.string().email(),
        NAAM: Joi.string(),
        SECTOR: Joi.string(),
        TELEFOONNUMMER: Joi.string(),
        WEBSITEURL: Joi.string(),
        GEMEENTE: Joi.string(),
        HUISNUMMER: Joi.number().integer().positive(),
        POSTCODE: Joi.number().integer().positive(),
        STRAAT: Joi.string()

    })
};



module.exports = (app) => {
    const router = new Router({
        prefix: '/bedrijven',
    });

    router.get('/', requireAuthentication, validate(getBedrijf.validationScheme), getBedrijf);
    router.get('/:id', requireAuthentication, validate(getBedrijfById.validationScheme), getBedrijfById);
    router.put('/:id',requireAuthentication, validate(updateBedrijfById.validationScheme), updateBedrijfById);
    router.post('/', requireAuthentication, validate(bedrijfUpdateAnvraag.validationScheme), bedrijfUpdateAnvraag);


    app.use(router.routes())
        .use(router.allowedMethods());
};
