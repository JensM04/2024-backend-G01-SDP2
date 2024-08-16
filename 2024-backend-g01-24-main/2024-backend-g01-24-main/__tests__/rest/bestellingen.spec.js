const {login, loginKlant, withServer} = require('../supertest.setup');
const {testAuthHeader} = require('../common/auth');

const data = {
    bestellingen: [{
        BESTELLINGID: 1,
        BEDRAG: 999.95 ,
        BESTELLINGDATUM: '2024-02-01T14:40:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 1,
        UUIDVALUE: '7eb8dffd-3912-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Gent',
        HUISNUMMER: 6,
        POSTCODE: 9000,
        STRAAT: 'veldstraat',
        klantid: 1,
        leverancierid: 2,
    }, {
        BESTELLINGID: 2,
        BEDRAG: 9980.30,
        BESTELLINGDATUM: '2024-05-01T13:20:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 0,
        UUIDVALUE: '7eb8dffd-3915-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Aalter',
        HUISNUMMER: 1,
        POSTCODE: 9880,
        STRAAT: 'Sint-Jozefstraat',
        klantid: 1,
        leverancierid: 2,
    }, {
        BESTELLINGID: 3,
        BEDRAG: 2980.30,
        BESTELLINGDATUM: '2024-05-01T13:20:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 0,
        UUIDVALUE: '7eb8dffd-3918-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Zwalm',
        HUISNUMMER: 1,
        POSTCODE: 9630,
        STRAAT: 'MooieStraat',
        klantid: 2,
        leverancierid: 1,
    }
    ], 
};

const dataToDelete = {
    bestellingen: [1, 2, 3],
    gebruikers: [1],
};

describe('Bestelling', () => {
    let request;
    let prisma;
    let authHeader;
    let klantHeader;

    withServer(({supertest, prisma: p}) => {
        request = supertest;
        prisma = p;
    });

    beforeAll(async () => {
        console.log(`request bestelling ${request}`);
        authHeader = await login(request);
        klantHeader = await loginKlant(request);
    });

    const url = '/api/bestellingen';

    describe('GET /api/bestellingen/:id', () => {
        beforeAll(async () => {
            await prisma.Bestelling.createMany({
                data: data.bestellingen,
            });
        });

        afterAll(async () => {
            await prisma.Bestelling.deleteMany({
                where: {BESTELLINGID: {in: dataToDelete.bestellingen}},
            });
        });
    
        it('Zou 200 en bestelling met id moeten teruggeven (leverancier)', async () => {
            const response = await request.get(`${url}/3918`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                bedrag: '2980.30',
                datum: '2024-05-01T13:20:00.000Z',
                bestellingstatus: 'VERWERKT',
                betaalstatus: 'ONVERWERKT',
                id : '7eb8dffd-3918-488a-bb5a-97c032873ae3',
                GEMEENTE: 'Zwalm',
                HUISNUMMER: 1,
                POSTCODE: 9630,
                STRAAT: 'MooieStraat',
                klantid: 2,
                leverancierid: 1,
                oudId: 3
            });
        });

        it('zou 404 moeten geven als bestelling niet bestaat', async () => {
            const response = await request.get(`${url}/999999999999`).set('Authorization', authHeader);
            expect(response.status).toBe(404);
            expect(response.body.code).toBe('NOT_FOUND');
        });
        testAuthHeader(() => request.get(url));
    });

    describe('GET /api/bestellingen', () => {

        beforeAll(async () => {
            await prisma.Bestelling.createMany({
                data: data.bestellingen,
            });
        });

        afterAll(async () => {
            await prisma.Bestelling.deleteMany({
                where: {BESTELLINGID: {in: dataToDelete.bestellingen}},
            });
        });

        it('Zou 200 en een lijst van bestellingen moeten teruggeven (leverancier)', async () => {
            const response = await request.get(`${url}?pagina=0&rijen=10`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(1);
            expect(response.body.items[0]).toEqual({
                bedrag: '2980.30',
                bestellingstatus: 'VERWERKT',
                betaalstatus: 'ONVERWERKT',
                datum: '2024-05-01T13:20:00.000Z',
                id: '7eb8dffd-3918-488a-bb5a-97c032873ae3'
            });
        });

        it('Zou 200 en een lijst van bestellingen moeten teruggeven (klant)', async () => {
            const response = await request.get(`${url}?pagina=0&rijen=10`).set('Authorization', klantHeader);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(2);
            expect(response.body.items[1]).toEqual({
                bedrag: '999.95',
                bestellingstatus: 'VERWERKT',
                betaalstatus: 'FACTUUR VERZONDEN',
                datum: '2024-02-01T14:40:00.000Z',
                id: '7eb8dffd-3912-488a-bb5a-97c032873ae3',
            });
        });

        it('Zou 200 en een lijst van bestellingen moeten teruggeven met filter (klant)', async () => {
            const response = await request.get(`${url}?pagina=0&rijen=10&id=3915`).set('Authorization', klantHeader);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(1);
            expect(response.body.items[0]).toEqual({
                bedrag: '9980.30',
                bestellingstatus: 'VERWERKT',
                betaalstatus: 'ONVERWERKT',
                datum: '2024-05-01T13:20:00.000Z',
                id: '7eb8dffd-3915-488a-bb5a-97c032873ae3',
            });
        });

        it ('Zou 400 wanneer foute query voor rijen', async () => {
            const response = await request.get(`${url}?pagina=0&rijen=-10`).set('Authorization', authHeader);
            
            expect(response.status).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('rijen');
        });

        it ('Zou 400 wanneer foute query voor pagina', async () => {
            const response = await request.get(`${url}?pagina=-10&rijen=10`).set('Authorization', authHeader);
            
            expect(response.status).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('pagina');
        });
        
        testAuthHeader(() => request.get(url));
    });
});