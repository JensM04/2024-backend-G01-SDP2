const { PrismaClient } = require('@prisma/client');

const handleDBError = require('./_handleDBError');

const prisma = new PrismaClient();

const getFirstKlantByBedrijfId = async (bedrijfId) => {
    try {
        const klant = await prisma.gEBRUIKER.findFirst({
            where: {
                KLANT_B2BBEDRIJF: {
                    some: {
                        bedrijf_BEDRIJFID: bedrijfId,
                    }
                }
            }
        });
        return klant.ID;
    } catch (error) {
        throw handleDBError(error);
    }
};

module.exports = { getFirstKlantByBedrijfId };