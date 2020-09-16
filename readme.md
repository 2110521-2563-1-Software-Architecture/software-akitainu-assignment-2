# Assignment #2: gRPC and REST API benchmarking

## Group member: Software Akitainu
1. 6030249621 Mr. Thanapat Sanguansab
2. 6030264021 Mr. Tanakorn Tampanya
3. 6031054721 Mr. Watcharit Tuntayakul
4. 6031058221 Mr. Sumet Chorthongdee
5. 6031310321 Mr. Dolwijit Jiradilok

### Performance benchmark: gRPC vs REST API results & explanations

**1. Scenario A:** Single client with a small call to insert a book item, a bigger call to insert a list of multiple book items  
  
&nbsp;&nbsp;&nbsp;&nbsp;For this scenario, we call each service sequentially (waiting for a response until make request again) for a total of 500 times for each service. We tested in this order: insert, list, get, and delete (book id 0-499) to make sure there is no error response.  
  
&nbsp;&nbsp;&nbsp;&nbsp;We will represent the result with 2 graphs for each service: response time/number of calls to see if the number of books in the server affects performance and cumulative response time/number of calls to see overall performance.  
![](scenarioA_insert.png?raw=true)
![](scenarioA_list.png?raw=true)
![](scenarioA_get.png?raw=true)
![](scenarioA_delete.png?raw=true)  
&nbsp;&nbsp;&nbsp;&nbsp;From the graphs, the number of books in the server does not affect performance (probably 500 is not that much) while performance drop might come from other uncontrolled factors. For overall performance, gPRC is faster than REST API in every service except list service which gPRC and REST API have around the same performance (there are 500 books every time we use 'list' service, so, the performance difference is not from the number of books)  
  
**Benchmark & code for scenario A:**  
  
&nbsp;&nbsp;&nbsp;&nbsp;We used command line to make request to the services, and get response time from stdout (implemented in client.js) from the command line. To replicate the experiment, cd to /rest or /grpc and use command ```node test_scenario_a.js <service>``` (service is insert, list, get, or delete)   
- For gRPC: [/grpc/test_scenario_a.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-2/blob/master/grpc/test_scenario_a.js)  
- For REST API: [/rest/test_scenario_a.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-2/blob/master/rest/test_scenario_a.js)  
  
**2. Scenario B:** Multiple clients with different kind of calls  
  
&nbsp;&nbsp;&nbsp;&nbsp;As random service results in varied runtime, this experiment called random 1000 services (both gRPC and REST API) 3 times and then plot average time (ms) with the number of called services.  
![](scenarioB.png?raw=true)  
**Benchmark & code for scenario B:**  
  
&nbsp;&nbsp;&nbsp;&nbsp;We used command line to make request to the services, and get response time from stdout (implemented in client.js) from the command line. To replicate the experiment, cd to /rest or /grpc and use command ```node test_scenario_b.js```   
- For gRPC: [/grpc/test_scenario_b.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-2/blob/master/grpc/test_scenario_b.js)  
- For REST API: [/rest/test_scenario_b.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-2/blob/master/rest/test_scenario_b.js)  
  
**3. Scenario C:** Vary the number of concurrent calls from 1 to 4096 calls  
  
&nbsp;&nbsp;&nbsp;&nbsp;For this experiment, we create concurrent call increased by exponential of 2 ex.0,1,2,4,8,...,4096. For gRPC, the maximum concurrent call that can be received is 2048 calls (actually maybe 3000 calls) and for rest, this method can receive all 4096 calls. The graph that is shown below plot by exponential of 2 for axis x.
![](scenarioC_insert.png?raw=true)
![](scenarioC_list.png?raw=true)
![](scenarioC_get.png?raw=true)
![](scenarioC_delete.png?raw=true)
&nbsp;&nbsp;&nbsp;&nbsp;Fron the graph, gRPC seems to perform better for all case until 4096 calls that gRPC cannot get all of request but for REST API, it can get all of it. So, the performance of gRPC in this scenario is better than REST API if the request is under the maximum concurrent calls that gRPC can be received.
 
**Benchmark & code for scenario C:**  
  
&nbsp;&nbsp;&nbsp;&nbsp;We use for to create concurrent call for REST and gRPC. To replicate the experiment, cd to /rest or /grpc and use command node test_scenario_c.js or go run test_scenario_c.go <service> (service is insert, list, get, or delete)
- For gRPC: [/grpc/test_scenario_c.go](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-2/blob/master/grpc/test_scenario_c.go)  
- For REST API: [/rest/test_scenario_c.js](https://github.com/2110521-2563-1-Software-Architecture/software-akitainu-assignment-2/blob/master/rest/test_scenario_c.js)  


### Discussion of the results why one method is better than the other in which scenarios

&nbsp;&nbsp;&nbsp;&nbsp;From the results, we noticed something odd in scenario A: gRPC and REST API have similar performance in a specific service (list) while gRPC's performance is significantly better than REST API in every case of the experiment. The reason is:  
  
&nbsp;&nbsp;&nbsp;&nbsp;gRPC and REST API have major differences in protocol and transmission format. gRPC is developed using HTTP/2 transmission, which has header compression and supports continuous transmission within one TCP connection compared to the REST API that uses HTTP/1.1. gRPC has also been modified transmission format to protobuf, which supports specifying variable types, variables that required/optional, and object schema, whereas REST API's JSON object does not have these capabilities.  
  
&nbsp;&nbsp;&nbsp;&nbsp;From the above reason, **gRPC can do higher speed in a smaller size of data package**, so when responding 'list' request in scenario A, gRPC did not have an advantage over REST API in our experiment (we requested 'list' when there are 500 books, so the data is quite large) For other scenarios, gRPC is faster than REST API in every case (in scenario C, we requested 'list' when there are 1 book, so the data is small and did not have the same result as scenario A) as the package transferred is quite small (scenario C) and average (scenario B, should be quite small or not large enough to have the same effect in scenario A)

### Comparison of the gRPC and REST API

**Language neutral**  
  
&nbsp;&nbsp;&nbsp;&nbsp;Both REST API and gRPC are language-neutral since they could be implemented in many different programming languages. Although, REST API has taken advantage of being the most popular and suitable for more use cases.  
  
**Ease of use**  
  
&nbsp;&nbsp;&nbsp;&nbsp;Since REST API is more widespread than gRPC, programmers might feel more familiar with REST API. But gRPC has less word count and line of code when compared to REST API. For the example, server.js implemented by gRPC has 170 words and 57 lines while server.js implemented by REST API has 206 words and 82 lines.  
  
**Performance**  
  
&nbsp;&nbsp;&nbsp;&nbsp;According to the result from scenario B, gRPC has better performance than REST API about 2.5 times. Since gRPC and REST API have major differences in protocol and transmission format. gRPC uses HTTP/2 while REST API uses HTTP/1.1.  

### Do our results comply with the result in this [medium](https://medium.com/@bimeshde/grpc-vs-rest-performance-simplified-fd35d01bbd4)? How?
&nbsp;&nbsp;&nbsp;&nbsp;**Yes**, our results seem to go the same way with the one in the medium. In the performance aspect, gRPC has better performance than REST API. And in the ease of use aspect, it depends on the developer that which language is more familiar with. For example, our team is more familiar with REST API than gRPC, so coding REST API is easier and faster than coding gRPC.
