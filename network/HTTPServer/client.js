const http = require('http');

const option = {
    host: '127.0.0.1',
    port: 8888,
    method: 'GET',
    path: '/aaa',
    protocol: 'http:',
    timeout:1000
}

const req = http.request(option, function (res) {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERs: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();