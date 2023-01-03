const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Hello, Deer!");
});

server.listen(3001);
