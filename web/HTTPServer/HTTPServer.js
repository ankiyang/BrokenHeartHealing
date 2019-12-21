// import express frame
const express = require('express');

// init express
const app = express();

// get method
app.get('', function (req, res) {
    console.log('request path:' + req.path);
    var result = {
        code: 200,
        data: {
            name: "anki",
            des: "AUT MCIS"
        },
    };

    // response will back to client as a json format
    res.json(result);
});

// listen 8888
app.listen(8888);
console.log('app.start: http://127.0.0.1:8888');

// now we finish writing a http server port, port is 8888
// and then we need a client to request port