const {
    PrismaClient
} = require('@prisma/client');

let prisma = null;

function getEntiteitFactory() {
    if (null == prisma) {
        prisma = new PrismaClient();
    }

    return {
        notificatie: prisma.nOTIFICATIE,
        bestelling: prisma.bestelling,
        gebruiker: prisma.gEBRUIKER,
        administrator: prisma.aDMINISTRATOR,
        b2bbedrijf: prisma.b2BBEDRIJF,
        betaling: prisma.bETALING,
        klant: prisma.kLANT,
        klantB2bbedrijf: prisma.kLANT_B2BBEDRIJF,
        leverancier: prisma.lEVERANCIER,
        leverancierB2bbedrijf: prisma.lEVERANCIER_B2BBEDRIJF,
        product: prisma.pRODUCT,
        productinbestelling: prisma.pRODUCTINBESTELLING,
        prisma: prisma
    };
}

module.exports = getEntiteitFactory;