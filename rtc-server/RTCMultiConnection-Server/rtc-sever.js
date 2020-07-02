const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');

ioServer(httpApp).on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket, {
        config: {
            "socketURL": "/",
            "dirPath": "",
            "homePage": "/demos/index.html",
            "socketMessageEvent": "RTCMultiConnection-Message",
            "socketCustomEvent": "RTCMultiConnection-Custom-Message",
            "port": "9001",
            "enableLogs": "false",
            "autoRebootServerOnFailure": "false",
            "isUseHTTPs": "false",
            "sslKey": "./fake-keys/privatekey.pem",
            "sslCert": "./fake-keys/certificate.pem",
            "sslCabundle": "",
            "enableAdmin": "false",
            "adminUserName": "username",
            "adminPassword": "password"
        },
        logs: 'logs.json'
    });
});