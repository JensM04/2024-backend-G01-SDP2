const { withServer } = require('../supertest.setup');
const userService = require('../../src/service/user');

const loginCustom= async (username, wachtwoord) => {

    const token = (await userService.login(username, wachtwoord)).token;            
    const auth = `Bearer ${token}`;
    return auth;
};

const data = {
    users: [{
        ID: 6,
        DTYPE: 'Klant',
        EMAIL:'klant@email.com',
        GEBRUIKERSNAAM: 'test_klant',
        ISWACHTWOORDVERANDERD: true,
        ROL: 1,
        SALT:'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
        WACHTWOORD_HASH:'535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d',
    },
    {
        ID: 7,
        DTYPE: 'Leverancier',
        EMAIL:'leverancier@email.com',
        GEBRUIKERSNAAM: 'test_leverancier',
        ISWACHTWOORDVERANDERD: true,
        ROL: 0,
        SALT:'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
        WACHTWOORD_HASH:'535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d',
    }
    ],
    klant_B2BBedrijf: {
        bedrijf_BEDRIJFID: 1,
        Klant_ID: 6
    },
    leverancier_B2BBedrijf: {
        bedrijf_BEDRIJFID: 2,
        Leverancier_ID: 7
    }
};
const dataToDelete = {
    users: [6,7],
};

describe('User', () => {
    let request;
    let prisma;

    withServer(({supertest, prisma: p}) => {
        request = supertest;
        prisma = p;
    });

    const url = '/api/users';

    describe('GET /api/users/:id', () => {

        beforeAll(async () => {
            await prisma.gEBRUIKER.createMany({
                data: data.users,
            });
            await prisma.kLANT_B2BBEDRIJF.createMany({
                data: data.klant_B2BBedrijf
            });
            await prisma.lEVERANCIER_B2BBEDRIJF.createMany({
                data: data.leverancier_B2BBedrijf
            });
        });

        afterAll(async () => {
            await prisma.kLANT_B2BBEDRIJF.deleteMany({
                where: {
                    Klant_ID: 6
                }
            });
            await prisma.lEVERANCIER_B2BBEDRIJF.deleteMany({
                where: {
                    Leverancier_ID: 7 
                }
            });
            await prisma.gEBRUIKER.deleteMany({
                where: {ID: {in: dataToDelete.users}},
            });

        });

        it('Zou 200 en de gevraagde gebruiker', async () => {
            const auth = await loginCustom('klant@email.com', 'wachtwoord');

            const response = await request.get(`${url}/6`).send().set('Authorization', auth);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                ID: 6,
                EMAIL: 'klant@email.com',
                DTYPE: 'Klant',
                GEBRUIKERSNAAM: 'test_klant',
                ISWACHTWOORDVERANDERD: true,
                ROL: 1,
                SALT: 'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                WACHTWOORD_HASH: '535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d'
            });
        });

        it('Zou 201 als je een andere gebruiker vraagt dan jezelf', async () => {
            const auth = await loginCustom('test_klant', 'wachtwoord');

            const response = await request.get(`${url}/7`).send().set('Authorization', auth);
            expect(response.status).toBe(403);
            expect(response.body.code).toBe('FORBIDDEN');
            expect(response.body.message).toBe('You are not allowed to view this user\'s information');
        });
    });

    describe('PUT /api/users/:id', () => {
        beforeAll(async () => {
            await prisma.gEBRUIKER.createMany({
                data: data.users,
            });
            await prisma.kLANT_B2BBEDRIJF.createMany({
                data: data.klant_B2BBedrijf
            });
            await prisma.lEVERANCIER_B2BBEDRIJF.createMany({
                data: data.leverancier_B2BBedrijf
            });
        });

        afterAll(async () => {
            await prisma.kLANT_B2BBEDRIJF.deleteMany({
                where: {
                    Klant_ID: 6
                }
            });
            await prisma.lEVERANCIER_B2BBEDRIJF.deleteMany({
                where: {
                    Leverancier_ID: 7 
                }
            });
            await prisma.gEBRUIKER.deleteMany({
                where: {ID: {in: dataToDelete.users}},
            });

        });

        it('Zou 200 en de gebruiker (klant) moeten updaten', async () =>{
            const auth = await loginCustom('test_klant', 'wachtwoord');

            const response = await request.put(`${url}/6`).send({
                'gebruikersnaam': 'testupdate',
                'email': 'testupdate@gmail.com',
                'wachtwoord': 'wachtwoord'
            }).set('Authorization', auth);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                'ID': 6,
                'EMAIL': 'testupdate@gmail.com',
                'DTYPE': 'Klant',
                'GEBRUIKERSNAAM': 'testupdate',
                'ISWACHTWOORDVERANDERD': true,
                'ROL': 1,
                'SALT': 'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                'WACHTWOORD_HASH': '535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d'
            });
        });

        it('Zou 200 en de gebruiker (leverancier) moeten updaten', async () =>{
            const auth = await loginCustom('test_leverancier', 'wachtwoord');

            const response = await request.put(`${url}/7`).send({
                'gebruikersnaam': 'testupdateleverancier',
                'email': 'testupdateLeverancier@gmail.com',
                'wachtwoord': 'wachtwoord'
            }).set('Authorization', auth);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                'ID': 7,
                'EMAIL': 'testupdateLeverancier@gmail.com',
                'DTYPE': 'Leverancier',
                'GEBRUIKERSNAAM': 'testupdateleverancier',
                'ISWACHTWOORDVERANDERD': true,
                'ROL': 0,
                'SALT': 'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                'WACHTWOORD_HASH': '535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d'
            });

        });

        it('Zou 401 wanneer je niet aangemeld bent als de gebruiker die je wil veranderen', async () => {
            const auth = await loginCustom('testupdateleverancier', 'wachtwoord'); 
            const response = await request.put(`${url}/6`).send({
                'gebruikersnaam': 'ongeldig',
                'wachtwoord': 'wachtwoord'
            }).set('Authorization', auth);
      
            expect(response.statusCode).toBe(403);
            expect(response.body.code).toBe('FORBIDDEN');
            expect(response.body.message).toBe('You are not allowed to view this user\'s information');
        });
    });
});