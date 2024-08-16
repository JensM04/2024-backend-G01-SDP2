const {login, loginKlant, withServer} = require('../supertest.setup');

const data = {
    producten: [{
        ID: 1,
        NAAM: 'product1',
        AANTALINSTOCK: 30,
        EENHEIDSPRIJS: '800.00',
    },
    {
        ID: 2,
        NAAM: 'product2',
        AANTALINSTOCK: 24,
        EENHEIDSPRIJS: '750.00',
    },
    {
        ID: 3,
        NAAM: 'product3',
        AANTALINSTOCK: 15,
        EENHEIDSPRIJS: '205.00'
    }]
};

const dataToDelete = {
    producten: [1, 2, 3],
};

describe('Producten', () => {
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

    const url = '/api/producten';

    describe('GET api/producten/:id', () => {
        beforeAll(async () => {
            await prisma.pRODUCT.createMany({
                data: data.producten,
            });
        });
        
        afterAll(async () => {
            await prisma.pRODUCT.deleteMany({
                where: {ID: {in: dataToDelete.producten}},
            });
        });

        it('Zou 200 en 3 producten moeten teruggeven als niet ingelogd', async () => {
            const res = await request.get(`${url}?rijen=16&pagina=0`);
            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(3);
            expect(res.body.items[0]).toEqual({
                id: 1,
                naam: 'product1',
                aantalInStock: 30,
                eenheidsprijs: '800',
            });
        });

        it('Zou 200 en 3 producten moeten teruggeven als ingelogd als klant', async () => {
            const res = await request.get(`${url}?rijen=16&pagina=0`).set('Authorization', klantHeader);
            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(3);
            expect(res.body.items[0]).toEqual({
                id: 1,
                naam: 'product1',
                aantalInStock: 30,
                eenheidsprijs: '800',
            });
        });

        it('Zou 200 en 3 producten moeten teruggeven als ingelogd als leverancier', async () => {
            const res = await request.get(`${url}?rijen=16&pagina=0`).set('Authorization', authHeader);
            expect(res.status).toBe(200);
            expect(res.body.items.length).toBe(3);
            expect(res.body.items[0]).toEqual({
                id: 1,
                naam: 'product1',
                aantalInStock: 30,
                eenheidsprijs: '800',
            });
        });
    });
});