let net = require('net');
let server = new net.Server();

const port = 8686;
let log = function (msg) {
    console.log(msg);
};

server.on("connection", function (socket) {
    socket.on('data', function (data) {
        // binary data
        // log(data);
        log(data.toString());
    });
});

server.listen(port, function () {
    let address = server.address();
    log("Server run on : http://127.0.0.1:" + address.port)
});