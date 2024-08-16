const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async () => {
    try {
        await prisma.aDMINISTRATOR.deleteMany({});
        await prisma.bETALING.deleteMany({});
        await prisma.bestelling.deleteMany({});
        await prisma.kLANT.deleteMany({});
        await prisma.kLANT_B2BBEDRIJF.deleteMany({});
        await prisma.lEVERANCIER.deleteMany({});
        await prisma.lEVERANCIER_B2BBEDRIJF.deleteMany({});
        await prisma.pRODUCT.deleteMany({});
        await prisma.pRODUCTINBESTELLING.deleteMany({});
        await prisma.gEBRUIKER.deleteMany({});
        await prisma.b2BBEDRIJF.deleteMany({});
    } catch (error) {
        console.error(error);
    }
};
