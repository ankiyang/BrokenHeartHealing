let net = require('net');
let client = net.Socket();

let Log = function(msg) {
    console.log(msg);
};

let msgs = [
    'Anki: Hello, Im Anki',
    'Anki: How are you recently?',
    'Anki: Hhaha, Can I add your facebook ?',
    'Anki: Thank you',
];

// send message
let sendMsg = function () {
    if (sendIndex < msgs.length) {
        Log(msgs[sendIndex]);
        client.write(msgs[sendIndex]);
        sendIndex += 1;
    } else {
        // client.end();
    }
};

let sendIndex = 0;

// connect TCP Server
client.connect('8888', '127.0.0.1', function() {
    Log('have connected to server');
    sendMsg();
});

// receive message from Server
client.on('data', function (data) {
    Log(data.toString());
    setTimeout(() => {
        sendMsg();
    }, 1000);
});