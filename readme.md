# Assignment #1: gRPC and REST API Implementation

## Group member: Software Akitainu
1. 6030249621 Mr. Thanapat Sanguansab
2. 6030264021 Mr. Tanakorn Tampanya
3. 6031054721 Mr. Watcharit Tuntayakul
4. 6031058221 Mr. Sumet Chorthongdee
5. 6031310321 Mr. Dolwijit Jiradilok

### Screenshots of Swagger for your APIs
![](swagger.PNG?raw=true)
![](list.PNG?raw=true)
![](insert.PNG?raw=true)
![](get.PNG?raw=true)
![](delete.PNG?raw=true)
![](watch.PNG?raw=true)

### Source codes of REST API's server
[/rest/server.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-1/blob/master/rest/server.js)

### Source codes of REST API's client
[/rest/client.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-1/blob/master/rest/server.js)

### How to call the methods based on gRPC and REST API side-by-side
| Functions | gRPC | REST API |
|--|--|--|
| List books | client.list({}, function(error, books) {<br>&nbsp;&nbsp;printResponse(error, books);<br>}); | `axios.get('http://localhost:10000/books')`  |
| Insert books | client.insert(book, function(error, empty) {<br>&nbsp;&nbsp;printResponse(error, empty);<br>}); | `axios.post('http://localhost:10000/books', book)` |
| Get books | client.get({ id: parseInt(id) }, function(error, book) {<br>&nbsp;&nbsp;printResponse(error, book);<br>}); | ```axios.get(`http://localhost:1000/books/${id}`, book)``` |
| Delete books | client.delete({ id: parseInt(id) }, function(error, empty) {<br>&nbsp;&nbsp;printResponse(error, empty);<br>}); | ```axios.delete(`http://localhost:10000/books/${id}`)``` |
| Watch books | client.watch({}) | `socket.on("respond",function(msg))` |

### Differences between REST API and gRPC
REST API and gRPC have major differences in protocol and transmission format. GRPC is developed using https2.0 transmission, which has header compression and supports continuous transmission within one tcp connection compared to the rest API that uses http1, gRPC has also been modified transmission format to protobuf, which supports specifying variable types and variables that require / optional and object schema compared to the object json the REST API uses without this capability, and from the above reason gRPC can do higher speed in a smaller size of data package. But it's not as widespread as the rest API.

### Benefits of introducing interfaces in front of the gRPC and REST API of the book services
- Making the code easier to understand 
- User must know only what to use (function parameters) and what to get (function response)


### How to call the methods based on gRPC and REST API side-by-side (after inroduced interface)
| Functions | gRPC | REST API |
|--|--|--|
| List books | listBooks(); |  listBooks(); |
| Insert books |insertBook(int id, str title, str author);  | insertBook(id,title, author); |
| Get books | getBook(int id); |  getBook(id);|
| Delete books | deleteBook(int id); | deleteBook(id); |
| Watch books | watchBooks(); | watchBooks(); |

### Component diagram representing the book services with and without interfaces
![](component_diagrams.png?raw=true)
