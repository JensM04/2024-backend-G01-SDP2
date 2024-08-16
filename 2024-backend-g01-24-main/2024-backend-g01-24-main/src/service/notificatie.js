const {
    PrismaClient
} = require('@prisma/client');

const getEntiteitFactory = require('../data/entiteitFactory');
const ServiceError = require('../core/ServiceError');
const notificatieEnum = require('../enumConverter').notifSoortEnum;
const { convertToStringNotifSoort } = require('../enumConverter');
const { notificatieTekst } = require('../notificatieTekst');

const handleDBError = require('./_handleDBError');
 
const { getFirstKlantByBedrijfId } = require('.');
const prisma = new PrismaClient();


const createNotificatie = async (bestellingId, klantId, leverancierId) => {
    try {
        const leverancier = await prisma.b2BBEDRIJF.findUnique({
            where: {
                BEDRIJFID: leverancierId,
            },
        });

        const klantid = await getFirstKlantByBedrijfId(klantId);

        const newNotif = await prisma.nOTIFICATIE.create({
            data: {
                avatar: leverancier.NAAM,
                bestellingid: bestellingId,
                notificatieSoort: 'Betalingsherinnering',
                tekst: notificatieTekst('Betalingsherinnering', bestellingId),
                gebruikerid: klantid,
                datum: new Date(),
                status: 'nieuw',
            }
        });
        return newNotif;
    } catch (error) {
        throw handleDBError(error);
    }
};

const getAll = async ({gebruikerId, pagina, rijen, notificatieSoort, content, bestelling, vanDatum, totDatum}) => {
    const filters = {
        notificatieSoort: notificatieEnum,
    };
    const notificaties = await prisma.nOTIFICATIE.findMany({
        where: {
            gebruikerid: gebruikerId,
            notificatieSoort: notificatieSoort != null ? convertToStringNotifSoort(notificatieSoort) : undefined,
            tekst: content != null ? {contains: String(content)} : undefined,
            bestellingid: bestelling != null ? bestelling : undefined,
            datum: {
                gte: vanDatum != null ? new Date(vanDatum) : undefined,
                lte: totDatum != null ? new Date(totDatum) : undefined,
            },
        },
        orderBy: {
            datum: 'desc',
        },
        skip: pagina * rijen,
        take: rijen,
    });

    await getEntiteitFactory().notificatie.updateMany({
        where: {
            gebruikerid: gebruikerId,
            status: 'nieuw'
        },
        data: {
            status: 'ongelezen'
        }
    });

    const aantalNotifs = await prisma.nOTIFICATIE.count({
        where: {
            gebruikerid: gebruikerId,
            notificatieSoort: notificatieSoort != null ? convertToStringNotifSoort(notificatieSoort) : undefined,
            tekst: content != null ? {contains: String(content)} : undefined,
            bestellingid: bestelling != null ? bestelling : undefined,
            datum: {
                gte: vanDatum != null ? new Date(vanDatum) : undefined,
                lte: totDatum != null ? new Date(totDatum) : undefined,
            },
        },
    });
    
    const aantalPaginas = Math.ceil(aantalNotifs / rijen);

    return {
        items: notificaties.map(notificatie => {
            return {
                id: notificatie.id,
                datum: notificatie.datum,
                notificatieSoort: notificatie.notificatieSoort,
                status: notificatie.status,
                bestellingid: notificatie.bestellingid,
                tekst: notificatie.tekst,
                avatar: notificatie.avatar,
            };
        }),
        filters,
        huidigePagina: pagina,
        aantalRijen: aantalNotifs,
        aantalPaginas: aantalPaginas,
    };
};

const getRecenteNotificaties = async ({
    gebruiker
}) => {
    const notificaties = await getEntiteitFactory().notificatie.findMany({
        where: {
            gebruikerid: gebruiker.userId,
            status: 'ongelezen' || 'nieuw'
        },
        orderBy: {
            datum: 'desc',
        },
        take: 5,
    });

    return {
        items: notificaties.map(notificatie => {
            return {
                id: notificatie.id,
                datum: notificatie.datum,
                notificatieSoort: notificatie.notificatieSoort,
                status: notificatie.status,
                bestellingid: notificatie.bestellingid,
                tekst: notificatie.tekst,
                avatar: notificatie.avatar
            };
        }),
        count: notificaties.length
    };
};

const getById = async (id, gebruikerid) => {
    try {
        const notificatie = await prisma.nOTIFICATIE.findUnique({
            where: {
                id: id,
                gebruikerid: gebruikerid
            }
        });
        if (!notificatie){
            throw ServiceError.notFound(`Er bestaat geen notificatie met id: ${id}`);
        }

        await prisma.nOTIFICATIE.update({
            where: {
                id: notificatie.id,
            },
            data: {
                status: 'gelezen',
            }
        });

        const bestellingUuid = await getBestellingUuid(notificatie.bestellingid);
        return {...notificatie, bestellingUuid: bestellingUuid};
    } catch(error) {
        throw handleDBError(error);
    }
};

const updateById = async (id, {gebruikerid, status}) => {

    let bestaandeNotificatie = await getById(id,gebruikerid );
  
    if (!bestaandeNotificatie) {
        throw ServiceError.notFound(`Er is geen notificatie met id: ${id}.`);
    }
    
    try {
        const updatedNotificatie = await prisma.nOTIFICATIE.update({
            where: {
                id: id,
            },
            data: {
                status: status
            },
        });
        return getById(updatedNotificatie.id, updatedNotificatie.gebruikerid);
    } catch(error) {
        throw handleDBError(error);
    }
}; 

const getLaatsteNotificatieByBestellingId = async(bestellingId) =>{
    try {
        const linkedBestelling = await prisma.bestelling.findFirst({
            where: {
                UUIDVALUE: bestellingId
            }
        });
        const notificaties = await prisma.nOTIFICATIE.findFirst({
            where: {
                bestellingid: linkedBestelling.BESTELLINGID,
                notificatieSoort: 'Betalingsherinnering',
            }
        });
        if (!notificaties){
            throw ServiceError.notFound(`Er bestaat geen notificatie met bestellingid: ${bestellingId}`);
        }
        return notificaties;
    } catch(error) {
        throw handleDBError(error);
    }
};

const getBestellingUuid = async(bestellingId) => {
    const bestelling = await prisma.bestelling.findUnique({
        where: {
            BESTELLINGID: bestellingId
        }
    });

    return bestelling.UUIDVALUE;
};

const setNotificatiesOngelezen = async(userId) => {
    const notificaties = prisma.nOTIFICATIE.updateMany({
        where: {
            gebruikerid: userId,
            status: 'nieuw'
        },
        data: {
            status: 'ongelezen'
        }
    }); 
    return notificaties;
};

module.exports = {
    getAll,
    getRecenteNotificaties,
    createNotificatie,
    getById,
    updateById,
    getLaatsteNotificatieByBestellingId,
    setNotificatiesOngelezen
};