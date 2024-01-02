const http = require("http");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (url === "/api" && method === "GET") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "hello" }));
  }

  if (url === "/api/books" && method === "GET") {
    fs.readFile("./data/books.json", "utf-8").then((data) => {
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ books: JSON.parse(data) }));
    });
  }

  if (url.startsWith("/api/books/") && method === "GET") {
    const bookId = parseInt(url.split("/").pop());
    fs.readFile("./data/books.json", "utf-8").then((data) => {
      const bookData = JSON.parse(data);
      bookData.forEach((book) => {
        if (book.bookId === bookId) {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ foundBook: book }));
        }
      });
    });
  }

  if (url === "/api/authors" && method === "GET") {
    fs.readFile("./data/authors.json", "utf-8").then((data) => {
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ authors: JSON.parse(data) }));
    });
  }

  if (url === "/api/books" && method === "POST") {
    let body = "";
    request.on("data", (packet) => {
      body += packet;
    });

    request.on("end", async () => {
      try {
        response.writeHead(201, {
          "Content-Type": "application/json",
        });

        const newBook = JSON.parse(body);
        newBook.bookId = uuidv4();

        const oldBooks = JSON.parse(
          await fs.readFile("./data/books.json", "utf-8")
        );
        oldBooks.push(newBook);

        fs.writeFile("./data/books.json", JSON.stringify(oldBooks, null, 2));
        response.end(JSON.stringify(newBook));
      } catch {
        response.writeHead(500, {
          "Content-Type": "application/json",
        });
        response.end(JSON.stringify({ Error: "Could not add the book." }));
      }
    });
  }
});

server.listen(6969, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running on port 6969");
  }
});
