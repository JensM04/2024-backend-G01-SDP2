const { PrismaClient } = require('@prisma/client');

const ServiceError = require('../core/ServiceError');

const handleDBError = require('./_handleDBError');

const {checkAndParseSession} = require('./user.js');

const prisma = new PrismaClient();


const checkRole = (role, wantedRole) => {
    const hasPermission = role === wantedRole;
    if (!hasPermission)
        throw ServiceError.forbidden('You are not allowed to view this part of the application');
};

const makeExposedBedrijf = ({BEDRIJFID ,EMAIL, ISACTIEF, NAAM, SECTOR, TELEFOONNUMMER, UUIDVALUE, WEBSITEURL, BUS, GEMEENTE, HUISNUMMER, POSTCODE, STRAAT, BTWNr}) => ({
    id: BEDRIJFID,
    email: EMAIL,
    isActief: ISACTIEF,
    naam: NAAM,
    sector: SECTOR,
    telefoonnummer: TELEFOONNUMMER,
    uuid: UUIDVALUE,
    website: WEBSITEURL,
    adres: {
        bus: BUS,
        gemeente: GEMEENTE,
        huisnummer: HUISNUMMER,
        postcode: POSTCODE,
        straat: STRAAT
    },
    BTWNr: BTWNr,
});

async function getById(id) {
    try{
        const bedrijf = await prisma.b2BBEDRIJF.findUnique({
            where: {
                BEDRIJFID: id
            }
        });

        if (!bedrijf){
            throw ServiceError.notFound(`Er bestaat geen bedrijf met id: ${id}`);
        }
    
        return makeExposedBedrijf(bedrijf);
    }catch (error) {
        throw handleDBError(error);
    }
}



const updateById = async (id) => {
    try {
        const bedrijfToUpdate = await prisma.b2BBEDRIJFUPDATEREQUEST.findFirst({
            where: {
                BEDRIJFID: Number(id),
            },
        }); 

        if (!bedrijfToUpdate) {
            throw ServiceError.notFound(`Bedrijf with ID ${id} not found`);
        }

        const updatedBedrijf = await prisma.b2BBEDRIJF.update({
            where: {
                BEDRIJFID: Number(id),
            },
            data: {
                EMAIL: bedrijfToUpdate.EMAIL, 
                NAAM: bedrijfToUpdate.NAAM, 
                SECTOR: bedrijfToUpdate.SECTOR,
                TELEFOONNUMMER: bedrijfToUpdate.TELEFOONNUMMER,
                WEBSITEURL: bedrijfToUpdate.WEBSITEURL,
                GEMEENTE: bedrijfToUpdate.GEMEENTE,
                HUISNUMMER: bedrijfToUpdate.HUISNUMMER, 
                POSTCODE: bedrijfToUpdate.POSTCODE, 
                STRAAT: bedrijfToUpdate.STRAAT, 
                BTWNr: bedrijfToUpdate.BTWNr,
            },
        });

        return updatedBedrijf;
    } catch (error) {
        throw handleDBError(error);
    }
};




const aanvraagUpdate = async (auth, { BEDRIJFID, EMAIL, NAAM, SECTOR, TELEFOONNUMMER, WEBSITEURL, GEMEENTE, HUISNUMMER, POSTCODE, STRAAT, BTWNr }) => {
    HUISNUMMER = parseInt(HUISNUMMER);
    POSTCODE = parseInt(POSTCODE);

    const {bedrijfId} = await checkAndParseSession(auth);

    //Test of je wel voor je eigen bedrijf een update aanvraagt
    if (bedrijfId !== BEDRIJFID) {
        throw ServiceError.unauthorized("Voor dit bedrijf mag u geen update aanvragen");
    }

    try {
        await prisma.b2BBEDRIJFUPDATEREQUEST.deleteMany({
            where: {
                BEDRIJFID: BEDRIJFID
            }
        });

        const bedrijfUpdateAanvraag = await prisma.b2BBEDRIJFUPDATEREQUEST.create({
            data: {
                BEDRIJFID,
                EMAIL,
                NAAM,
                SECTOR,
                TELEFOONNUMMER,
                WEBSITEURL,
                GEMEENTE,
                HUISNUMMER,
                POSTCODE,
                STRAAT,
                BTWNr
            },
        });
        return bedrijfUpdateAanvraag;
    } catch (error) {
        throw handleDBError(error);
    }
};

  


module.exports = {getById, checkRole, updateById, aanvraagUpdate};

