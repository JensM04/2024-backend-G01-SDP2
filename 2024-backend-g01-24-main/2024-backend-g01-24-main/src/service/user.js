const { PrismaClient } = require('@prisma/client');

const { getLogger } = require('../core/logging');
const ServiceError = require('../core/ServiceError');
const { verifyPassword, hashPassword } = require('../core/password');
const { generateJWT , verifyJWT} = require('../core/jwt');

const handleDBError = require('./_handleDBError');


const prisma = new PrismaClient();

const checkAndParseSession = async(authHeader) => {
    if (!authHeader)
        throw ServiceError.unauthorized('You need to be signed in');

    if (!authHeader.startsWith('Bearer'))
        throw ServiceError.unauthorized('Invalid authentication token');

    const authToken = authHeader.substring(7);

    try {
        const {userId, role, bedrijfId} = await verifyJWT(authToken);
        return {userId, role, authToken, bedrijfId};
    } catch(error) {
        getLogger().error(error.message, {error});
        throw new Error(error.message);
    }
};

const checkRole = (role, wantedRole) => {
    const hasPermission = role === wantedRole;
    if (!hasPermission)
        throw ServiceError.forbidden('You are not allowed to view this part of the application');
};

const makeExposedUser = ({ID ,EMAIL, DTYPE, GEBRUIKERSNAAM, ISWACHTWOORDVERANDERD, ROL, SALT, WACHTWOORD_HASH, BEDRIJFID}) => ({
    ID,
    EMAIL,
    DTYPE,
    GEBRUIKERSNAAM,
    ISWACHTWOORDVERANDERD,
    ROL,
    SALT,
    WACHTWOORD_HASH,
    BEDRIJFID
});

async function makeLoginData(user, bedrijfId) {
    getLogger().info('user + bedrijfid' + bedrijfId);
    const token = await generateJWT(user, bedrijfId);
    return {
        token,
        user: makeExposedUser({...user, BEDRIJFID: bedrijfId})
    };
}

async function getById(id) {
    try{
        const user = await prisma.gEBRUIKER.findUnique({
            where: {
                ID: id
            }
        });

        if (!user){
            throw ServiceError.notFound(`A user with id: ${id}, does not exist`);
        }
    
        return makeExposedUser(user);
    }catch (error) {
        throw handleDBError(error);
    }
}

async function getAll() {
    return await prisma.gEBRUIKER.findMany();
}

async function findByGebruikersnaam(naam) {
    try{
        const user = await prisma.gEBRUIKER.findUnique({
            where : {
                GEBRUIKERSNAAM: naam
            }
        });
        return user;
    }catch (error) {
        throw handleDBError(error);
    }
}

async function findByEmail(email) {
    try{
        const user = await prisma.gEBRUIKER.findUnique({
            where : {
                EMAIL: email
            }
        });
        return user;
    }catch (error) {
        throw handleDBError(error);
    }
}

async function login(identificatie, password) {

    try{
        let user = null;
        identificatie.includes('@')? user = await findByEmail(identificatie):user = await findByGebruikersnaam(identificatie);

        if (!user) {
            throw ServiceError.notFound(`The given user does not exist: ${identificatie}`);
        }
        let bedrijfId = null;

        if (user.DTYPE === 'Klant') {
            bedrijfId = await prisma.kLANT_B2BBEDRIJF.findUnique({
                where: {
                    Klant_ID: user.ID
                }
            });
        } else if (user.DTYPE === 'Leverancier') {
            bedrijfId = await prisma.lEVERANCIER_B2BBEDRIJF.findUnique({
                where: {
                    Leverancier_ID: user.ID
                }
            });
        }
        const passwordValid = await verifyPassword(password, user.SALT, user.WACHTWOORD_HASH);

        if (!passwordValid) {
            // DO NOT expose we know the user but an invalid password was given
            throw ServiceError.unauthorized(
                `The given username and password do not match ${password} ${user.WACHTWOORD_HASH}`
            );
        }
        return await makeLoginData(user, bedrijfId.bedrijf_BEDRIJFID);
    }catch (error) {
        throw handleDBError(error);
    }
}

async function updateById(id,{ gebruikersnaam, email, wachtwoord}) {
    let existingUser = await getById(id);

    if (!existingUser) {
        throw ServiceError.notFound(`Er bestaat geen gebruiker met id ${id}.`);
    }

    try {
        const hash = hashPassword(wachtwoord, existingUser.SALT);
        const updatedUser = await prisma.gEBRUIKER.update({
            where: {
                ID: id,
            },
            data: {
                GEBRUIKERSNAAM: gebruikersnaam,
                EMAIL: email,
                WACHTWOORD_HASH: hash,
                ISWACHTWOORDVERANDERD: true
            },
        });
        return getById(updatedUser.ID);
    } catch(error) {
        throw handleDBError(error);
    }
}


module.exports = {getById, getAll, login, checkAndParseSession, checkRole, updateById};