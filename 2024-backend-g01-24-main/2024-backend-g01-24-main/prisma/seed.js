const {
    v4: uuidv4,
} = require('uuid');
const {
    PrismaClient
} = require('@prisma/client');
const {
    promises
} = require('supertest/lib/test');

const {
    hashPassword
} = require('../src/core/password');
const SeedableNumberGenerator = require('../src/utils/SeedableNumberGenerator');
const seededUUIDv4 = require('../src/utils/SeedableUUIDV5');
const seededUUIDv5 = require('../src/utils/SeedableUUIDV5');

const prisma = new PrismaClient();

// DTYPE en ROL
const ROLLEN = {
    admin: 'ADMINISTRATOR',
    leverancier: 'LEVERANCIER',
    klant: 'KLANT'
};
const ROL_NAAR_DTYPE = {
    ADMINISTRATOR: 'Administrator',
    LEVERANCIER: 'Leverancier',
    KLANT: 'Klant'
};

const sectors = {
    socialMedia: 'SOCIALMEDIA',
    it: 'IT',
    automotive: 'AUTOMOTIVE',
    finance: 'FINANCE',
    health: 'HEALTH',
    transportation: 'TRANSPORTATION',
    education: 'EDUCATION',
    energy: 'ENERGY',
    food: 'FOOD'
};

const BEDRIJVEN = [{
    naam: 'TechHub Belgium',
    email: 'contact@techhub.be',
    sector: sectors.it,
    url: 'https://www.techhub.be'
},
{
    naam: 'HealthCare Plus',
    email: 'info@healthcareplus.be',
    sector: sectors.health,
    url: 'https://www.healthcareplus.be'
},
{
    naam: 'EcoEnergy Solutions',
    email: 'support@ecoenergy.be',
    sector: sectors.energy,
    url: 'https://www.ecoenergy.be'
},
{
    naam: 'FinTrust Advisors',
    email: 'inquiries@fintrust.be',
    sector: sectors.finance,
    url: 'https://www.fintrust.be'
},
{
    naam: 'EduBright',
    email: 'hello@edubright.be',
    sector: sectors.education,
    url: 'https://www.edubright.be'
},
{
    naam: 'AutoDrive Belgium',
    email: 'service@autodrive.be',
    sector: sectors.automotive,
    url: 'https://www.autodrive.be'
},
{
    naam: 'Transpo Logistics',
    email: 'team@transpologistics.be',
    sector: sectors.transportation,
    url: 'https://www.transpologistics.be'
},
{
    naam: 'Foodies Delight',
    email: 'contact@foodiesdelight.be',
    sector: sectors.food,
    url: 'https://www.foodiesdelight.be'
},
{
    naam: 'MediNet Belgium',
    email: 'info@medinet.be',
    sector: sectors.health,
    url: 'https://www.medinet.be'
},
{
    naam: 'SmartSocial',
    email: 'support@smartsocial.be',
    sector: sectors.socialMedia,
    url: 'https://www.smartsocial.be'
},
{
    naam: 'FutureTech',
    email: 'info@futuretech.be',
    sector: sectors.it,
    url: 'https://www.futuretech.be'
},
{
    naam: 'SafeDrive',
    email: 'contact@safedrive.be',
    sector: sectors.automotive,
    url: 'https://www.safedrive.be'
},
{
    naam: 'Finance360',
    email: 'info@finance360.be',
    sector: sectors.finance,
    url: 'https://www.finance360.be'
},
{
    naam: 'HealthyLife',
    email: 'support@healthylife.be',
    sector: sectors.health,
    url: 'https://www.healthylife.be'
},
{
    naam: 'TransExpress',
    email: 'contact@transexpress.be',
    sector: sectors.transportation,
    url: 'https://www.transexpress.be'
},
{
    naam: 'EduSmart',
    email: 'hello@edusmart.be',
    sector: sectors.education,
    url: 'https://www.edusmart.be'
},
{
    naam: 'GreenEnergy Belgium',
    email: 'support@greenenergy.be',
    sector: sectors.energy,
    url: 'https://www.greenenergy.be'
},
{
    naam: 'GourmetBites',
    email: 'info@gourmetbites.be',
    sector: sectors.food,
    url: 'https://www.gourmetbites.be'
},
{
    naam: 'InnoSocial',
    email: 'contact@innosocial.be',
    sector: sectors.socialMedia,
    url: 'https://www.innosocial.be'
},
{
    naam: 'BrightIT Solutions',
    email: 'support@brightit.be',
    sector: sectors.it,
    url: 'https://www.brightit.be'
}
];

