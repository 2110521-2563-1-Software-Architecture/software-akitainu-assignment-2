# Assignment #1: gRPC and REST API Implementation

## Group member: Software Akitainu
1. 6030249621 Mr. Thanapat Sanguansab
2. 6030264021 Mr. Tanakorn Tampanya
3. 6031054721 Mr. Watcharit Tuntayakul
4. 6031058221 Mr. Sumet Chorthongdee
5. 6031310321 Mr. Dolwijit Jiradilok

### Screenshots of Swagger for your APIs
TODO

### Source codes of REST API's server
[/rest/server.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-1/blob/master/rest/server.js)

### Source codes of REST API's client
[/rest/client.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-1/blob/master/rest/server.js)

### How to call the methods based on gRPC and REST API side-by-side
TODO
| Functions | gRPC | REST API |
|--|--|--|
| List books |  |  |
| Insert books |  |  |
| Get books |  |  |
| Delete books |  |  |
| Watch books |  |  |

### Differences between REST API and gRPC
TODO

### Benefits of introducing interfaces in front of the gRPC and REST API of the book services
TODO

### How to call the methods based on gRPC and REST API side-by-side (after inroduced interface)
TODO
| Functions | gRPC | REST API |
|--|--|--|
| List books | listBooks(); |  listBooks(); |
| Insert books |insertBook(int id, str title, str author);  | insertBook(id,title, author); |
| Get books | getBook(int id); |  getBook(id);|
| Delete books | deleteBook(int id); | deleteBook(id); |
| Watch books | watchBooks(); | watchBooks(); |

### Component diagram representing the book services with and without interfaces
![](component_diagrams.png?raw=true)
