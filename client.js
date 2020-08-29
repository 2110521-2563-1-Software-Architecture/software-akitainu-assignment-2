// CLIENT

const axios = require('axios');

function listBooks() {
    axios.get('http://localhost:10000/books')
        .then((response) => {console.log(response.data); return;})
        .catch((error) => {console.log(error); return;})
}

function insertBook(id, title, author) {
    const book = {
        id: parseInt(id),
        title: title,
        author: author
    };
    axios.post('http://localhost:10000/books', book)
        .then((response) => {console.log(response.data); return;})
        .catch((error) => {console.log(error); return;})
}

function getBook(id) {
    axios.get(`http://localhost:10000/books/${id}`, book)
        .then((response) => {console.log(response.data); return;})
        .catch((error) => {console.log(error); return;})
}

function deleteBook(id) {
    axios.delete(`http://localhost:10000/books/${id}`)
        .then((response) => {console.log(response.data); return;})
        .catch((error) => {console.log(error); return;})
}

// TODO: Implement 'watchBook()'
function watchBook() {
    console.log('TODO');
}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

if (command == 'list')
    listBooks();
else if (command == 'insert')
    insertBook(process.argv[0], process.argv[1], process.argv[2]);
else if (command == 'get')
    getBook(process.argv[0]);
else if (command == 'delete')
    deleteBook(process.argv[0]);
else if (command == 'watch')
    watchBooks();