const STRATEN = [
    'Kerkstraat',
    'Dorpsstraat',
    'Lindelaan',
    'Beukenlaan',
    'Eikenstraat',
    'Kastanjedreef',
    'Meersstraat',
    'Zandstraat',
    'Stationsstraat',
    'Rijksweg'
];

const GEMEENTES = [{
    gemeente: 'Antwerpen',
    postcode: 2000
},
{
    gemeente: 'Gent',
    postcode: 9000
},
{
    gemeente: 'Brugge',
    postcode: 8000
},
{
    gemeente: 'Leuven',
    postcode: 3000
},
{
    gemeente: 'Mechelen',
    postcode: 2800
},
{
    gemeente: 'Hasselt',
    postcode: 3500
},
{
    gemeente: 'Oostende',
    postcode: 8400
},
{
    gemeente: 'Kortrijk',
    postcode: 8500
},
{
    gemeente: 'Sint-Niklaas',
    postcode: 9100
},
{
    gemeente: 'Genk',
    postcode: 3600
}
];

const PRODUCTNAMEN = [
    'StellarGrip Sports Shoes',
    'TechSavvy Laptop Bag',
    'EcoFusion Bamboo Toothbrush',
    'ZenGarden Meditation Pillow',
    'AquaSprout Plant Watering System',
    'NovaGlow LED Desk Lamp',
    'SolarBloom Garden Lights',
    'TurboCharge Portable Power Bank',
    'PureElixir Facial Serum',
    'GalaxySpin Fidget Spinner',
    'BioFresh Fruit Infuser Bottle',
    'SwiftGear Running Socks',
    'LunaFlare Camping Lantern',
    'SnapShot Instant Camera',
    'SmartSweep Robotic Vacuum',
    'AeroDrift Drone with HD Camera',
    'ChillWave Beverage Cooler',
    'Solaris Solar Panels',
    'CloudMist Essential Oil Diffuser',
    'HydroZen Yoga Mat',
    'TerraTrek Hiking Backpack',
    'EchoPulse Bluetooth Speaker',
    'BioGlow Plant Grow Light',
    'LunaTide Surfboard Wax',
    'ArcticFrost Ice Scraper',
    'SparkRise Fire Starter Kit',
    'BioFuel Eco-friendly Stove',
    'SwiftShift Gearbox Oil',
    'TerraNova Organic Fertilizer',
    'SkyRider Kite'
];


function generateRandomBTWnr(seed) {
    const ng = new SeedableNumberGenerator({
        seed: seed,
        min: 0,
        max: 9,
    });

    let randomDigits = '0';
    for (let i = 0; i < 9; i++) {
        randomDigits += ng.nextInt();
    }
    return `BE${randomDigits}`;
}

function generateRandomPhoneNr(seed) {
    const ng = new SeedableNumberGenerator({
        seed: seed,
        min: 0,
        max: 9,
    });

    let randomDigits = '+324';
    for (let i = 0; i < 8; i++) {
        randomDigits += ng.nextInt();
    }
    return randomDigits;
}

function getRandomUitLijst(lijst, seed) {
    const ng = new SeedableNumberGenerator({
        seed: seed,
        min: 0,
        max: lijst.length - 1
    });

    return lijst[ng.nextInt()];
}

function getRandomStraat(seed) {
    return getRandomUitLijst(STRATEN, seed);
}

function getRandomGemeenteMetPostcode(seed) {
    return getRandomUitLijst(GEMEENTES, seed);
}

// workaround voor slechte naamgeving prisma -> returned prisma object met nieuwe naamgeving van entiteiten

