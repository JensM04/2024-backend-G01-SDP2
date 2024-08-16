const {
    PrismaClient
} = require('@prisma/client');

const {
    bestellingEnum,
    betalingEnum
} = require('../enumConverter');
const getEntiteitFactory = require('../data/entiteitFactory');
const ServiceError = require('../core/ServiceError');
const {
    convertToValueBestelling,
    convertToValueBetaling,
    convertToEnumBestelling,
    convertToEnumBetaling
} = require('../enumConverter');
const {
    getLogger
} = require('../core/logging');



const prisma = new PrismaClient();

const transformBestelling = (bestelling) => {
    return {
        id: bestelling.UUIDVALUE,
        datum: bestelling.BESTELLINGDATUM,
        bedrag: Number(bestelling.BEDRAG).toFixed(2),
        bestellingstatus: convertToValueBestelling(bestelling.BESTELLINGSTATUS)?.toUpperCase(),
        betaalstatus: convertToValueBetaling(bestelling.BETAALSTATUS)?.toUpperCase(),
    };
};
// http://localhost:5173/bestellingen?pagina=0&rijen=10&id=123&datum=02%2F02%2F2020&bedrag=1.00&bestellingstatus=verwerkt&betaalstatus=betaald
const getAll = async ({
    pagina,
    rijen,
    role,
    bedrijfId,
    id,
    vanDatum,
    totDatum,
    bedrag,
    bestellingstatus,
    betaalstatus,
    zoek,
    orderByVar,
    order,
}) => {
    const filters = {
        bestellingstatus: bestellingEnum,
        betaalstatus: betalingEnum
    };

    if(!role || !bedrijfId) {
        throw ServiceError.unauthorized('Rol of bedrijfId mist');
    }

    const zoekQueryLogica = zoek ? {
        OR: [
            {
                UUIDVALUE: {
                    contains: zoek.toString()
                }
            },
            {
                BEDRAG: {
                    equals: !isNaN(zoek) ? zoek : undefined
                }
            },
            {
                BESTELLINGSTATUS: {
                    equals: convertToEnumBestelling(zoek.toString())
                }
            },
            {
                BETAALSTATUS: {
                    equals: convertToEnumBetaling(zoek.toString())
                }
            },
        ]
    } : {};

    const filterQueryLogica = {
        UUIDVALUE: {
            contains: id ? id.toString().toLowerCase() : undefined
        },
        BEDRAG: !isNaN(bedrag) ? {
            equals: bedrag
        } : undefined,
        BESTELLINGSTATUS: !isNaN(bestellingstatus) ? {
            equals: bestellingstatus
        } : undefined,
        BETAALSTATUS: !isNaN(betaalstatus) ? {
            equals: betaalstatus
        } : undefined,
        BESTELLINGDATUM: vanDatum || totDatum ? {
            gte: vanDatum ? new Date(vanDatum) : undefined,
            lte: totDatum ? new Date(totDatum) : undefined
        } : undefined,
        klantid: role === 'Klant' ? bedrijfId : undefined,
        leverancierid: role === 'Leverancier' ? bedrijfId : undefined,
    };

    const where = {
        AND: [
            zoekQueryLogica,
            filterQueryLogica,
        ] 
    };

    let prismaKolom = undefined;

    switch(orderByVar) {
    case 'bedrag':
        prismaKolom = 'BEDRAG';
        break;
    case 'datum':
        prismaKolom = 'BESTELLINGDATUM';
        break;
    case 'bestellingstatus':
        prismaKolom = 'BESTELLINGSTATUS';
        break;
    case 'betaalstatus':
        prismaKolom = 'BETAALSTATUS';
        break;
    case 'id':
        prismaKolom = 'UUIDVALUE';
        break;
    }

    let orderBy = {
        BESTELLINGDATUM: 'desc'
    };

    if(prismaKolom) {
        orderBy = {};
        orderBy[prismaKolom] = order ? order : 'asc';
    }

    getLogger().info('orderby: ' + JSON.stringify(orderBy));
    getLogger().info('orderbyvar: ' + orderByVar);

    const bestellingen = await getEntiteitFactory().bestelling.findMany({
        orderBy,
        skip: pagina * rijen,
        take: rijen,
        where    
    });

    const aantalBestellingen = await getEntiteitFactory().bestelling.count({
        where: {
            ...where
        }
    });

    const aantalPaginas = Math.ceil(aantalBestellingen / rijen);

    return {
        items: bestellingen.map(transformBestelling),
        huidigePagina: pagina,
        aantalRijen: aantalBestellingen,
        aantalPaginas: aantalPaginas,
        filters
    };
};

const getById = async ({
    id, role, bedrijfId
}) => {
    id = id.toLowerCase();

    if(!bedrijfId) {
        throw ServiceError.unauthorized('Er is geen bedrijfId aanwezig');
    }

    const bestelling = await prisma.bestelling.findFirst({
        where: {
            UUIDVALUE: {
                contains: id
            },
            klantid: role === 'Klant' ? bedrijfId : undefined,
            leverancierid: role === 'Leverancier' ? bedrijfId : undefined
        },
    });

    if (!bestelling) {
        throw ServiceError.notFound(`Bestelling met id ${id} niet gevonden`, {
            id
        });
    }

    return {...transformBestelling(bestelling), klantid: bestelling.klantid, leverancierid: bestelling.leverancierid, oudId: bestelling.BESTELLINGID, STRAAT: bestelling.STRAAT, HUISNUMMER: bestelling.HUISNUMMER, POSTCODE: bestelling.POSTCODE, GEMEENTE: bestelling.GEMEENTE};
};

module.exports = {
    getAll,
    getById,
};