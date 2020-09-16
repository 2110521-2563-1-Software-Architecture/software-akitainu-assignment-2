//   Copyright 2016, Google, Inc.
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//       http://www.apache.org/licenses/LICENSE-2.0
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"strconv"
	"time"

	pb "./books"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"math"
	"encoding/csv"
	"os"
	"strings"
)

var (
	address = flag.String("address", "0.0.0.0:50051", "Address of service")
)

// GetClient attempts to dial the specified address flag and returns a service
// client and its underlying connection. If it is unable to make a connection,
// it dies.
func GetClient() (*grpc.ClientConn, pb.BookServiceClient) {
	conn, err := grpc.Dial(*address, grpc.WithTimeout(5*time.Second), grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	return conn, pb.NewBookServiceClient(conn)
}

func main() {
	flag.Parse()
	ctx := context.Background()
	cmd, ok := commands[flag.Arg(0)]
	if !ok {
		usage()
	} else {
		cmd.do(ctx, flag.Args()[1:]...)
	}
}

func usage() {
	fmt.Println(`client.go is a command-line client for this codelab's gRPC service

Usage:
  client.go list                            List all books
  client.go insert <id> <title> <author>    Insert a book
  client.go get <id>                        Get a book by its ID
  client.go delete <id>                     Delete a book by its ID
  client.go watch                           Watch for inserted books`)
}

var commands = map[string]struct {
	name, desc string
	do         func(context.Context, ...string)
	usage      string
}{
	"get": {
		name:  "get",
		desc:  "Retrieves the indicated book",
		do:    doGet,
		usage: "client.go get <id>",
	},
	"list": {
		name:  "list",
		desc:  "Lists all books",
		do:    doList,
		usage: "client.go list",
	},
	"insert": {
		name:  "insert",
		desc:  "Inserts the provided book",
		do:    doInsert,
		usage: "client.go insert <id> <title> <author>",
	},
	"delete": {
		name:  "delete",
		desc:  "Deletes the indicated book",
		do:    doDelete,
		usage: "client.go delete <id>",
	},
	"watch": {
		name:  "watch",
		desc:  "Watches for inserted books",
		do:    doWatch,
		usage: "client.go watch",
	},
}

// printRespAsJson attempts to marshal the provided interface into its JSON
// representation, then prints to stdout.
func printRespAsJson(r interface{}) {
	b, err := json.MarshalIndent(r, "", "  ")
	if err != nil {
		log.Fatalf("printResp (%v): %v", r, err)
	}
	fmt.Println(string(b))
}

// doGet is a basic wrapper around the corresponding book service's RPC.
// It parses the provided arguments, calls the service, and prints the
// response. If any errors are encountered, it dies.

func get(ctx context.Context, args int, round int,maxround int, message chan<- string) {
	conn, client := GetClient()
	defer conn.Close()
	r, err := client.Get(ctx, &pb.BookIdRequest{int32(args)})
	if err != nil {
		log.Fatalf("Get book (%v): %v", args, err)
	}
	message <- "finish"
	fmt.Println("Server response:")
	printRespAsJson(r)
}

func doGet(ctx context.Context, args ...string) {
	data := [][]string{};
	for j:= 0; j < 12; j++ {
		start := time.Now();
		round := int(math.Pow(2,float64(j)));
		ch := make(chan string, round); 
		for i:=1; i <= round; i++ {
			go get(ctx, 123000,i,round, ch);
		}
	
		for len(ch) != round {
			time.Sleep(1*time.Millisecond);
		}
		elasped := time.Since(start);
		fmt.Println("time: ", elasped);
		data = append(data,[]string{strconv.Itoa(round), shortDur(elasped)});
		time.Sleep(1*time.Second);
	}
	writeFile(data,"get");
}

// doDelete is a basic wrapper around the corresponding book service's RPC.
// It parses the provided arguments, calls the service, and prints the
// response. If any errors are encountered, it dies.

func delete(ctx context.Context, args int, round int,maxround int, message chan<- string) {
	conn, client := GetClient()
	defer conn.Close()
	r, err := client.Delete(ctx, &pb.BookIdRequest{int32(args)})
	if err != nil {
		log.Fatalf("Delete book (%v): %v", args, err)
	}
	message <- "finish";
	fmt.Println("Server response:")
	printRespAsJson(r)
}

func doDelete(ctx context.Context, args ...string) {
	data := [][]string{};
	for j:= 0; j < 12; j++ {
		start := time.Now();
		round := int(math.Pow(2,float64(j)));
		ch := make(chan string, round); 
		for i:=1; i <= round; i++ {
			go delete(ctx, round+i-1,i,round, ch);
		}
	
		for len(ch) != round {
			time.Sleep(1*time.Millisecond);
		}
		elasped := time.Since(start);
		fmt.Println("time: ", elasped);
		data = append(data,[]string{strconv.Itoa(round), shortDur(elasped)});
		time.Sleep(1*time.Second);
	}
	writeFile(data,"delete");
}

// doList is a basic wrapper around the corresponding book service's RPC.
// It parses the provided arguments, calls the service, and prints the
// response. If any errors are encountered, it dies.

func list(ctx context.Context, round int, maxround int, message chan<- string) {
	conn, client := GetClient()
	defer conn.Close()
	rs, err := client.List(ctx, &pb.Empty{})
	if rs == nil || err != nil {
		log.Fatalf("List books: %v", err)
	}
	message <- "test"
	fmt.Printf("Server sent %v book(s).\n", len(rs.GetBooks()))
}

func doList(ctx context.Context, args ...string) {
	data := [][]string{};
	for j:= 0; j < 12; j++ {
		start := time.Now();
		round := int(math.Pow(2,float64(j)));
		ch := make(chan string, round); 
		for i:=1; i <= round; i++ {
			go list(ctx, i,round, ch);
		}
		for len(ch) != round {
			time.Sleep(1*time.Millisecond);
		}
		elasped := time.Since(start);
		fmt.Println("time: ", elasped);
		data = append(data,[]string{strconv.Itoa(round), shortDur(elasped)});
		time.Sleep(1*time.Second);
	}
	writeFile(data,"list");
}

// doInsert is a basic wrapper around the corresponding book service's RPC.
// It parses the provided arguments, calls the service, and prints the
// response. If any errors are encountered, it dies.

func insert(ctx context.Context, args int, round int,maxround int, message chan<- string) {
	book := &pb.Book{
		Id: int32(args),
		Title:  "t",
		Author: "a",
	}
	conn, client := GetClient();
	defer conn.Close();
	r, err := client.Insert(ctx, book);
	message <- "finish";
	
	if err != nil {
		log.Fatalf("Insert book (%v): %v", book, err)
	}
	fmt.Println("Server response:")
	printRespAsJson(r)
}

func shortDur(d time.Duration) string {
	s := d.String()
	if strings.HasSuffix(s, "m0s") {
			s = s[:len(s)-2]
	}
	if strings.HasSuffix(s, "h0m") {
			s = s[:len(s)-2]
	}
	return s
}

func doInsert(ctx context.Context, args ...string) {
	data := [][]string{};
	for j:= 0; j < 12; j++ {
		start := time.Now();
		round := int(math.Pow(2,float64(j)));
		ch := make(chan string, round); 
		for i:=1; i <= round; i++ {
			go insert(ctx, round+i-1, i,round, ch);
		}

		for len(ch) != round {
			time.Sleep(1*time.Millisecond);
		}
		elasped := time.Since(start);
		fmt.Println("time: ", elasped);
		data = append(data,[]string{strconv.Itoa(round), shortDur(elasped)});
		time.Sleep(1*time.Second);
	}
	writeFile(data,"insert");
}

// doWatch is a basic wrapper around the corresponding book service's RPC.
// It parses the provided arguments, calls the service, and prints the
// response. If any errors are encountered, it dies.
func doWatch(ctx context.Context, args ...string) {
	conn, client := GetClient()
	defer conn.Close()
	stream, err := client.Watch(ctx, &pb.Empty{})
	if err != nil {
		log.Fatalf("Watch books: %v", err)
	}
	for {
		book, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("Watch books stream: %v", err)
		}
		fmt.Println("Server stream data received:")
		printRespAsJson(book)
	}
}


func writeFile(data [][]string, method string) {
	fileName := "ScenarioC_gRPC_" + method+".csv";
	file, err := os.Create(fileName);
  checkError("Cannot create file", err)
  defer file.Close()

  writer := csv.NewWriter(file)
  defer writer.Flush()

  for _, value := range data {
      err := writer.Write(value)
      checkError("Cannot write to file", err)
  }
}

func checkError(message string, err error) {
	if err != nil {
			log.Fatal(message, err)
	}
}