// creeert een gebruiker object van meegegeven data voor prisma
function createGebruikerObject(email, gebruikersnaam, salt, wachtwoord, rol) {
    const wachtwoord_hash = hashPassword(wachtwoord, salt);
    return {
        EMAIL: email,
        GEBRUIKERSNAAM: gebruikersnaam,
        SALT: salt,
        WACHTWOORD_HASH: wachtwoord_hash,
        DTYPE:  ROL_NAAR_DTYPE[rol],
        ROL: rol
    };
}

// creeert een b2bbedrijf object van meegegeven data voor prisma
function createB2BBedrijfObject(email, naam, sector, telefoonnummer, websiteurl, straat, huisnummer, bus, postcode, gemeente, BTWNr) {
    return {
        EMAIL: email,
        NAAM: naam,
        SECTOR: sector,
        TELEFOONNUMMER: telefoonnummer,
        UUIDVALUE: seededUUIDv5(),
        WEBSITEURL: websiteurl,
        GEMEENTE: gemeente,
        POSTCODE: postcode,
        STRAAT: straat,
        HUISNUMMER: huisnummer,
        BUS: bus,
        ISACTIEF: true,
        BTWNr: BTWNr,
    };
}

function createBestellingObject(
    bedrag, bestellingdatum,
    bestellingsstatus,
    betaalstatus,
    gemeente,
    huisnummer, postcode, straat, klantid,
    leverancierid, productenInBestelling
) {
    return {
        BEDRAG: bedrag,
        BESTELLINGDATUM: bestellingdatum,
        BESTELLINGSTATUS: bestellingsstatus,
        BETAALSTATUS: betaalstatus,
        UUIDVALUE: seededUUIDv5(),
        GEMEENTE: gemeente,
        HUISNUMMER: huisnummer,
        POSTCODE: postcode,
        STRAAT: straat,
        klantid,
        leverancierid,
        PRODUCTINBESTELLING: {
            create: productenInBestelling
        }
    };
}

async function createAdministrators() {
    const email = 'test@administrator.com';
    const gebruiker = await prisma.gEBRUIKER.upsert({
        where: {
            EMAIL: email
        },
        update: {},
        create: createGebruikerObject(
            email, 'administrator', 'admin', 'wachtwoord', ROLLEN.admin
        )
    });

    await prisma.aDMINISTRATOR.upsert({
        where: {
            ID: gebruiker.ID,
        },
        update: {},
        create: {
            GEBRUIKER: {
                connect: {
                    ID: gebruiker.ID
                }
            },
        }
    });
}

async function createB2BBedrijven() {
    const ng = new SeedableNumberGenerator({
        seed: 5,
        max: 100
    });
    for (let i = 0; i < BEDRIJVEN.length; i++) {
        const bedrijf = BEDRIJVEN[i];
        const gemeente = getRandomGemeenteMetPostcode(i * 2);
        await prisma.b2BBEDRIJF.upsert({
            where: {
                EMAIL: bedrijf.email
            },
            update: {},
            create: createB2BBedrijfObject(
                bedrijf.email, bedrijf.naam, bedrijf.sector, generateRandomPhoneNr(i * 10), 
                bedrijf.url, getRandomStraat(i * 3), ng.nextInt(), ['A', 'B', '20', null][ng.randomInt(0, 3)], gemeente.postcode, 
                gemeente.gemeente, generateRandomBTWnr(i * 4), i
            )
        });
    }
}

async function createProducten() {
    const ng = new SeedableNumberGenerator({});

    const createProductObject = (id, naam, aantalInStock, eenheidsprijs) => {
        return {
            ID: id,
            NAAM: naam,
            AANTALINSTOCK: aantalInStock,
            EENHEIDSPRIJS: eenheidsprijs
        };
    };

    for (let i = 1; i <= 1000; i++) {
        const aantalInStock = ng.randomInt(0, 999);
        const eenheidsprijs = ng.randomInt(0, 999) + (ng.randomInt(0, 99) / 100);
        const productNaam = PRODUCTNAMEN[ng.randomInt(0, PRODUCTNAMEN.length - 1)];
        await prisma.pRODUCT.upsert({
            where: {
                ID: i,
            },
            update: {},
            create: createProductObject(i, productNaam, aantalInStock, eenheidsprijs)
        });
    }
}

