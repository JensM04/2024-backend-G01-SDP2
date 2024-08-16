const supertest = require('supertest');
const { PrismaClient } = require('@prisma/client');

const createServer = require('../src/createServer');

const prisma = new PrismaClient();

const login = async (supertest) => {
    console.log('LOGGING IN AS LEVERANCIER.....');
    const response = await supertest.post('/api/users/login').send({
        username: 'Proximus_Test_Leverancier',
        password: 'wachtwoord',
    });

    if (response.statusCode !== 200) {
        throw new Error(response.body.message || 'Unknown error occurred');
    }

    return `Bearer ${response.body.token}`;
};

const loginKlant = async (supertest) => {
    console.log('LOGGING IN AS KLANT.....');
    const response = await supertest.post('/api/users/login').send({
        username: 'Proximus_Test_Klant',
        password: 'wachtwoord',
    });

    if (response.statusCode !== 200) {
        throw new Error(response.body.message || 'Unknown error occurred');
    }

    return `Bearer ${response.body.token}`;
};

const loginKlant2 = async (supertest) => {
    console.log('LOGGING IN AS KLANT.....');
    const response = await supertest.post('/api/users/login').send({
        username: 'Microsoft_Test_Klant',
        password: 'wachtwoord',
    });

    if (response.statusCode !== 200) {
        throw new Error(response.body.message || 'Unknown error occurred');
    }

    return `Bearer ${response.body.token}`;
};

const loginAdmin = async (supertest) => {
    console.log('LOGGING IN AS ADMIN.....');
    const response = await supertest.post('/api/users/login').send({
        username: 'Administrator_Test',
        password: 'ww',
    });

    if (response.statusCode !== 200) {
        throw new Error(response.body.message || 'Unknown error occurred');
    }

    return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
    let server;

    beforeAll(async () => {
        server = await createServer();

        setter({
            prisma,
            supertest: supertest(server.getApp().callback()),
        });
    });

    afterAll(async () => {
        await server.stop();
        await prisma.$disconnect(); 
    });
};

module.exports = {
    login,
    withServer,
    loginAdmin,
    loginKlant,
    loginKlant2
};
