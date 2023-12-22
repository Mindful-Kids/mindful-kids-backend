const { EventEnum } = require("../constants");
const jwt = require("jsonwebtoken");

const vrHeadsets = new Map();


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
            console.log(`User ${user} Connected ${socket.id}`);



            // Listen event from vr headset for environment permission
            socket.on(EventEnum.DEMAND_ENVIRONMENT_PERMISSION, (room) => {

                console.log("hello");
                vrHeadsets.set(room, socket.id);
                socket.to(room).emit(EventEnum.DEMAND_ENVIRONMENT_PERMISSION, "Demand environment position");
            });

            // Listen event from webite or app after environment permission given
            socket.on(EventEnum.GIVE_ENVIRONMENT_PERMISSION, (room) => {
                console.log("give permission");
                const vrHeadsetSocketId = vrHeadsets.get(room);
                console.log(vrHeadsetSocketId);
                if (vrHeadsetSocketId) {
                    console.log("emit to headset");
                    io.to(vrHeadsetSocketId).emit(EventEnum.GIVE_ENVIRONMENT_PERMISSION, "Give environment position");
                }
                // socket.to(room).emit(EventEnum.GIVE_ENVIRONMENT_PERMISSION, "Give environment position");
            });


            socket.on(EventEnum.STOP_ENVIRONMENT_PERMISSION, (room) => {
                const vrHeadsetSocketId = vrHeadsets.get(room);
                if (vrHeadsetSocketId) {
                    io.to(vrHeadsetSocketId).emit(EventEnum.STOP_ENVIRONMENT_PERMISSION, "Stop environment position");
                }
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