async function createBestellingen() {
    const ng = new SeedableNumberGenerator({seed: 50, min: 0, max: 9});
    const bedrijven = await prisma.b2BBEDRIJF.findMany();
    let leverancierIndex = 0;
    let klantIndex = 1;

    const producten = await prisma.pRODUCT.findMany();
    let productenIndex = 0;

    const getNextIndex = () => {
        leverancierIndex = (leverancierIndex + 1) % bedrijven.length;
        klantIndex = (klantIndex + 2) % bedrijven.length;
        if (leverancierIndex == klantIndex) klantIndex = (klantIndex + 1) % bedrijven.length;
    };

    for (let i = 1; i <= 3000; i++) {
        const datum = `202${Math.floor(i / 1000) % 10}-${((i%12) + 1).toString().padStart(2, '0')}-${((i % 28) + 1).toString().padStart(2, '0')}T${(i % 24).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}:00.000Z`;

        // haalt een deel uit alle producten en geeft ze een willekeurig aantal
        let productenEndIndex = productenIndex + (i % 10);
        if (productenEndIndex > producten.length) productenEndIndex = producten.length;
        const geselecteerdeProducten = producten.slice(productenIndex, productenEndIndex);
        productenIndex = (productenIndex + i) % producten.length;
        const aantallen = Array.apply(null, Array(geselecteerdeProducten.length)).map((v, index) =>
            ((index + 1) * i % 20)
        );

        let bestellingStatus = ng.randomInt(0, 5);
        let betaalStatus = ng.randomInt(0,2);

        let bedrag = 0;
        if (geselecteerdeProducten.length) {
            bedrag = geselecteerdeProducten.map((v, index) => v.EENHEIDSPRIJS * aantallen[index]).reduce((pv, cv) => pv + cv);
        }

        await prisma.bestelling.upsert({
            where: {
                BESTELLINGID: i,
            },
            update: {},
            create: createBestellingObject(bedrag, datum, bestellingStatus, betaalStatus, bedrijven[klantIndex].GEMEENTE, bedrijven[klantIndex].HUISNUMMER, bedrijven[klantIndex].POSTCODE, bedrijven[klantIndex].STRAAT, bedrijven[klantIndex].BEDRIJFID, bedrijven[leverancierIndex].BEDRIJFID, geselecteerdeProducten.map((v, index) => {
                return {
                    AANTAL: aantallen[index],
                    PRODUCTID: v.ID,
                };
            }), i)
        });
        getNextIndex();
    }
}

async function createBetalingen() {
    // 1. verkrijg alle bestellingen gekoppeld met bedrijfid
    const alleBestellingen = await prisma.bestelling.findMany();

    // 2. voor 1/2 bestellingen voeg een betaling toe
    const gefilterdeBestellingen = alleBestellingen.filter((v, i) => i % 2 === 0);
    const betalingen = [];

    for (const bestelling of gefilterdeBestellingen) {
        const bestellingDatum = bestelling.BESTELLINGDATUM;
        const betalingDatum = new Date(bestellingDatum);
        betalingDatum.setDate(betalingDatum.getDate() + 2);
        // 3. voor elke betaling: BETAALDATUM, BETAALDEBEDRAG, ISGOEDGEKEURD, ISVERWERKT, TEBETALEN, KlantID, BestellingID
        betalingen.push({
            BETAALDATUM: betalingDatum,
            BETAALDEBEDRAG: bestelling.BEDRAG,
            ISGOEDGEKEURD: true,
            ISVERWERKT: true,
            TEBETALEN: bestelling.BEDRAG,
            KlantID: bestelling.klantid,
            BestellingID: bestelling.BESTELLINGID
        });
    }

    // 4. voeg alle betalingen toe
    await prisma.bETALING.createMany({
        data: betalingen
    });
}

const convertNaarSnakeCase = (string) => {
    return string.toLocaleLowerCase().split(' ').join('_');
};

