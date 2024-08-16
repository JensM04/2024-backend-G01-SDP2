const { createServer } = require('http');

const { Server } = require('socket.io');

const { getLogger } = require('./core/logging');
const { getFirstKlantByBedrijfId } = require('./service');

let io;

function createWebSocketServer(app) {
    let connections = [];

    const httpServer = createServer(app.callback());

    io = new Server(httpServer, {cors: { origin: '*'}});

    io.on('connection', (socket) => {
        getLogger().info(`a user connected with id; ${socket.id}`);
        socket.on('new_connection', (data) => {
            if (data.userId && !connections.find(con => con.socketId == socket.id)){
                connections.push({socketId: socket.id, userId: data.userId, role: data.role});
            }
            console.log(connections);
        });

        socket.on('reconnect', () => {
            console.log('reconnecting...');
        });

        socket.on('disconnect', (reason) => {
            console.log('Client disconnected', socket.id, 'Reason:', reason);
            connections.splice(connections.findIndex(con => con.socketId == socket.id), 1);
        });

        socket.on('notification_sent', async (data) => {
            const klantId = await getFirstKlantByBedrijfId(data.klantId);
            const leverancierConnection = connections.find(con => Number(con.userId) == data.leverancierId);
            const klantConnection = connections.find(con => Number(con.userId) == klantId);
            if (leverancierConnection) {
                io.volatile.to(leverancierConnection.socketId).emit('notification_popup', { message: 'sent'}); 
            }
            if (klantConnection){
                io.volatile.to(klantConnection.socketId).emit('notification_popup', { message: 'recieved'});
            }
        });
    });

    httpServer.listen(3000);
    getLogger().info('Socket.io server listening on 3000');
}

const closeIo = () => {
    if (io !== undefined) {
        io.close();
    }

};
 
module.exports = {
    createWebSocketServer,
    closeIo,
};