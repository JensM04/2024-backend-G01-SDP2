const { testAuthHeader } = require('../common/auth');
const {login, loginKlant, withServer} = require('../supertest.setup');

const data = {
    producten: [{
        ID: 4,
        NAAM: 'product4',
        AANTALINSTOCK: 30,
        EENHEIDSPRIJS: '800.00',
    },
    {
        ID: 5,
        NAAM: 'product5',
        AANTALINSTOCK: 24,
        EENHEIDSPRIJS: '750.00',
    },
    {
        ID: 6,
        NAAM: 'product6',
        AANTALINSTOCK: 15,
        EENHEIDSPRIJS: '205.00'
    }],
    productenInBestelling: [{
        ID: 1,
        AANTAL: 2,
        B2BBESTELLING_BESTELLINGID: 7,
        PRODUCTID: 4,
    },
    {
        ID: 2,
        AANTAL: 3,
        B2BBESTELLING_BESTELLINGID: 7,
        PRODUCTID: 5,
    },
    {
        ID: 3,
        AANTAL: 1,
        B2BBESTELLING_BESTELLINGID: 6,
        PRODUCTID: 6,
    }],
    bestellingen: [{ 
        BESTELLINGID: 7,
        BEDRAG: 999.95 ,
        BESTELLINGDATUM: '2024-02-01T14:40:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 1,
        UUIDVALUE: '7eb8dffd-3953-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Gent',
        HUISNUMMER: 6,
        POSTCODE: 9000,
        STRAAT: 'veldstraat',
        klantid: 1,
        leverancierid: 2,

    }, {
        BESTELLINGID: 6,
        BEDRAG: 2980.30,
        BESTELLINGDATUM: '2024-05-01T13:20:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 0,
        UUIDVALUE: '7eb8dffd-3971-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Zwalm',
        HUISNUMMER: 1,
        POSTCODE: 9630,
        STRAAT: 'MooieStraat',
        klantid: 8,
        leverancierid: 2,
    }],
    bedrijven: [{
        BEDRIJFID: 8,
        EMAIL: 'bedrijf8@test.com',
        ISACTIEF: true,
        NAAM: 'Bedrijf8',
        SECTOR: 'IT',
        TELEFOONNUMMER: '0488888888',
        UUIDVALUE: '7eb8dffd-3012-488a-bb5a-97c032873ae3',
        WEBSITEURL: 'www.bedrijf8.com',
        GEMEENTE: 'Gent',
        HUISNUMMER: 2,
        POSTCODE: 9000,
        STRAAT: 'Verderstraat',
    }]
};

const dataToDelete = {
    producten: [4, 5, 6],
    bestellingen: [6, 7],
    productenInBestelling: [1, 2, 3],
    bedrijven: [8],
};

describe('ProductenInBestelling', () => {
    let request;
    let prisma;
    let authHeader;
    let klantHeader;

    withServer(({supertest, prisma: p}) => {
        request = supertest;
        prisma = p;
    });

    beforeAll(async () => {
        authHeader = await login(request);
        klantHeader = await loginKlant(request);
    });

    const url = '/api/productenBestelling';

    describe('GET api/productenInBestelling/', () => {
        beforeAll(async () => {
            await prisma.b2BBEDRIJF.createMany({
                data: data.bedrijven,
            });
            await prisma.pRODUCT.createMany({
                data: data.producten,
            });
            await prisma.bestelling.createMany({
                data: data.bestellingen,
            });
            await prisma.pRODUCTINBESTELLING.createMany({
                data: data.productenInBestelling,
            });
        });

        afterAll(async () => {
            await prisma.pRODUCTINBESTELLING.deleteMany({
                where: {ID: {in: dataToDelete.productenInBestelling}},
            });
            await prisma.pRODUCT.deleteMany({
                where: {ID: {in: dataToDelete.producten}},
            });
            await prisma.bestelling.deleteMany({
                where: {BESTELLINGID: {in: dataToDelete.bestellingen}},
            });
            await prisma.b2BBEDRIJF.deleteMany({
                where: {BEDRIJFID: {in: dataToDelete.bedrijven}},
            });
        });

        it('zou 200 en 2 producten moeten teruggeven, ingelogd als klant', async() => {
            const response = await request.get(`${url}?bestellingId=7eb8dffd-3953-488a-bb5a-97c032873ae3&bedrijfId=1`).set('Authorization', klantHeader);
            expect(response.status).toBe(200);
            console.log(response.body.items);
            expect(response.body.productenInBestelling.length).toBe(2);
            expect(response.body.productenInBestelling[0]).toEqual({
                ID: 1,
                AANTAL: 2,
                B2BBESTELLING_BESTELLINGID: 7,
                PRODUCTID: 4,
                AANTALINSTOCK: 30,
                EENHEIDSPRIJS: '800',
                NAAM: 'product4'
            });
        });
        it('zou 200 en 2 producten moeten teruggeven, ingelogd als leverancier', async() => {
            const response = await request.get(`${url}?bestellingId=7eb8dffd-3953-488a-bb5a-97c032873ae3&bedrijfId=1`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            console.log(response.body.items);
            expect(response.body.productenInBestelling.length).toBe(2);
            expect(response.body.productenInBestelling[0]).toEqual({
                ID: 1,
                AANTAL: 2,
                B2BBESTELLING_BESTELLINGID: 7,
                PRODUCTID: 4,
                AANTALINSTOCK: 30,
                EENHEIDSPRIJS: '800',
                NAAM: 'product4'
            });
        });

        it('zou 403 moeten teruggeven bij bestelling niet van klant, ingelogd als klant', async() => {
            const response = await request.get(`${url}?bestellingId=7eb8dffd-3971-488a-bb5a-97c032873ae3&bedrijfId=1`).set('Authorization', klantHeader);
            expect(response.status).toBe(403);
            expect(response.body).toEqual({
                code: 'FORBIDDEN',
                details: {},
                message: 'You are not allowed to view this user\'s information'
            });
        });

        testAuthHeader(() => request.get(url));
    });
});