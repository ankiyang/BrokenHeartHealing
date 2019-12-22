
const http = require('http');

const server = new http.Server();

// Node http is event-based and we could listen different event through 'on' method
// In this code, we listen request event, and the timing of trigger is when a client make a request
// And then, it will execute this event. It would bring request object 'req' and response object 'res'
// 'req' is for acquire the request data from client, so that server could do the right response.


server.on('request', function (req, res) {
    let path = req.url;
    if (path.indexOf('/aaa') ==  0) {
        res.writeHead(200, {
            "Content-type": "application/json"
        });
        let data = {
            title: "ankianki",
            des: "AUT"
        };
        res.write(JSON.stringify(data));
    } else {
        res.writeHead(404,  {
            "Content-type": "application/json"
        });
        let data = {
            code: "404",
            msg: "not found"
        };
        res.write(JSON.stringify(data));
    }
    res.end();
});

server.listen(8888, function(){
    console.log('Server run in : http://127.0.0.1:8888')
});