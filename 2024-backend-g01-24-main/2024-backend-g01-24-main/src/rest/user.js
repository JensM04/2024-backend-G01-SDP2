const Router = require('@koa/router');
const Joi = require('joi');

const userService = require('../service/user');
const {requireAuthentication} = require('../core/auth');
const validate = require('../core/validation');

const checkUserId = (ctx, next) => {
    const { userId } = ctx.state.session;
    const { id } = ctx.params;
  
    // You can only get our own data 
    if (Number(id) !== Number(userId) ) {
        return ctx.throw(
            403,
            'You are not allowed to view this user\'s information',
            {
                code: 'FORBIDDEN',
            },
        );
    }
    return next();
};

/**
 * @swagger
 * tags:
 *   name: Gebruikers
 *   description: Vertegenwoordigt alle gebruikers in de databank
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gebruiker:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - gebruikersnaam
 *             - email
 *             - iswachtwoordveranderd
 *             - salt
 *             - wachtwoord_hash
 *           properties:
 *             dtype:
 *               type: "string"
 *             email:
 *               type: "string"
 *               format: email
 *             gebruikersnaam:
 *               type: "string"
 *             iswachtwoordveranderd:
 *               type: integer
 *             rol:
 *               type: integer
 *             salt:
 *               type: "string"
 *             wachtwoord_hash:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Gebruiker"
 *   examples:
 *     Gebruiker:
 *       id: 12
 *       dtype: "Klant"
 *       email: "google@gmail.com"
 *       gebruikersnaam: "google_klant"
 *       iswachtwoordveranderd: 1
 *       rol: 1
 *       salt: "aQdt4ZMxwrfIy064jxLMOh9VLJohcX"
 *       wachtwoord_hash: "bad121fa723c4031a03f0ba6387e3ccda25d6e5af9d7d18ab73a95474d33f4b7"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     LoginResponse:
 *       description: De gebruiker en een jwt token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gebruiker:
 *                 $ref: "#/components/schemas/Gebruiker"
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c..."
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Vraag een enkele gebruiker op
 *     tags:
 *      - Gebruikers
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De gevraagde gebruiker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Gebruiker"
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
 */

const getUserById = async (ctx) => {
    ctx.body = await userService.getById(Number(ctx.params.id));
};

getUserById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    })
};


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Probeer in te loggen
 *     tags:
 *      - Gebruikers
 *     requestBody:
 *       description: De inloggegevens van de gebruiker
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: De gebruiker en een jwt token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gebruiker:
 *                   $ref: "#/components/schemas/Gebruiker"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c..."
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
 *                 message: "Validation failed, check details for more information"
 *       401:
 *         description: You provided invalid credentials
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
 *                 details: "The given username and password do not match"
 */

const login = async (ctx) => {
    const { username, password } = ctx.request.body;
    const token = await userService.login(username, password);
    ctx.body = token;
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Pas de gegevens van een gebruiker aan
 *     tags:
 *      - Gebruikers
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       description: De nieuwe gegevens van de gebruiker
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date               
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string   
 *     responses:
 *       201:
 *         description: De aangepaste gebruiker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Gebruiker"
 *       400:
 *         description: Er is data verkeerd ingevuld
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
 *                 code: "VALIDATION_FAILED"
 *                 message: "Validation failed, check details for more information"
 *       403:
 *         description: Je kan enkel je eigen profiel aanpassen
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
const updateUserById = async (ctx) => {
    const updatedUser = await userService.updateById(Number(ctx.params.id), ctx.request.body);

    ctx.body = updatedUser;
};

updateUserById.validationScheme = {
    params: Joi.object({
        id: Joi.number().integer().positive(),
    }),
    
    body: Joi.object({
        gebruikersnaam: Joi.string().optional(),
        email: Joi.string().email().optional(),
        wachtwoord: Joi.string().optional()
    })
};


module.exports = (app) => {
    const router = new Router({
        prefix: '/users',
    });

    // Public routes
    router.post('/login', login);

    // Routes with authentication / authorization
    router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), checkUserId, getUserById);
    router.put('/:id', requireAuthentication, validate(updateUserById.validationScheme), checkUserId,  updateUserById);

    app.use(router.routes())
        .use(router.allowedMethods());
};