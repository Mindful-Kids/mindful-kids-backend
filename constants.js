const EventEnum = Object.freeze({
    // When user connects
    CONNECTED_EVENT: "connected",
    // When user disconnects
    DISCONNECT_EVENT: "disconnect",
    // when error occurs in sockey
    SOCKET_ERROR_EVENT: "socketError",
    // when vr demand for enviroment permission
    DEMAND_ENVIRONMENT_PERMISSION: "demandPermission",
    // when website pr mobile give permission
    GIVE_ENVIRONMENT_PERMISSION: "givePermission",

    STOP_ENVIRONMENT_PERMISSION: "stopPermission",
});

module.exports = {
    EventEnum
};