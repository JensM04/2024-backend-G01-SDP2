module.exports = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'B2B API',
            version: '0.1.0',
            description: 'Dit is een CRUD api gemaakt met Koa in JavaScript en gedocumenteert met Swagger.',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'B2B Portaal API',
                email: [
                    'michiel.vanhoorebeke2@student.hogent.be',
                    'jens.meersschaert@student.hogent.be',
                    'kevin.wauman@student.hogent.be',
                    'victor.huygebaert@student.hogent.be',
                    'corneel.verstraeten@student.hogent.be'
                ],
            },
        },
        servers: [
            {
                url: 'http://localhost:9000/',
            },
        ],
        components:{
            securitySchemes:{
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',  
                }, 
            },
        }
        ,
        security: {
            bearerAuth: [],  
        },
    },
    apis: ['./src/rest/*.js'],
 
};