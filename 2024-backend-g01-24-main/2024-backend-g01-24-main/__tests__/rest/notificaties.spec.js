const { login, withServer } = require('../supertest.setup');

const data = {
    notificaties: [],
    bestellingen: [{
        BESTELLINGID: 8,
        BEDRAG: 999.95,
        BESTELLINGDATUM: '2024-02-01T14:40:00.000Z',
        BESTELLINGSTATUS: 1,
        BETAALSTATUS: 1,
        UUIDVALUE: '7eb8dffd-3906-488a-bb5a-97c032873ae3',
        GEMEENTE: 'Gent',
        HUISNUMMER: 6,
        POSTCODE: 9000,
        STRAAT: 'veldstraat',
        klantid: 2,
        leverancierid: 1,
    }],
};

const createNotificaties = async (gebruikerId, extra = 0) => {
    for (let i = 0; i < 18; i++) {
        const status = i < 2 ? 'nieuw' : i < 4 ? 'ongelezen' : 'gelezen';
        const datumIndex = (i % 9) + 1;
        data.notificaties.push({
            id: extra === 4 ? i + 19 : i + 1,
            notificatieSoort: 'Betalingsverzoek',
            datum: `2024-03-0${datumIndex}T14:4${datumIndex}:00.000Z`,
            tekst: 'Dit is een test notificatie',
            status: status,
            bestellingid: 8,
            gebruikerid: gebruikerId,
            avatar: 'test',
        });
    }
};

const dataToDelete = {
    notificaties1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    notificaties2: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    bestellingen: [8],
};

describe('Notificaties', () => {
    let request;
    let prisma;
    let authHeader;

    withServer(({ supertest, prisma: p }) => {
        request = supertest;
        prisma = p;
    });

    beforeAll(async () => {
        authHeader = await login(request);
    });

    const url = '/api/notificaties';

    describe('GET /api/notificaties', () => {
        beforeEach(async () => {
            await prisma.Bestelling.createMany({
                data: data.bestellingen,
            });
            await createNotificaties(1);
            await prisma.NOTIFICATIE.createMany({
                data: data.notificaties,
            });
        });

        afterEach(async () => {
            await prisma.NOTIFICATIE.deleteMany({
                where: { id: { in: dataToDelete.notificaties1 } },
            });
            await prisma.Bestelling.deleteMany({
                where: { BESTELLINGID: { in: dataToDelete.bestellingen } },
            });
        });

        it('should return 200 and the first 10 notifications', async () => {
            const response = await request.get(`${url}?pagina=0&rijen=10`)
                .set('Authorization', authHeader);
            expect(response.body.items.length).toBe(10);
            expect(response.body.items[0]).toEqual({
                id: 9,
                notificatieSoort: 'Betalingsverzoek',
                datum: '2024-03-09T14:49:00.000Z',
                tekst: 'Dit is een test notificatie',
                status: 'gelezen',
                bestellingid: 8,
                avatar: 'test',
            });
        });
    });

    describe('POST /api/notificaties', () => {
        afterEach(async () => {
            await prisma.NOTIFICATIE.deleteMany({
                where: { id: { in: dataToDelete.notificaties2 } },
            });
        });

        describe('PUT /api/notificaties/:id', () => {
            beforeEach(async () => {
                await prisma.Bestelling.createMany({
                    data: data.bestellingen,
                });
                await createNotificaties(1, 4);
                await prisma.NOTIFICATIE.createMany({
                    data: data.notificaties,
                });
            });

            afterEach(async () => {
                await prisma.NOTIFICATIE.deleteMany({
                    where: { id: { in: dataToDelete.notificaties2 } },
                });
            });

            it('should update the status of a notification', async () => {
                const response = await request.put(`${url}/19`)
                    .send({ status: 'gelezen' })
                    .set('Authorization', authHeader);

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject({
                    id: 19,
                    status: 'gelezen',
                });
            });
        });
    });
});