async function createKlantGebruikers() {
    const bedrijven = await prisma.b2BBEDRIJF.findMany();
    for (const bedrijf of bedrijven) {
        for (let i = 1; i <= 10; i++) {
            const email = `klant${i}@${convertNaarSnakeCase(bedrijf.NAAM)}.com`;
            const gebruiker = await prisma.gEBRUIKER.upsert({
                where: {
                    EMAIL: email
                },
                update: {},
                create: createGebruikerObject(
                    email, `klant${i}_${convertNaarSnakeCase(bedrijf.NAAM)}`, `klant${i}_${convertNaarSnakeCase(bedrijf.NAAM)}`, 'wachtwoord', ROLLEN.klant
                )
            });
            const klant = await prisma.kLANT.upsert({
                where: {
                    ID: gebruiker.ID,
                },
                update: {},
                create: {
                    GEBRUIKER: {
                        connect: {
                            ID: gebruiker.ID
                        }
                    }
                }
            });
            await prisma.kLANT_B2BBEDRIJF.upsert({
                where: {
                    Klant_ID: klant.ID,
                },
                update: {},
                create: {
                    bedrijf_BEDRIJFID: bedrijf.BEDRIJFID,
                    Klant_ID: klant.ID
                }
            });
        }
    }
}

async function createLeverancierGebruikers() {
    const bedrijven = await prisma.b2BBEDRIJF.findMany();
    for (const bedrijf of bedrijven) {
        for (let i = 1; i <= 10; i++) {
            const email = `leverancier${i}@${convertNaarSnakeCase(bedrijf.NAAM)}.com`;
            const gebruiker = await prisma.gEBRUIKER.upsert({
                where: {
                    EMAIL: email
                },
                update: {},
                create: createGebruikerObject(
                    email, `leverancier${i}_${convertNaarSnakeCase(bedrijf.NAAM)}`, `leverancier${i}_${convertNaarSnakeCase(bedrijf.NAAM)}`, 'wachtwoord', ROLLEN.leverancier
                )
            });
            const leverancier = await prisma.lEVERANCIER.upsert({
                where: {
                    ID: gebruiker.ID,
                },
                update: {},
                create: {
                    GEBRUIKER: {
                        connect: {
                            ID: gebruiker.ID
                        }
                    }
                }
            });
            await prisma.lEVERANCIER_B2BBEDRIJF.upsert({
                where: {
                    Leverancier_ID: leverancier.ID
                },
                update: {},
                create: {
                    bedrijf_BEDRIJFID: bedrijf.BEDRIJFID,
                    Leverancier_ID: leverancier.ID
                }
            });
        }
    }
}


async function createBetalingsherinneringNotificaties() {
    // 1. verkrijg alle relaties van klant account en het bedrijf waartoe ze behoren
    const bestellingen = await prisma.bestelling.findMany({
        where: {
            NOT: {
                BETALING: {
                    some: {}
                }
            }
        },
        include: {
            B2BBEDRIJF_Bestelling_klantidToB2BBEDRIJF: {
                include: {
                    KLANT_B2BBEDRIJF: true
                }
            }
        }
    });

    const notificaties = [];

    for (const bestelling of bestellingen) {
        const klantGebruikers = bestelling.B2BBEDRIJF_Bestelling_klantidToB2BBEDRIJF.KLANT_B2BBEDRIJF;
        const datum = new Date(bestelling.BESTELLINGDATUM);
        datum.setDate(datum.getDate() + 10);
        const tekst = `Gelieve het bedrag van ${bestelling.BEDRAG} euro te betalen voor bestelling ${bestelling.UUIDVALUE}`;

        for (const gebruiker of klantGebruikers) {
            notificaties.push({
                notificatieSoort: 'Betalingsherinnering',
                datum,
                tekst,
                avatar: 'Apple, Inc..png',
                status: ['nieuw', 'ongelezen', 'gelezen'][Math.floor(Math.random() * 3)],
                gebruikerid: gebruiker.Klant_ID,
                bestellingid: bestelling.BESTELLINGID
            });
        }
    }

    await prisma.nOTIFICATIE.createMany({
        data: notificaties
    });
}



