const { testAuthHeader } = require('../common/auth');
const {login, withServer, loginKlant2 } = require('../supertest.setup');


const data = {
    bedrijven: [{
        BEDRIJFID: 3,
        EMAIL: 'test1@b2bbedrijf.com',
        ISACTIEF: true,
        NAAM: 'bedrijf1',
        SECTOR: 'sector-n1',
        TELEFOONNUMMER: '+32400000001',
        UUIDVALUE: 'f28bc12f-5ef0-4926-ada6-ceb27e8451c5',
        WEBSITEURL: 'https://www.bedrijf1.com',
        BUS: null,
        GEMEENTE: 'Gemeente1',
        HUISNUMMER: 1,
        POSTCODE: 1001,
        STRAAT:'straat1',
        BTWNr: 'BE0119669337'
    }, {
        BEDRIJFID: 4,
        EMAIL: 'test2@b2bbedrijf.com',
        ISACTIEF: true,
        NAAM: 'bedrijf2',
        SECTOR: 'sector-n2',
        TELEFOONNUMMER: '+32400000002',
        UUIDVALUE: 'f28bc12f-5ef0-4926-ada6-ceb27e8451d4',
        WEBSITEURL: 'https://www.bedrijf2.com',
        BUS: null,
        GEMEENTE: 'Gemeente2',
        HUISNUMMER: 2,
        POSTCODE: 1002,
        STRAAT:'straat2',
        BTWNr: 'BE0119669338'
    }], 
};

const dataToDelete = {
    bedrijven: [3, 4],
};

describe('Bedrijf', () => {
    let request;
    let prisma;
    let authHeader;

    withServer(({supertest, prisma: p}) => {
        request = supertest;
        prisma = p;
    });

    beforeAll(async () => {
        console.log(`request bestelling ${request}`);
        authHeader = await login(request);
    });

    const url = '/api/bedrijven';

    describe(`GET ${url}/`, () => {
        beforeAll(async () => {
            await prisma.b2BBEDRIJF.createMany({
                data: data.bedrijven
            });
        });

        afterAll( async () => {
            await prisma.b2BBEDRIJF.deleteMany({
                where: {BEDRIJFID: {in: dataToDelete.bedrijven}}
            });
        });

        it('Zou 200 en bedrijf van de ingelogde leverancier terug', async () => {
            const response = await request.get(`${url}`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                email: 'bedrijf1@test.com',
                isActief: true,
                naam: 'Bedrijf1',
                sector: 'IT',
                telefoonnummer: '0477777777',
                uuid: '7eb8dffd-3906-488a-bb5a-97c032873ae3',
                website: 'www.bedrijf1.com',
                adres: {
                    bus: null,
                    gemeente: 'Gent',
                    huisnummer: 1,
                    postcode: 9000,
                    straat:'Veldstraat'                    
                },
                BTWNr: null
            });
        });
        
        it('Zou 200 en bedrijf van de ingelogde klant terug', async () => {
            const authHeader = await loginKlant2(request);
            const response = await request.get(`${url}`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 2,
                email: 'bedrijf2@test.com',
                isActief: true,
                naam: 'Bedrijf2',
                sector: 'IT',
                telefoonnummer: '0488888888',
                uuid: '7eb8dffd-3006-488a-bb5a-97c032873ae3',
                website: 'www.bedrijf2.com',
                adres: {
                    bus: null,
                    gemeente: 'Gent',
                    huisnummer: 2,
                    postcode: 9000,
                    straat:'Verderstraat'                    
                },
                BTWNr: null
            });
        });

        testAuthHeader(() => request.post(url));
    });


    describe(`POST${url}`, () => {
        beforeAll(async () => {
            await prisma.b2BBEDRIJF.createMany({
                data: data.bedrijven
            });
        });

        afterAll( async () => {
            await prisma.b2BBEDRIJF.deleteMany({
                where: {BEDRIJFID: {in: dataToDelete.bedrijven}}
            });
            await prisma.b2BBEDRIJFUPDATEREQUEST.deleteMany({});
        });

        it('Zou 201 en een nieuw bedrijfUpdateRequest aanmaken', async () => {
            const response = await request.post(url).send({
                'BEDRIJFID': 3,
                'EMAIL': 'verander@gmail.com',
                'NAAM': 'verander',
                'SECTOR': 'IT',
                'TELEFOONNUMMER': '043928349',
                'WEBSITEURL': 'verander.be',
                'GEMEENTE': 'Gent',
                'HUISNUMMER': 4,
                'POSTCODE': 9000,
                'STRAAT': 'Veranderstraat'
            }).set('Authorization', authHeader);
            expect(response.status).toBe(201);
            expect(response.body.ID).toBeTruthy();
            expect(response.body.BEDRIJFID).toBe(3);
            expect(response.body.EMAIL).toBe('verander@gmail.com');
            expect(response.body.NAAM).toBe('verander');
            expect(response.body.SECTOR).toBe('IT');
            expect(response.body.TELEFOONNUMMER).toBe('043928349');
            expect(response.body.BUS).toBe(null);
            expect(response.body.WEBSITEURL).toBe('verander.be');
            expect(response.body.GEMEENTE).toBe('Gent');
            expect(response.body.POSTCODE).toBe(9000);
            expect(response.body.STRAAT).toBe('Veranderstraat');
        });
        
        //TODO: eventuuel testen maken voor elk apart veldje als het ontbreekt
        it('Zou 400 wanneer email ontbreekt', async () => {
            const response = await request.post(url).send({
                'BEDRIJFID': 3,
                'NAAM': 'verander',
                'SECTOR': 'IT',
                'TELEFOONNUMMER': '043928349',
                'WEBSITEURL': 'verander.be',
                'GEMEENTE': 'Gent',
                'HUISNUMMER': 4,
                'POSTCODE': 9000,
                'STRAAT': 'Veranderstraat'
            }).set('Authorization', authHeader);
      
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('EMAIL');
        });

        testAuthHeader(() => request.post(url));
    });
});