const http = require("http");
const fs = require("fs/promises");

const server = http.createServer((request, response) => {
    const {method, url} = request;

    if (url === "/api" && method === "GET") {
        
        response.statusCode = 200; 
        response.write(JSON.stringify({msg:"hello"}));
        response.end()
       
    };

    if (url === "/api/books" && method === "GET") {
        fs.readFile("./data/books.json", "utf-8").then((bookData) => {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 200;
            response.write(JSON.stringify({books : JSON.parse(bookData)}))
            response.end() 
        })
        
     };

     if (url === "/api/authors" && method === "GET") {
        fs.readFile("./data/authors.json", "utf-8").then((authorData) => {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 200;
            response.write(JSON.stringify({authors : JSON.parse(authorData)}))
            response.end() 
        })
        
     };
     
});

server.listen(9090, (err) => {
    if (err) console.log(err);
    else console.log(`server listening to: 9090`)
})