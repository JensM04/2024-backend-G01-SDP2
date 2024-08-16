const Router = require('@koa/router');
const Joi = require('joi');

const betalingService = require('../service/betaling');
const validate = require('../core/validation');
const {requireAuthentication} = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Betalingen 
 *   description: Vertegenwoordigt de betaling die een klant doet voor een bestelling 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Betaling:
 *       allOf:
 *         - type: object
 *           required:
 *             - betalingId 
 *           properties:
 *             betalinId:
 *               type: integer 
 *             betaaldatum:
 *               type: "string"
 *               format: "date"
 *             betaalBedrag:
 *               type: number
 *               format: "double"
 *             isGoedgekeurd:
 *               type: boolean
 *             isVerwerkt:
 *               type: boolean
 *             teBetalen:
 *               type: number
 *               format: "double"
 *             klantId:
 *               type: integer
 *             bestellingId:
 *               type: integer
 *           example:
 *             $ref: "#/components/examples/Betaling"
 *   examples:
 *     Betaling:
 *       betalingId: 1
 *       betaaldatum: "2020-06-26T05:41:00.000Z"
 *       betaalBedrag: 314
 *       isGoedgekeurd: false
 *       isVerwerkt: false
 *       teBetalen: 314
 *       klantId: 1
 *       bestellingId: 1
 */

/**
 * @swagger
 * /api/betalingen/{8bdf}:
 *   post:
 *     summary: Doe een betaling voor een bestelling, creëert een betalingsobject 
 *     tags:
 *      - Betalingen
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bestellingId
 *         type: "string"
 *         required: true
 *         description: Deel van de uuid van een bestelling
 *     responses:
 *       201:
 *         description: Een nieuwe betaling
 *         content:
 *           application/json:
 *             $ref: "#components/schemas/Betaling"
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
 *                 details: "Betaalbedrag moet een getal zijn"
 *       404:
 *         description: De bestelling die je wil betalen bestaat niet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - code
 *                 - message
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
 *                 message: "Er bestaat geen bestelling met id: 8bdf"
 
 */
const createBetaling = async(ctx) => {
    const {role,bedrijfId} = ctx.state.session;
    const newBetaling = await betalingService.create(ctx.params.id, role, Number(bedrijfId),{...ctx.request.body,
    });
    ctx.body = newBetaling;
    ctx.status = 201;
};

createBetaling.validationScheme = {
    params: Joi.object({
        id: Joi.string(),
    }),

    body: Joi.object({
        betaalbedrag: Joi.number().positive(),
    })
};

module.exports = (app) => {
    const router = new Router({
        prefix: '/betalingen',
    });

    router.post('/:id', requireAuthentication, validate(createBetaling.validationScheme),  createBetaling);
    app.use(router.routes())
        .use(router.allowedMethods());
};