async function createOntvangenBetalingNotificatie() {
    // 1. verkrijg alle bestellingen
    const bestellingen = await prisma.bestelling.findMany({
        where: {
            BETALING: {
                some: {}
            }
        },
        include: {
            BETALING: true,
            B2BBEDRIJF_Bestelling_leverancieridToB2BBEDRIJF: {
                include: {
                    LEVERANCIER_B2BBEDRIJF: true
                }
            }
        }
    });

    // 2. notificatie + mockdata
    const notificaties = [];

    // 3. creeer een notificate voor elke betaling / bestelling bij elke leverancier account
    for (const bestelling of bestellingen) {
        const betaling = bestelling.BETALING[0];
        const datum = betaling.BETAALDATUM;
        const tekst = `Volledige betaling van ${betaling.TEBETALEN} euro werd ontvangen voor bestelling ${bestelling.UUIDVALUE}`;

        const leveranciers = bestelling.B2BBEDRIJF_Bestelling_leverancieridToB2BBEDRIJF.LEVERANCIER_B2BBEDRIJF;

        for (const leverancier of leveranciers) {
            const status = ['nieuw', 'ongelezen', 'gelezen'][Math.floor(Math.random() * 3)];
            notificaties.push({
                notificatieSoort: 'Ontvangen betaling',
                datum,
                tekst,
                status,
                avatar: 'Apple, Inc..png',
                bestellingid: bestelling.BESTELLINGID,
                gebruikerid: leverancier.Leverancier_ID,
            });
        }
    }

    // 4. push de notificaties
    await prisma.nOTIFICATIE.createMany({
        data: notificaties
    });
}

async function createProductInVoorraadNotificatie() {
    const ng = new SeedableNumberGenerator({
        a: 1,
        c: 1,
        min: 0,
        max: 2,
        seed: 25,
    });
    // 1. verkrijg alle bestellingen
    const bestellingen = await prisma.bestelling.findMany({
        where: {
            PRODUCTINBESTELLING: {
                some: {}
            }
        },
        include: {
            PRODUCTINBESTELLING: {
                include: {
                    PRODUCT: true
                }
            },
            B2BBEDRIJF_Bestelling_leverancieridToB2BBEDRIJF: {
                include: {
                    LEVERANCIER_B2BBEDRIJF: true
                }
            }
        }
    });

    // 2. notificatie + mockdata
    const notificaties = [];

    // 3. creeer een notificate voor elke betaling / bestelling bij elke leverancier account
    for (const bestelling of bestellingen) {
        const productenInBestelling = bestelling.PRODUCTINBESTELLING;
        const datum = new Date(bestelling.BESTELLINGDATUM);
        datum.setDate(datum.getDate() + 1);

        const leveranciers = bestelling.B2BBEDRIJF_Bestelling_leverancieridToB2BBEDRIJF.LEVERANCIER_B2BBEDRIJF;

        const isAllesInStock = productenInBestelling
            .reduce((pv, cv) => pv && cv.AANTAL <= cv.PRODUCT.AANTALINSTOCK, true);

        if (!isAllesInStock) continue;

        for (const leverancier of leveranciers) {
            const tekst = `Alle producten zijn voorradig voor bestelling ${bestelling.UUIDVALUE}`;
            const status = ['nieuw', 'ongelezen', 'gelezen'][ng.nextInt()];
            notificaties.push({
                notificatieSoort: 'Alle producten voorradig',
                datum,
                tekst,
                status,
                avatar: 'Apple, Inc..png',
                bestellingid: bestelling.BESTELLINGID,
                gebruikerid: leverancier.Leverancier_ID,
            });
        }
    }

    // 4. push de notificaties
    await prisma.nOTIFICATIE.createMany({
        data: notificaties
    });
}

async function main() {
    await createAdministrators();
    await createB2BBedrijven();
    await createProducten();
    await createBestellingen();
    await createBetalingen();
    await createKlantGebruikers();
    await createLeverancierGebruikers();
    await createBetalingsherinneringNotificaties();
    await createOntvangenBetalingNotificatie();
    await createProductInVoorraadNotificatie();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
