const { PrismaClient } = require('@prisma/client');

const ServiceError = require('../core/ServiceError');

const handleDBError = require('./_handleDBError');
const bestellingService = require('./bestelling');

const prisma = new PrismaClient();

//creëer een nieuwe betaling
async function create(bestellingId, rol, bedrijfId, { betaalbedrag}) {
    //Test of de bestelling bestaat
    let existingBestelling = await bestellingService.getById({id: bestellingId, role: rol, bedrijfId});

    if (!existingBestelling) {
        throw ServiceError.notFound(`Er bestaat geen bestelling met id: ${bestellingId}.`);
    }

    try {
        return await prisma.bETALING.create({
            data: {
                BETAALDATUM: new Date(),
                BETAALDEBEDRAG: betaalbedrag,
                ISGOEDGEKEURD: false,
                ISVERWERKT: false,
                TEBETALEN: existingBestelling.bedrag,
                KlantID: existingBestelling.klantid,
                BestellingID: existingBestelling.BESTELLINGID
            }
        });
    } catch(error) {
        throw handleDBError(error);
    }
}

module.exports = {create};