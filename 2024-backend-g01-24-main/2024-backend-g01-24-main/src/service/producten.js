const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const handleDBError = require('./_handleDBError'); 

const makeExposedProduct = ({ID, NAAM, AANTALINSTOCK, EENHEIDSPRIJS}) => ({
    id: ID,
    naam: NAAM,
    aantalInStock: AANTALINSTOCK,
    eenheidsprijs: EENHEIDSPRIJS
});

const getAllProducten = async ({
    pagina, rijen, zoek
}) => {
    const zoekQueryLogica = {
        NAAM: {
            contains: zoek?.toString() || undefined
        }
    };

    try{
        const skip = pagina * rijen;
        const producten = await prisma.pRODUCT.findMany({
            skip,
            take: parseInt(rijen),
            where: zoekQueryLogica
        });

        const aantalProducten = await prisma.pRODUCT.count({
            where: zoekQueryLogica
        });
        const aantalPaginas = Math.ceil(aantalProducten / rijen);
        const formattedProducten = producten.map((product => makeExposedProduct(product)));
        return {
            items: formattedProducten,
            count: aantalProducten,
            aantalPaginas
        };
        
    }catch (error) {
        throw handleDBError(error);
    }
};

module.exports = {
    getAllProducten,
};
