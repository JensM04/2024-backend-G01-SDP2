const createServer = require('./createServer');

async function onClose(server){
    await server.stop();
    process.exit(0);
}
async function main() {
    try {
        const server = await createServer();

        await server.start();


        process.on('SIGTERM', onClose);
        process.on('SIGQUIT', onClose);

    }
    catch(error) {
        console.log(error);
        process.exit(-1);
    }
}

main();