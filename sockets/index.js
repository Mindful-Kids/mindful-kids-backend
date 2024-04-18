const { EventEnum } = require("../constants");
const jwt = require("jsonwebtoken");

const { storeScore } = require("../controllers/caretaker_controllers");

const vrHeadsets = new Map();

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.query.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = decodedToken.id;
      socket.user = user;

      // Add user in room
      socket.join(`user_${user}`);

      const socketIdFromHeaders = socket.handshake.headers["socket-id"];
      if (socketIdFromHeaders) {
        socket.id = socketIdFromHeaders;
        console.log("reconnected ", socket.id);
        io.to(socketIdFromHeaders).emit(EventEnum.RECONNECT_EVENT);
      } else {
        // If no stored socket ID, then emit new socket id
        console.log("connected ", socket.id);
        socket.emit(EventEnum.CONNECTED_EVENT);
      }

      // Listen event from vr headset for environment permission
      socket.on(EventEnum.DEMAND_ENVIRONMENT_PERMISSION, (user) => {
        const userRoom = `user_${user.parentID}`;
        vrHeadsets.set(userRoom, socket.id);
        socket
          .to(userRoom)
          .emit(
            EventEnum.DEMAND_ENVIRONMENT_PERMISSION,
            "Demand environment position"
          );
      });

      // Listen event from webite or app after environment permission given
      socket.on(EventEnum.GIVE_ENVIRONMENT_PERMISSION, (payload) => {
        const userRoom = `user_${payload.data.room}`;
        const child = payload.data.childId;
        const environment = payload.data.environmentId;
        // redis.set(child, environment);
        const vrHeadsetSocketId = vrHeadsets.get(userRoom);
        console.log(vrHeadsetSocketId);
        if (vrHeadsetSocketId) {
          io.to(vrHeadsetSocketId).emit(
            EventEnum.GIVE_ENVIRONMENT_PERMISSION,
            payload
          );
        }
      });

      socket.on(EventEnum.STOP_ENVIRONMENT_PERMISSION, (room) => {
        const userRoom = `user_${room.data}`;
        const vrHeadsetSocketId = vrHeadsets.get(userRoom);
        if (vrHeadsetSocketId) {
          io.to(vrHeadsetSocketId).emit(
            EventEnum.STOP_ENVIRONMENT_PERMISSION,
            room.data
          );
        }
      });

      // Listen event from vr headset and send it to mobile app or website

      socket.on(EventEnum.GET_SCORE, (storeData) => {
        storeScore(storeData);

        // socket.to(userRoom).emit(EventEnum.GET_SCORE, score);
      });

      socket.on(EventEnum.DISCONNECT_EVENT, () => {
        console.log("Disconnected");
        if (socket.user) {
          const userRoom = `user_${socket.user}`;
          socket.leave(userRoom);
        }
      });
    } catch (error) {
      console.log(error);
      socket.emit(
        EventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
    // redis disconnection fixed
    io.on("error", function (error) {
      console.error(error);
    });
  });
};

const emitSocketEvent = (io, roomId, event, socketId) => {
  io.to(roomId).except(socketId).emit(event);
};
module.exports = {
  initializeSocketIO,
  emitSocketEvent,
};
