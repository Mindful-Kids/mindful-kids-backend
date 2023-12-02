const EventEnum = Object.freeze({
    // When user connects
    CONNECTED_EVENT: "connected",
    // When user disconnects
    DISCONNECT_EVENT: "disconnect",
    // when error occurs in sockey
    SOCKET_ERROR_EVENT: "socketError",
});

module.exports = {
    EventEnum
};