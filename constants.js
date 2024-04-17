const EventEnum = Object.freeze({
  // When user connects
  CONNECTED_EVENT: "connected",
  // When user reconnects
  RECONNECT_EVENT: "reconnect",
  // When user disconnects
  DISCONNECT_EVENT: "disconnect",
  // when error occurs in sockey
  SOCKET_ERROR_EVENT: "socketError",
  // when vr demand for enviroment permission
  DEMAND_ENVIRONMENT_PERMISSION: "demandPermission",
  // when website pr mobile give permission
  GIVE_ENVIRONMENT_PERMISSION: "givePermission",

  STOP_ENVIRONMENT_PERMISSION: "stopPermission",

  GET_SCORE: "getScore",

  CHECK_EVENT: "check",
});

module.exports = {
  EventEnum,
};
