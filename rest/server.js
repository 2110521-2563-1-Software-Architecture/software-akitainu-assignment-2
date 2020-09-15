const express = require("express");
const io = require("socket.io");
const internalIO = require("socket.io-client");
const socket = internalIO("http://localhost:10002/");

const serverIO = io.listen(10002);
const clientIO = io.listen(10001);

var books = [
  {
    id: 12345,
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
  },
];

const bodyParser = require("body-parser");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get("/books", (req, res) => {
  return res.send(books);
});

app.post("/books", (req, res) => {
  const book = {
    id: req.body.id,
    title: req.body.title,
    author: req.body.author,
  };
  var i;
  for (i = 0; i < books.length; i++) {
    if (books[i].id === book.id) {
      res.status(409);
      return res.send("Duplicated id");
    }
  }
  socket.emit("new-books", book);
  books.push(book);
  res.status(200);
  return res.send({});
});

app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  book = books.filter((book) => book.id === parseInt(id));
  if (book.length === 1) {
    res.status(200);
    return res.send(book[0]);
  } else {
    res.status(404);
    return res.send("Not found");
  }
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  updateBooks = books.filter((book) => book.id !== parseInt(id));
  books = updateBooks;
  res.status(200);
  return res.send({});
});

serverIO.on("connection", (serverSocket) => {
  clientIO.on("connection", (clientSocket) => {
    clientSocket.on("watch", () => {
      serverSocket.on("new-books", (book) => {
        clientSocket.emit(
          "respond",
          "Server stream data received:" + JSON.stringify(book)
        );
      });
    });
  });
});

app.listen(10000, () => console.log(`Listening on port 10000!`));
