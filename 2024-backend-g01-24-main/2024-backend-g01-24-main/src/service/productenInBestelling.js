const { PrismaClient } = require('@prisma/client');

const ServiceError = require('../core/ServiceError');

const handleDBError = require('./_handleDBError'); 
const prisma = new PrismaClient();

//producten ophalen die bij een bestelling horen via bestellingID
const getProductenByBestellingId = async (bedrijfId, bestellingId) => {
    bestellingId = bestellingId.toLowerCase();

    const bestelling = await prisma.bestelling.findFirst({
        where: {
            UUIDVALUE: {
                contains: bestellingId
            },
        },
    });

    if(bestelling.klantid !== bedrijfId && bestelling.leverancierid !== bedrijfId){
        throw ServiceError.forbidden('You are not allowed to view this user\'s information');
    }

    try{
        const producten = await prisma.pRODUCTINBESTELLING.findMany({
            where: {
                B2BBESTELLING_BESTELLINGID: (await prisma.bestelling.findFirst({
                    where: {
                        UUIDVALUE: {contains: bestellingId}
                    }
                })).BESTELLINGID,
            }
        });

        // Convert BigInt ID to Integer
        const convertedProducten = await Promise.all(producten.map(async (product) => {
            const additionalProductInfo = await prisma.pRODUCT.findUnique({
                where: {
                    ID: product.PRODUCTID
                },
                select: {
                    AANTALINSTOCK: true,
                    EENHEIDSPRIJS: true,
                    NAAM: true
                }
            });

            //alle data samen vormen, uit tabellen producten en producteninbestelling (voor aantalinstock en eenheidsprijs te verkrijgen)
            return {
                ...product,
                ID: Number(product.ID),
                AANTALINSTOCK: additionalProductInfo.AANTALINSTOCK,
                EENHEIDSPRIJS: additionalProductInfo.EENHEIDSPRIJS,
                NAAM: additionalProductInfo.NAAM
            };
        }));

        return convertedProducten;
    }catch (error) {
        throw handleDBError(error);
    }
};


module.exports = {
    getProductenByBestellingId,
};

