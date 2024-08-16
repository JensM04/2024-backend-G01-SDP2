const {loginKlant, withServer} = require('../supertest.setup');

const data = {
    bestellingen: [{
        BESTELLINGID: 4,
        BEDRAG: 999.95,
        BESTELLINGDATUM: '2024-02-01T14:40:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 1,
        UUIDVALUE: '7eb8dffd-3920-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Gent',
        HUISNUMMER: 6,
        POSTCODE: 9000,
        STRAAT: 'veldstraat',
        klantid: 1,
        leverancierid: 2,
    }, {
        BESTELLINGID: 5,
        BEDRAG: 9980.30,
        BESTELLINGDATUM: '2024-05-01T13:20:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 0,
        UUIDVALUE: '7eb8dffd-3921-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Aalter',
        HUISNUMMER: 1,
        POSTCODE: 9880,
        STRAAT: 'Sint-Jozefstraat',
        klantid: 2,
        leverancierid: 1,
    }], 
};

const dataToDelete = {
    bestellingen: [4, 5],
    gebruikers: [1],
};

describe('Betaling', () => {
    let request;
    let prisma;
    let authHeader;

    withServer(({supertest, prisma: p}) => {
        request = supertest;
        prisma = p;
    });

    beforeAll(async () => {
        authHeader = await loginKlant(request);
    });

    const url = '/api/betalingen';

    describe('POST /api/betalingen/:id', () => {
        beforeAll(async () => {
            await prisma.Bestelling.createMany({
                data: data.bestellingen,
            });
        });

        afterAll(async () => {
            
            await prisma.bETALING.deleteMany({});
            await prisma.Bestelling.deleteMany({
                where: {BESTELLINGID: {in: dataToDelete.bestellingen}},
            });

        });

        it('Zou 201 en een betaling moeten toevoegen voor de bestelling', async () =>{
            const response = await request.post(`${url}/7eb8dffd-3920-488a-bb5a-97c032873ae3`).send({
                'betaalbedrag': 120
            }).set('Authorization', authHeader);

            expect(response.status).toBe(201);
            expect(response.body.BETALINGID).toBeTruthy();
            expect(response.body.BETAALDEBEDRAG).toBe('120');
        });

        it('Zou 400 wanneer je geen nummer geeft als bedrag', async() => {
            const response = await request.post(`${url}/3920`).send({
                'betaalbedrag': 'abc'
            }).set('Authorization', authHeader);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('betaalbedrag');

        });

        it('Zou 404 wanneer de bestelling niet bestaat', async() => {
            const response = await request.post(`${url}/3912abc`).send({
                'betaalbedrag': '120'
            }).set('Authorization', authHeader);
            
            expect(response.statusCode).toBe(404);
            expect(response.body.code).toBe('NOT_FOUND');
            expect(response.body.message).toBe('Bestelling met id 3912abc niet gevonden');

        });
    });
});