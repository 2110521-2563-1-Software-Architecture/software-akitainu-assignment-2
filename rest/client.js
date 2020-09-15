const axios = require("axios");
const io = require("socket.io-client");

function printError(error) {
  if (error.response) {
    console.log(`${error.response.status}: ${error.response.data}`);
  }
  return;
}

function listBooks() {
  const startTime = new Date();
  axios
    .get("http://localhost:10000/books")
    .then((response) => {
      const finishTime = new Date();
      console.log(response.data);
      console.log("Time elapse:", finishTime - startTime);
      return;
    })
    .catch((error) => printError(error));
}

function insertBook(id, title, author) {
  const book = {
    id: parseInt(id),
    title: title,
    author: author,
  };
  const startTime = new Date();
  axios
    .post("http://localhost:10000/books", book)
    .then((response) => {
      const finishTime = new Date();
      console.log(response.data);
      console.log("Time elapse:", finishTime - startTime);
      return;
    })
    .catch((error) => printError(error));
}

function getBook(id) {
  const startTime = new Date();
  axios
    .get(`http://localhost:10000/books/${id}`)
    .then((response) => {
      const finishTime = new Date();
      console.log(response.data);
      console.log("Time elapse:", finishTime - startTime);
      return;
    })
    .catch((error) => printError(error));
}

function deleteBook(id) {
  const startTime = new Date();
  axios
    .delete(`http://localhost:10000/books/${id}`)
    .then((response) => {
      const finishTime = new Date();
      console.log(response.data);
      console.log("Time elapse:", finishTime - startTime);
      return;
    })
    .catch((error) => printError(error));
}

function watchBooks() {
  const socket = io("http://localhost:10001/");
  socket.emit("watch");
  socket.on("respond", (msg) => {
    console.log(msg);
  });
}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

if (command == "list") listBooks();
else if (command == "insert")
  insertBook(process.argv[0], process.argv[1], process.argv[2]);
else if (command == "get") getBook(process.argv[0]);
else if (command == "delete") deleteBook(process.argv[0]);
else if (command == "watch") watchBooks();
