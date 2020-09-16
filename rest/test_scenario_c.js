const axios = require("axios");
const io = require("socket.io-client");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function printError(error) {
  if (error.response) {
    console.log(`${error.response.status}: ${error.response.data}`);
  }
  return;
}

function writeFile(data, method) {
  const csvWriter = createCsvWriter({
    path: 'ScenarioC_REST_'+method+'.csv',
    header: [
      {id: 'numberOfCall', title: 'Number of call'},
      {id: 'time', title: 'Time'},
    ]
  });
  console.log("data: ", data);
  csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));
}

function listBooks() {
  const data = [];
  for(let j=0; j < 13; j++) {
    const startTime = new Date();
    const round = 2**j;
    const listOfRequest = [];

    for(let i=1; i <= round; i++) {
      listOfRequest.push(axios
        .get("http://localhost:10000/books"));
    }

    Promise.all(listOfRequest).then((responses) => {
      const finishTime = new Date();
      data.push({numberOfCall: round, time: finishTime - startTime});
      if(data.length === 13) {
        writeFile(data,"list");
      }
    }).catch(errors => {});
}
}

function insertBook(id, title, author) {
  const data = [];
  
  for(let j=0; j < 13; j++) {
    const startTime = new Date();
    const round = 2**j;
    const listOfRequest = [];

    for(let i=1; i <= round; i++) {
      const book = {
        id: round+i-1,
        title: 'title',
        author: 'author',
      };
      listOfRequest.push(axios
        .post("http://localhost:10000/books", book));
    }

    Promise.all(listOfRequest).then((responses) => {
      const finishTime = new Date();
      data.push({numberOfCall: round, time: finishTime - startTime});
      if(data.length === 13){
        writeFile(data, "insert");
      }
    }).catch(errors => printError(errors));
  }
}


function getBook(id) {
  const data = [];

  for(let j=0; j < 13; j++) {
    const startTime = new Date();
    const round = 2**j;
    const listOfRequest = [];

    for(let i=1; i <= round; i++) {
      listOfRequest.push(axios
        .get(`http://localhost:10000/books/${id}`));
    }

    Promise.all(listOfRequest).then((responses) => {
      const finishTime = new Date();
      data.push({numberOfCall: round, time: finishTime - startTime});
      if(data.length === 13) {
        writeFile(data, "get");
      }
    }).catch(errors => {});
}
}

function deleteBook(id) {
  const data = [];

  for(let j=0; j < 13; j++) {
    const startTime = new Date();
    const round = 2**j;
    const listOfRequest = [];

    for(let i=1; i <= round; i++) {
      listOfRequest.push(axios
        .delete(`http://localhost:10000/books/${round+i-1}`));
    }

    Promise.all(listOfRequest).then((responses) => {
      const finishTime = new Date();
      data.push({numberOfCall: round, time: finishTime - startTime});
      if(data.length === 13) {
        writeFile(data, "delete");
      }
    }).catch(errors => printError(errors));
}
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