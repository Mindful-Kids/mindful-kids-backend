const { EventEnum } = require("../constants");
const jwt = require("jsonwebtoken");

const initializeSocketIO = (io) => {
    return io.on("connection", async (socket) => {
        try {
            const token = socket.handshake.query.token;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const user = decodedToken.id;
            socket.user = user;

            // Add user in room
            socket.join(user.toString());
            socket.emit(EventEnum.CONNECTED_EVENT);
            console.log("User Connected");

            // Listen event from vr headset for environment permission
            socket.on(EventEnum.DEMAND_ENVIRONMENT_PERMISSION, (room) => {
                socket.to(room).emit(EventEnum.DEMAND_ENVIRONMENT_PERMISSION, "Demand environment position");
            });

            // Listen event from webite or app after environment permission given
            socket.on(EventEnum.GIVE_ENVIRONMENT_PERMISSION, (room) => {
                socket.to(room).emit(EventEnum.GIVE_ENVIRONMENT_PERMISSION, "Give environment position");
            });


            socket.on(EventEnum.DISCONNECT_EVENT, () => {
                console.log("Disconnected");
                if (socket.user) {
                    socket.leave(user);
                }
            });
        } catch (error) {
            console.log(error);
            socket.emit(
                EventEnum.SOCKET_ERROR_EVENT,
                error?.message || "Something went wrong while connecting to the socket."
            );
        }
    });
};

const emitSocketEvent = (io, roomId, event, socketId) => {
    io.to(roomId).except(socketId).emit(event);
};
module.exports = {
    initializeSocketIO,
    emitSocketEvent,
}