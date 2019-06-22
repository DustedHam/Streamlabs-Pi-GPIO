const fetch = require('node-fetch');
const io = require('socket.io-client');

const authentication = require('./models/authentication');

const STREAMLABS_API_BASE = 'https://www.streamlabs.com/api/v1.0'

async function getSocketToken(accessToken) {
    const result = await fetch(`${STREAMLABS_API_BASE}/socket/token?access_token=${accessToken}`);
    const data = await result.json();

    return data.socket_token;
}

async function connect() {

    const data = await authentication.get();
    const socketToken = await getSocketToken(data.accessToken);

    return new Promise(function (resolve, reject) {
        const socket = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'] });

        socket.once('connect', function () {
            resolve(socket);
        });

        socket.once('connect_error', function () {
            reject('connect_error');
        });

        socket.once('connect_timeout', function () {
            reject('connect_timeout');
        });
    });
}

module.exports = {
    connect
}