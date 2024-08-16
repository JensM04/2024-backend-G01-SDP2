const { PrismaClient } = require('@prisma/client');

const { getLogger } = require('../core/logging');

const prisma = new PrismaClient();


async function initializeData() {
    const logger = getLogger();
    logger.info('Initializing connection to the database');
    prisma.$connect();

    // Check the connection
    try {
        await prisma.$executeRaw`SELECT 1+1 AS result`;
    } catch (error) {
        logger.error(error.message, {error});
        throw new Error('Could not initialize the data layer');
    }

    logger.info('Succesfully connected to the database');
}

async function shutdownData() {
    getLogger().info('shutting down database connection');
    prisma.$disconnect();
    getLogger().info('shutting down database connection');
}


module.exports = {initializeData, shutdownData };