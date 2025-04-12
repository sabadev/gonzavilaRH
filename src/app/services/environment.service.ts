

export const environment = {
  apiUrl: configserve.serverIp ? `http://${config.serverIp}:${config.serverPort}/api` : '/api'
};
