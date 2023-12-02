const { EventEnum } = require("../constants");
const jwt = require("jsonwebtoken");

const initializeSocketIO = (io) => {
    return io.on("connection", async (socket) => {
        try {

            const token = socket.handshake.query.token;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const user = decodedToken.id;
            socket.user = user;

            socket.join(user.toString());
            socket.emit(EventEnum.CONNECTED_EVENT);
            console.log("User Connected");

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

const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
};
module.exports = {
    initializeSocketIO,
    emitSocketEvent,
}