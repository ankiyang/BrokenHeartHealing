let net = require('net');

//create tcp server
let server = new net.Server();

const port = 8888;

let Log = function(msg) {
    console.log(msg);
};

// message
let serverMsgs = [
    'Am: Hi, Nice to meet you!',
    'Am: Good . :)',
    'Am: Sure~~~~',
    'Am: (Silence...)'
];

// send messages to client in order
let sendMsg = function(socket) {
    if (sendIndex <serverMsgs.length) {
        Log(serverMsgs[sendIndex]);
        socket.write(serverMsgs[sendIndex]);
        sendIndex += 1;
    }
    Log(sendIndex);
    if (sendIndex >= serverMsgs.length) {
        Log('Anki: Goodbye! See you tomorrow!');
        sendIndex = 0;
    }
};

let sendIndex = 0;

// listen connection event
server.on("connection", function (socket) {
    // when receive messages from client ,it would response to this event.
    socket.on('data', function (data) {
        // data is Binary data
        Log(data.toString());
        setTimeout(()=> {
            sendMsg(socket);
        }, 800);
    });

    // acquire the amount of client
    server.getConnections(function (err,count) {
        Log("The client count:" + count);
    });
});

// listen in port
server.listen(port, function () {
    let address = server.address();
    Log("Server run on: http://127.0.0.1:" + address.port);
});

